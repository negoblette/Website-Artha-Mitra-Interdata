import { NextResponse } from 'next/server';
import {
  OTP_CHALLENGE_COOKIE,
  SESSION_COOKIE,
} from '@/lib/adminAuth';
import { rejectInvalidAdminHost } from '@/lib/adminHost';

export async function POST(request) {
  const invalidHost = rejectInvalidAdminHost(request);
  if (invalidHost) return invalidHost;

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
