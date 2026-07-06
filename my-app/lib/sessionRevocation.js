import { createClient } from 'redis';

const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = process.env.REDIS_PORT || '6379';
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
const PREFIX = 'ami:session-revoked';

let redisClient;
let redisConnectPromise;

function buildRedisUrl() {
  const base = `redis://${REDIS_HOST}:${REDIS_PORT}`;
  if (REDIS_PASSWORD) {
    const encodedPassword = encodeURIComponent(REDIS_PASSWORD);
    return `redis://:${encodedPassword}@${REDIS_HOST}:${REDIS_PORT}`;
  }
  return base;
}

async function getRedisClient() {
  if (redisClient?.isReady) {
    return redisClient;
  }

  if (!redisConnectPromise) {
    const REDIS_URL = buildRedisUrl();
    redisClient = createClient({ url: REDIS_URL });

    redisClient.on('error', (error) => {
      console.error('Redis session revocation client error:', error);
    });

    redisConnectPromise = redisClient.connect().then(() => redisClient).catch((error) => {
      redisConnectPromise = null;
      redisClient = undefined;
      throw error;
    });
  }
  return redisConnectPromise;
}

export async function revokeSession(jti, exp) {
  if (!jti) return;

  try {
    const client = await getRedisClient();
    const nowSec = Math.floor(Date.now() / 1000);
    const ttl = Math.max(exp - nowSec, 60);

    await client.set(`${PREFIX}:${jti}`, '1', { EX: ttl });
  } catch (error) {
    console.error('Failed to revoke session:', error);
  }
}

export async function isSessionRevoked(jti) {
  if (!jti) return false;

  try {
    const client = await getRedisClient();
    const result = await client.get(`${PREFIX}:${jti}`);
    return result === '1';
  } catch (error) {
    console.error('Failed to check session revocation:', error);
    return false;
  }
}
