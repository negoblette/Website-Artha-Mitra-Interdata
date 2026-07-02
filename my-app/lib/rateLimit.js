import { createClient } from 'redis';

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const PREFIX = 'ami:rate-limit';

let redisClient;
let redisConnectPromise;

function getClientIp(request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

async function getRedisClient() {
  if (redisClient?.isReady) {
    return redisClient; 
  }

  if (!redisConnectPromise) {
    redisClient = createClient({url: REDIS_URL});
    
    redisClient.on('error' , (error) => {
      console.error('Redis rate limit client error:', error);
    });

    redisConnectPromise = redisClient.connect().then(() => redisClient).catch((error) => {
      redisConnectPromise = null;
      redisClient = undefined;
      throw error;
    });
  }
  return redisConnectPromise;
}

function buildBaseKey(keyPrefix, ip) {
  return `${keyPrefix}:${ip}`; 
}

export async function checkRateLimit(request, keyPrefix, options = {}) {
  const{
    limit = 5,
    windowSeconds = 10 * 60,
    lockoutSeconds = 15 * 60,
  } = options;

  const ip = getClientIp(request);
  const baseKey = buildBaseKey(keyPrefix, ip);
  const lockKey = `${baseKey}:lock`;
  const client = await getRedisClient();

  const lockedUntil = await client.get(lockKey);
  if(lockedUntil) {
    const retryAfter = Math.max(
      1,
      Math.ceil((Number(lockedUntil) - Date.now()) / 1000)
    );

    return {
      allowed: false,
      locked: true,
      retryAfter,
    };
  }

  const count = await client.incr(baseKey);

  if(count === 1) {
    await client.expire(baseKey, windowSeconds);
  }

  if(count > limit) {
    const retryAfter = lockoutSeconds;
    await client.set(lockKey, String(Date.now() + lockoutSeconds * 1000), {
      EX: lockoutSeconds,
    });

    return{
      allowed: false, 
      locked: true,
      retryAfter,
    };
  } 

  return {
    allowed: true,
    locked: false,
    remaining: Math.max(limit - count, 0),
  };
}

export async function clearRateLimit(request, keyPrefix) {
  const ip = getClientIp(request);
  const baseKey = buildBaseKey(keyPrefix, ip);
  const client = await getRedisClient();

  await client.del(baseKey, `${baseKey}:lock`);
}