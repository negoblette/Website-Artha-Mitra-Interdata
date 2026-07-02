import { createClient } from 'redis';

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const PREFIX = 'ami:session-revoked';

let redisClient;
let redisConnectPromise;

async function getRedisClient() {
  if (redisClient?.isReady) {
    return redisClient;
  }

  if (!redisConnectPromise) {
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
