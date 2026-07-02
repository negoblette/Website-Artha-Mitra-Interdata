import { NextResponse } from 'next/server';
import {
  OTP_CHALLENGE_COOKIE,
  SESSION_COOKIE,
  deleteAdminSession,
} from '@/lib/adminAuth';
import { rejectInvalidAdminHost } from '@/lib/adminHost';
import { logLogout } from '@/lib/auditLogger';

export async function POST(request) {
  const invalidHost = rejectInvalidAdminHost(request);
  if (invalidHost) return invalidHost;

  // Delete session from Redis (server-side)
  const sessionId = request.cookies.get(SESSION_COOKIE)?.value;
  if (sessionId) {
    await deleteAdminSession(sessionId);
  }

  await logLogout(request);

  const response = NextResponse.json({ ok: true });
  const expiredCookie = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  };

  response.cookies.set(OTP_CHALLENGE_COOKIE, '', expiredCookie);
  response.cookies.set(SESSION_COOKIE, '', expiredCookie);

  return response;
}
