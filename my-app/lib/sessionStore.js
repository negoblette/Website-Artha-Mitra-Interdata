import { createClient } from 'redis';
import crypto from 'crypto';

const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = process.env.REDIS_PORT || '6379';
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
const SESSION_PREFIX = 'ami:session:';
const SESSION_MAX_AGE = 3600; // 1 jam dalam detik

let redisClient;
let redisConnectPromise;
let redisAvailable = null; // null = unknown, true/false = checked

// ─── In-Memory Fallback ──────────────────────────────────────────────────────
const memorySessionStore = new Map();
const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes

let cleanupTimer = null;
function startMemoryCleanup() {
  if (cleanupTimer) return;
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of memorySessionStore) {
      if (entry.expiresAt <= now) {
        memorySessionStore.delete(key);
      }
    }
  }, CLEANUP_INTERVAL);
  if (cleanupTimer.unref) cleanupTimer.unref();
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

async function getRedisClient() {
  // If we already checked and Redis is not available, return null
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
          console.error('[Session Store] Redis client error:', error.message);
          loggedError = true;
        }
        redisAvailable = false;
      });

      redisConnectPromise = redisClient.connect().then(() => {
        redisAvailable = true;
        console.log('[Session Store] Redis connected successfully');
        return redisClient;
      }).catch((error) => {
        console.warn('[Session Store] Redis not available, using in-memory fallback:', error.message);
        redisConnectPromise = null;
        redisAvailable = false;
        // Fully release the zombie client so it stops retrying/emitting errors
        const deadClient = redisClient;
        redisClient = undefined;
        deadClient?.destroy();
        return null;
      });
    } catch (error) {
      console.warn('[Session Store] Redis initialization failed:', error.message);
      redisAvailable = false;
      return null;
    }
  }
  return redisConnectPromise;
}

/**
 * Check if we're using in-memory fallback (for logging/diagnostics)
 */
export function isUsingMemoryFallback() {
  return redisAvailable === false;
}

/**
 * Create a new session and store it in Redis (or memory fallback)
 * @param {Object} sessionData - Data to store in session
 * @returns {string} Session ID
 */
export async function createSession(sessionData) {
  const sessionId = crypto.randomUUID();

  const session = {
    ...sessionData,
    createdAt: Date.now(),
  };

  try {
    const client = await getRedisClient();

    if (!client) {
      // Fallback: store in memory
      console.log('[Session Store] Using in-memory fallback for session:', sessionId);
      memorySessionStore.set(`${SESSION_PREFIX}${sessionId}`, {
        value: JSON.stringify(session),
        expiresAt: Date.now() + SESSION_MAX_AGE * 1000,
      });
      startMemoryCleanup();
      return sessionId;
    }

    await client.set(
      `${SESSION_PREFIX}${sessionId}`,
      JSON.stringify(session),
      { EX: SESSION_MAX_AGE }
    );

    console.log(`[Session Store] Created session: ${sessionId}`);
    return sessionId;
  } catch (error) {
    console.error('[Session Store] Redis failed, using in-memory fallback:', error.message);
    // Fallback: store in memory so login still works
    memorySessionStore.set(`${SESSION_PREFIX}${sessionId}`, {
      value: JSON.stringify(session),
      expiresAt: Date.now() + SESSION_MAX_AGE * 1000,
    });
    startMemoryCleanup();
    return sessionId;
  }
}

/**
 * Get session data from Redis (or memory fallback)
 * @param {string} sessionId
 * @returns {Object|null} Session data or null if not found
 */
export async function getSession(sessionId) {
  if (!sessionId) return null;

  try {
    const client = await getRedisClient();

    if (!client) {
      // Fallback: read from memory
      const entry = memorySessionStore.get(`${SESSION_PREFIX}${sessionId}`);
      if (!entry) return null;
      if (entry.expiresAt <= Date.now()) {
        memorySessionStore.delete(`${SESSION_PREFIX}${sessionId}`);
        return null;
      }
      return JSON.parse(entry.value);
    }

    const data = await client.get(`${SESSION_PREFIX}${sessionId}`);

    if (!data) {
      return null;
    }

    const session = JSON.parse(data);

    // Check if session has expired
    if (session.createdAt + (SESSION_MAX_AGE * 1000) < Date.now()) {
      console.log(`[Session Store] Session expired: ${sessionId}`);
      await deleteSession(sessionId);
      return null;
    }

    return session;
  } catch (error) {
    console.error('[Session Store] Failed to get session, trying memory:', error.message);
    // Try memory fallback
    const entry = memorySessionStore.get(`${SESSION_PREFIX}${sessionId}`);
    if (!entry || entry.expiresAt <= Date.now()) {
      if (entry) memorySessionStore.delete(`${SESSION_PREFIX}${sessionId}`);
      return null;
    }
    return JSON.parse(entry.value);
  }
}

