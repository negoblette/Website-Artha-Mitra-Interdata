import { createClient } from 'redis';

const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = process.env.REDIS_PORT || '6379';
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
const PREFIX = 'ami:rate-limit';

let redisClient;
let redisConnectPromise;
let redisAvailable = null; // null = unknown, true/false = checked

// ─── In-Memory Fallback ──────────────────────────────────────────────────────
const memoryStore = new Map();
const CLEANUP_INTERVAL = 60 * 1000; // 60 seconds

// Periodic cleanup to prevent memory leaks
let cleanupTimer = null;
function startMemoryCleanup() {
  if (cleanupTimer) return;
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of memoryStore) {
      if (entry.expiresAt <= now) {
        memoryStore.delete(key);
      }
    }
  }, CLEANUP_INTERVAL);
  // Don't block process exit
  if (cleanupTimer.unref) cleanupTimer.unref();
}

function memoryGet(key) {
  const entry = memoryStore.get(key);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    memoryStore.delete(key);
    return null;
  }
  return entry.value;
}

function memorySet(key, value, ttlSeconds) {
  memoryStore.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
  startMemoryCleanup();
}

function memoryIncr(key, ttlSeconds) {
  const existing = memoryGet(key);
  const newCount = (existing || 0) + 1;
  // Preserve original TTL if key already exists
  const entry = memoryStore.get(key);
  if (entry && entry.expiresAt > Date.now()) {
    entry.value = newCount;
  } else {
    memorySet(key, newCount, ttlSeconds);
  }
  return newCount;
}

function memoryDel(...keys) {
  for (const key of keys) {
    memoryStore.delete(key);
  }
}

// ─── Redis Client ────────────────────────────────────────────────────────────

function buildRedisUrl() {
  const base = `redis://${REDIS_HOST}:${REDIS_PORT}`;
  if (REDIS_PASSWORD) {
    const encodedPassword = encodeURIComponent(REDIS_PASSWORD);
    return `redis://:${encodedPassword}@${REDIS_HOST}:${REDIS_PORT}`;
  }
  return base;
}

function getClientIp(request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

async function getRedisClient() {
  // If we already know Redis is unavailable, skip
  if (redisAvailable === false) {
    return null;
  }

  if (redisClient?.isReady) {
    return redisClient;
  }

  if (!redisConnectPromise) {
    try {
      const REDIS_URL = buildRedisUrl();
      redisClient = createClient({
        url: REDIS_URL,
        socket: {
          connectTimeout: 2000, // fail fast instead of hanging
          reconnectStrategy: false, // never auto-retry; we handle fallback ourselves
        },
      });

      let loggedError = false;
      redisClient.on('error', (error) => {
        // Avoid log spam: only log the first error for this client instance
        if (!loggedError) {
          console.error('[Rate Limit] Redis client error:', error.message);
          loggedError = true;
        }
        redisAvailable = false;
      });

      redisConnectPromise = redisClient.connect().then(() => {
        redisAvailable = true;
        console.log('[Rate Limit] Redis connected');
        return redisClient;
      }).catch((error) => {
        console.warn('[Rate Limit] Redis not available, using in-memory fallback:', error.message);
        redisConnectPromise = null;
        redisAvailable = false;
        // Fully release the zombie client so it stops retrying/emitting errors
        const deadClient = redisClient;
        redisClient = undefined;
        deadClient?.destroy();
        return null;
      });
    } catch (error) {
      console.warn('[Rate Limit] Redis init failed, using in-memory fallback:', error.message);
      redisAvailable = false;
      return null;
    }
  }
  return redisConnectPromise;
}

function buildBaseKey(keyPrefix, ip) {
  return `${keyPrefix}:${ip}`;
}

// ─── Rate Limit Logic (In-Memory) ───────────────────────────────────────────

function checkRateLimitMemory(ip, keyPrefix, options) {
  const {
    limit = 5,
    windowSeconds = 10 * 60,
    lockoutSeconds = 15 * 60,
  } = options;

  const baseKey = `${PREFIX}:${buildBaseKey(keyPrefix, ip)}`;
  const lockKey = `${baseKey}:lock`;

  // Check lockout
  const lockedUntil = memoryGet(lockKey);
  if (lockedUntil) {
    const retryAfter = Math.max(
      1,
      Math.ceil((Number(lockedUntil) - Date.now()) / 1000)
    );
    return { allowed: false, locked: true, retryAfter };
  }

  // Increment counter
  const count = memoryIncr(baseKey, windowSeconds);

  if (count > limit) {
    const retryAfter = lockoutSeconds;
    memorySet(lockKey, String(Date.now() + lockoutSeconds * 1000), lockoutSeconds);
    return { allowed: false, locked: true, retryAfter };
  }

  return {
    allowed: true,
    locked: false,
    remaining: Math.max(limit - count, 0),
  };
}

// ─── Rate Limit Logic (Redis) ───────────────────────────────────────────────

async function checkRateLimitRedis(client, ip, keyPrefix, options) {
  const {
    limit = 5,
    windowSeconds = 10 * 60,
    lockoutSeconds = 15 * 60,
  } = options;

  const baseKey = buildBaseKey(keyPrefix, ip);
  const lockKey = `${baseKey}:lock`;

  const lockedUntil = await client.get(lockKey);
  if (lockedUntil) {
    const retryAfter = Math.max(
      1,
      Math.ceil((Number(lockedUntil) - Date.now()) / 1000)
    );
    return { allowed: false, locked: true, retryAfter };
  }

  const count = await client.incr(baseKey);

  if (count === 1) {
    await client.expire(baseKey, windowSeconds);
  }

  if (count > limit) {
    const retryAfter = lockoutSeconds;
    await client.set(lockKey, String(Date.now() + lockoutSeconds * 1000), {
      EX: lockoutSeconds,
    });
    return { allowed: false, locked: true, retryAfter };
  }

  return {
    allowed: true,
    locked: false,
    remaining: Math.max(limit - count, 0),
  };
}

// ─── Public API ─────────────────────────────────────────────────────────────

export async function checkRateLimit(request, keyPrefix, options = {}) {
  const ip = getClientIp(request);

  try {
    const client = await getRedisClient();

    if (!client) {
      // Fallback to in-memory rate limiting
      return checkRateLimitMemory(ip, keyPrefix, options);
    }

    return await checkRateLimitRedis(client, ip, keyPrefix, options);
  } catch (error) {
    console.error('[Rate Limit] Redis error, falling back to memory:', error.message);
    return checkRateLimitMemory(ip, keyPrefix, options);
  }
}

export async function clearRateLimit(request, keyPrefix) {
  const ip = getClientIp(request);
  const baseKey = buildBaseKey(keyPrefix, ip);

  try {
    const client = await getRedisClient();

    if (!client) {
      // Clear from memory store
      memoryDel(
        `${PREFIX}:${baseKey}`,
        `${PREFIX}:${baseKey}:lock`
      );
      return;
    }

    await client.del(baseKey, `${baseKey}:lock`);
  } catch (error) {
    console.error('[Rate Limit] Failed to clear rate limit:', error.message);
    // Also try clearing memory store
    memoryDel(
      `${PREFIX}:${baseKey}`,
      `${PREFIX}:${baseKey}:lock`
    );
  }
}