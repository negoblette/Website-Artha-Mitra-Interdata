const buckets = new Map();

function getClientIp(request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

export async function checkRateLimit(request, keyPrefix, options = {}) {
  const {
    limit = 5,
    windowSeconds = 10 * 60,
    lockoutSeconds = 15 * 60,
  } = options;
  const ip = getClientIp(request);
  const key = `${keyPrefix}:${ip}`;
  const now = Date.now();
  const record = buckets.get(key);

  if (record?.lockedUntil && record.lockedUntil > now) {
    return {
      allowed: false,
      locked: true,
      retryAfter: Math.ceil((record.lockedUntil - now) / 1000),
    };
  }

  if (!record || record.resetAt <= now) {
    buckets.set(key, {
      count: 1,
      resetAt: now + windowSeconds * 1000,
      lockedUntil: null,
    });

    return {
      allowed: true,
      locked: false,
      remaining: limit - 1,
    };
  }

  record.count += 1;

  if (record.count > limit) {
    record.lockedUntil = now + lockoutSeconds * 1000;
    buckets.set(key, record);

    return {
      allowed: false,
      locked: true,
      retryAfter: lockoutSeconds,
    };
  }

  buckets.set(key, record);

  return {
    allowed: true,
    locked: false,
    remaining: Math.max(limit - record.count, 0),
  };
}

export async function clearRateLimit(request, keyPrefix) {
  const ip = getClientIp(request);
  buckets.delete(`${keyPrefix}:${ip}`);
}
