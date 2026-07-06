import { NextResponse } from 'next/server';
import {
  createOtpChallengeToken,
  getOtpChallengeCookieOptions,
  OTP_CHALLENGE_COOKIE,
} from '@/lib/adminAuth';
import { checkRateLimit, clearRateLimit } from '@/lib/rateLimit';
import { rejectInvalidAdminHost } from '@/lib/adminHost';
import { logFailedLogin, logRateLimitHit } from '@/lib/auditLogger';
import { readJsonWithLimit, REQUEST_LIMITS } from '@/lib/requestLimits';
import crypto from 'crypto';



function safeCompare(a,b){
  if(!a|| !b) return false;
  const bufA = Buffer.from(String(a), 'utf8');
  const bufB = Buffer.from(String(b), 'utf8');
  const maxLen = Math.max(bufA.length, bufB.length);
  const paddedA = Buffer.alloc(maxLen, 0);
  const paddedB = Buffer.alloc(maxLen, 0);
  bufA.copy(paddedA);
  bufB.copy(paddedB);
  return crypto.timingSafeEqual(paddedA, paddedB);
}

export async function POST(request) {
  const invalidHost = rejectInvalidAdminHost(request);
  if (invalidHost) return invalidHost;

  const parsed = await readJsonWithLimit(request, REQUEST_LIMITS.auth);
  if (!parsed.ok) {
    return parsed.response;
  }
  
  const { password } = parsed.body;

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

  if (!password || !safeCompare(password, process.env.ADMIN_PASSWORD)) {
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
