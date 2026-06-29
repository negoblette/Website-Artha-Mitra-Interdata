import crypto from 'crypto';

export const OTP_CHALLENGE_COOKIE = 'admin_otp_challenge';
export const SESSION_COOKIE = 'admin_session';

const OTP_CHALLENGE_MAX_AGE = 5 * 60;
const SESSION_MAX_AGE = 60 * 60;

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

export function createAdminSessionToken() {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;

  return signPayload({
    type: 'admin_session',
    role: 'admin',
    jti: crypto.randomUUID(),
    iat: Math.floor(Date.now() / 1000),
    exp,
  });
}

export function verifyAdminSessionToken(token) {
  const payload = verifySignedPayload(token);

  return Boolean(
    payload &&
    payload.type === 'admin_session' &&
    payload.role === 'admin' &&
    payload.exp > Math.floor(Date.now() / 1000)
  );
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
    maxAge: SESSION_MAX_AGE,
    path: '/',
  };
}
