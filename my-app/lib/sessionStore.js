import { createClient } from 'redis';
import crypto from 'crypto';

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const SESSION_PREFIX = 'ami:session:';
const SESSION_MAX_AGE = 3600; // 1 jam dalam detik

let redisClient;
let redisConnectPromise;

async function getRedisClient() {
  if (redisClient?.isReady) {
    return redisClient;
  }

  if (!redisConnectPromise) {
    redisClient = createClient({ url: REDIS_URL });

    redisClient.on('error', (error) => {
      console.error('[Session Store] Redis client error:', error);
    });

    redisConnectPromise = redisClient.connect().then(() => redisClient).catch((error) => {
      redisConnectPromise = null;
      redisClient = undefined;
      throw error;
    });
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
    throw error;
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
