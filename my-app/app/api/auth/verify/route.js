import { NextResponse } from 'next/server';
import { verify } from 'otplib';
import {
  createAdminSessionToken,
  getSessionCookieOptions,
  OTP_CHALLENGE_COOKIE,
  SESSION_COOKIE,
  verifyOtpChallengeToken,
} from '@/lib/adminAuth';
import { checkRateLimit, clearRateLimit } from '@/lib/rateLimit';

export async function POST(request) {
  const { otp } = await request.json().catch(() => ({}));
  const challengeToken = request.cookies.get(OTP_CHALLENGE_COOKIE)?.value;

  if (!process.env.ADMIN_TOTP_SECRET || !process.env.SESSION_SECRET) {
    return NextResponse.json({ error: 'Auth is not configured' }, { status: 500 });
  }

  const rateLimit = await checkRateLimit(request, 'admin_otp', {
    limit: 5,
    windowSeconds: 10 * 60,
    lockoutSeconds: 15 * 60,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many OTP attempts' },
      {
        status: 429,
        headers: { 'Retry-After': String(rateLimit.retryAfter) },
      }
    );
  }

  if (!verifyOtpChallengeToken(challengeToken)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const validOtp = verify({
    token: String(otp || ''),
    secret: process.env.ADMIN_TOTP_SECRET,
  });

  if (!validOtp) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await clearRateLimit(request, 'admin_otp');

  const response = NextResponse.json({ ok: true });
  const expiredCookie = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  };

  response.cookies.set(OTP_CHALLENGE_COOKIE, '', expiredCookie);
  response.cookies.set(SESSION_COOKIE, createAdminSessionToken(), getSessionCookieOptions());

  return response;
}
