import { createClient } from 'redis';
import crypto from 'crypto';

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const SESSION_PREFIX = 'ami:session:';
const SESSION_MAX_AGE = 3600; // 1 jam dalam detik

let redisClient;
let redisConnectPromise;
let redisAvailable = null; // null = unknown, true/false = checked

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
      redisClient = createClient({ url: REDIS_URL });

      redisClient.on('error', (error) => {
        console.error('[Session Store] Redis client error:', error.message);
        redisAvailable = false;
      });

      redisConnectPromise = redisClient.connect().then(() => {
        redisAvailable = true;
        console.log('[Session Store] Redis connected successfully');
        return redisClient;
      }).catch((error) => {
        console.warn('[Session Store] Redis not available, falling back to JWT:', error.message);
        redisConnectPromise = null;
        redisClient = undefined;
        redisAvailable = false;
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
 * Create a new session and store it in Redis
 * @param {Object} sessionData - Data to store in session
 * @returns {string} Session ID
 */
export async function createSession(sessionData) {
  const sessionId = crypto.randomUUID();

  try {
    const client = await getRedisClient();

    // If Redis is not available, return session ID anyway
    // (will be handled by fallback in adminAuth)
    if (!client) {
      console.warn('[Session Store] Redis not available, session not persisted');
      return sessionId;
    }

    const session = {
      ...sessionData,
      createdAt: Date.now(),
    };

    await client.set(
      `${SESSION_PREFIX}${sessionId}`,
      JSON.stringify(session),
      { EX: SESSION_MAX_AGE }
    );

    console.log(`[Session Store] Created session: ${sessionId}`);
    return sessionId;
  } catch (error) {
    console.error('[Session Store] Failed to create session:', error);
    return sessionId; // Return ID anyway, fallback will handle it
  }
}

/**
 * Get session data from Redis
 * @param {string} sessionId
 * @returns {Object|null} Session data or null if not found
 */
export async function getSession(sessionId) {
  if (!sessionId) return null;

  try {
    const client = await getRedisClient();

    // If Redis is not available, return null (will trigger JWT fallback)
    if (!client) {
      return null;
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
    console.error('[Session Store] Failed to get session:', error);
    return null;
  }
}

/**
 * Delete session from Redis
 * @param {string} sessionId
 */
export async function deleteSession(sessionId) {
  if (!sessionId) return;

  try {
    const client = await getRedisClient();

    if (!client) {
      return; // Can't delete if Redis not available
    }

    await client.del(`${SESSION_PREFIX}${sessionId}`);
    console.log(`[Session Store] Deleted session: ${sessionId}`);
  } catch (error) {
    console.error('[Session Store] Failed to delete session:', error);
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
      return; // Can't revoke if Redis not available
    }

    await client.set(
      `${SESSION_PREFIX}revoked:${sessionId}`,
      '1',
      { EX: SESSION_MAX_AGE }
    );
    console.log(`[Session Store] Revoked session: ${sessionId}`);
  } catch (error) {
    console.error('[Session Store] Failed to revoke session:', error);
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
      return false; // Can't check if Redis not available
    }

    const result = await client.get(`${SESSION_PREFIX}revoked:${sessionId}`);
    return result === '1';
  } catch (error) {
    console.error('[Session Store] Failed to check session revocation:', error);
    return false;
  }
}

/**
 * Cleanup expired sessions
 */
export async function cleanupExpiredSessions() {
  try {
    const client = await getRedisClient();

    if (!client) {
      return; // Can't cleanup if Redis not available
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
    console.error('[Session Store] Failed to cleanup sessions:', error);
  }
}

export { SESSION_MAX_AGE };
