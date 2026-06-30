import { NextResponse } from 'next/server';
import {
  createOtpChallengeToken,
  getOtpChallengeCookieOptions,
  OTP_CHALLENGE_COOKIE,
} from '@/lib/adminAuth';
import { checkRateLimit, clearRateLimit } from '@/lib/rateLimit';
import { rejectInvalidAdminHost } from '@/lib/adminHost';
import { logFailedLogin, logRateLimitHit } from '@/lib/auditLogger';

export async function POST(request) {
  const invalidHost = rejectInvalidAdminHost(request);
  if (invalidHost) return invalidHost;

  const { password } = await request.json().catch(() => ({}));

  if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_TOTP_SECRET || !process.env.SESSION_SECRET) {
    return NextResponse.json({ error: 'Auth is not configured' }, { status: 500 });
  }

  const rateLimit = await checkRateLimit(request, 'admin_password', {
    limit: 5,
    windowSeconds: 10 * 60,
    lockoutSeconds: 15 * 60,
  });

  if (!rateLimit.allowed) {
    //LOG: Rate Limit Hit -> poin checklist no 20
    await logRateLimitHit ('/api/auth/start', request);

    return NextResponse.json(
      { error: 'Too many login attempts' },
      {
        status: 429,
        headers: { 'Retry-After': String(rateLimit.retryAfter) },
      }
    );
  }

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    //LOG : Failed Login -> poin checklist no 20
    await logFailedLogin ('Invalid password', request);

    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await clearRateLimit(request, 'admin_password');

  const response = NextResponse.json({ ok: true, step: 'otp_required' });
  response.cookies.set(
    OTP_CHALLENGE_COOKIE,
    createOtpChallengeToken(),
    getOtpChallengeCookieOptions()
  );

  return response;
}
