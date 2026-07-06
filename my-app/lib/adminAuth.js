import crypto from 'crypto';
import { createSession, getSession, deleteSession, isSessionRevoked, SESSION_MAX_AGE } from './sessionStore';

export const OTP_CHALLENGE_COOKIE = 'admin_otp_challenge';
export const SESSION_COOKIE = 'admin_session';

const OTP_CHALLENGE_MAX_AGE = 5 * 60;

function getSessionSecret() {
  return process.env.SESSION_SECRET;
}

function signPayload(payload) {   // -> penerapan poin no 16 Dengan Mekanisme HMAC-SHA256
  const secret = getSessionSecret();

  if (!secret) {
    throw new Error('SESSION_SECRET is not configured');
  }

  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', secret)   // -> HMAC-SHA256
    .update(encodedPayload)
    .digest('base64url');

  return `${encodedPayload}.${signature}`;
}

function verifySignedPayload(token) {
  const secret = getSessionSecret();

  if (!secret || !token) {
    return null;
  }

  const [encodedPayload, signature] = token.split('.');

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(encodedPayload)
    .digest('base64url');

  const signatureBuffer = Buffer.from(signature);
  const expectedSignatureBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length !== expectedSignatureBuffer.length ||
    !crypto.timingSafeEqual(signatureBuffer, expectedSignatureBuffer)
  ) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}

export function createOtpChallengeToken() {
  const exp = Math.floor(Date.now() / 1000) + OTP_CHALLENGE_MAX_AGE;

  return signPayload({
    type: 'otp_challenge',
    exp,
  });
}

export function verifyOtpChallengeToken(token) {
  const payload = verifySignedPayload(token);

  return Boolean(
    payload &&
    payload.type === 'otp_challenge' &&
    payload.exp > Math.floor(Date.now() / 1000)
  );
}

/**
 * Create a new admin session in Redis
 * @param {string} ip - Client IP address
 * @param {string} userAgent - Client user agent
 * @returns {Promise<string>} Session ID
 */
export async function createAdminSession(ip, userAgent) {
  const sessionData = {
    userId: 'admin',
    role: 'admin',
    ip: ip || 'unknown',
    userAgent: userAgent || 'unknown',
    createdAt: Date.now(),
  };

  return await createSession(sessionData);
}

/**
 * Verify admin session from Redis (with JWT fallback)
 * @param {string} sessionId - Session ID or JWT token from cookie
 * @param {Request} [request] - Optional request object for fingerprint verification
 * @returns {Promise<Object|null>} Session data or null if invalid
 */
export async function verifyAdminSessionToken(sessionId, request) {
  if (!sessionId) {
    return null;
  }

  // First, try to get session from Redis
  const session = await getSession(sessionId);

  // If session found in Redis, verify it
  if (session) {
    // Check if session is revoked
    if (await isSessionRevoked(sessionId)) {
      return null;
    }

    // Verify session structure
    if (
      session.userId !== 'admin' ||
      session.role !== 'admin'
    ) {
      return null;
    }

    return session;
  }

  // If session not in Redis, try to verify as JWT (fallback for when Redis is not available)
  const payload = decodeSessionToken(sessionId);

  if (
    payload &&
    payload.type === 'admin_session' &&
    payload.role === 'admin' &&
    payload.exp > Math.floor(Date.now() / 1000)
  ) {
    // Check if JWT is revoked (if Redis is available)
    if (payload.jti && await isSessionRevoked(payload.jti)) {
      return null;
    }

    // Verify IP/UserAgent hasn't changed drastically (fingerprint check)
    if (request) {
      const currentIp = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
      const currentUserAgent = request.headers.get('user-agent') || 'unknown';
      const currentFingerprint = `${currentIp}-${currentUserAgent}`;

      const storedIp = payload.ip || 'unknown';
      const storedUserAgent = payload.userAgent || 'unknown';
      const storedFingerprint = `${storedIp}-${storedUserAgent}`;

      // Only check fingerprint if it was stored in the token
      if (payload.fingerprint && currentFingerprint !== storedFingerprint) {
        console.warn('[Auth] Session fingerprint mismatch - possible hijacking');
        return null;
      }
    }

    // Return session-like object for backward compatibility
    return {
      userId: payload.userId || 'admin',
      role: payload.role,
      createdAt: payload.iat * 1000,
      isJWT: true, // Flag to indicate this is a JWT fallback
    };
  }

  return null;
}

/**
 * Delete admin session from Redis
 * @param {string} sessionId
 */
export async function deleteAdminSession(sessionId) {
  await deleteSession(sessionId);
}

/**
 * Revoke admin session
 * @param {string} sessionId
 */
export async function revokeAdminSession(sessionId) {
  const { revokeSession } = await import('./sessionStore');
  await revokeSession(sessionId);
}

export function decodeSessionToken(token) {
  // For backward compatibility, try to verify as JWT
  // But prefer session-based auth
  return verifySignedPayload(token);
}

export function getOtpChallengeCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: OTP_CHALLENGE_MAX_AGE,
    path: '/',
  };
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SESSION_MAX_AGE, // 1 jam
    path: '/',
  };
}

export { SESSION_MAX_AGE };