/**
 * Delete session from Redis (or memory fallback)
 * @param {string} sessionId
 */
export async function deleteSession(sessionId) {
  if (!sessionId) return;

  // Always try to delete from memory too
  memorySessionStore.delete(`${SESSION_PREFIX}${sessionId}`);

  try {
    const client = await getRedisClient();

    if (!client) {
      return; // Already deleted from memory above
    }

    await client.del(`${SESSION_PREFIX}${sessionId}`);
    console.log(`[Session Store] Deleted session: ${sessionId}`);
  } catch (error) {
    console.error('[Session Store] Failed to delete session from Redis:', error.message);
  }
}

/**
 * Revoke a session (mark as invalid)
 * @param {string} sessionId
 */
export async function revokeSession(sessionId) {
  if (!sessionId) return;

  try {
    const client = await getRedisClient();

    if (!client) {
      // Memory fallback: store revocation flag
      memorySessionStore.set(`${SESSION_PREFIX}revoked:${sessionId}`, {
        value: '1',
        expiresAt: Date.now() + SESSION_MAX_AGE * 1000,
      });
      startMemoryCleanup();
      console.log(`[Session Store] Revoked session (memory): ${sessionId}`);
      return;
    }

    await client.set(
      `${SESSION_PREFIX}revoked:${sessionId}`,
      '1',
      { EX: SESSION_MAX_AGE }
    );
    console.log(`[Session Store] Revoked session: ${sessionId}`);
  } catch (error) {
    console.error('[Session Store] Failed to revoke session:', error.message);
    // Fallback: store in memory
    memorySessionStore.set(`${SESSION_PREFIX}revoked:${sessionId}`, {
      value: '1',
      expiresAt: Date.now() + SESSION_MAX_AGE * 1000,
    });
    startMemoryCleanup();
  }
}

/**
 * Check if session is revoked
 * @param {string} sessionId
 * @returns {boolean}
 */
export async function isSessionRevoked(sessionId) {
  if (!sessionId) return false;

  try {
    const client = await getRedisClient();

    if (!client) {
      // Memory fallback
      const entry = memorySessionStore.get(`${SESSION_PREFIX}revoked:${sessionId}`);
      if (!entry || entry.expiresAt <= Date.now()) return false;
      return entry.value === '1';
    }

    const result = await client.get(`${SESSION_PREFIX}revoked:${sessionId}`);
    return result === '1';
  } catch (error) {
    console.error('[Session Store] Failed to check session revocation:', error.message);
    // Check memory fallback
    const entry = memorySessionStore.get(`${SESSION_PREFIX}revoked:${sessionId}`);
    if (!entry || entry.expiresAt <= Date.now()) return false;
    return entry.value === '1';
  }
}

/**
 * Cleanup expired sessions
 */
export async function cleanupExpiredSessions() {
  // Clean memory store
  const now = Date.now();
  for (const [key, entry] of memorySessionStore) {
    if (entry.expiresAt <= now) {
      memorySessionStore.delete(key);
    }
  }

  try {
    const client = await getRedisClient();

    if (!client) {
      return; // Memory cleanup done above
    }

    const keys = await client.keys(`${SESSION_PREFIX}*`);

    let cleaned = 0;
    for (const key of keys) {
      // Skip revoked keys (they have separate TTL)
      if (key.includes('revoked:')) continue;

      const ttl = await client.ttl(key);
      if (ttl <= 0) {
        await client.del(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`[Session Store] Cleaned up ${cleaned} expired sessions`);
    }
  } catch (error) {
    console.error('[Session Store] Failed to cleanup sessions:', error.message);
  }
}

export { SESSION_MAX_AGE };