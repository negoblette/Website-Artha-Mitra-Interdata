import { NextResponse } from 'next/server';
import {
  OTP_CHALLENGE_COOKIE,
  SESSION_COOKIE,
} from '@/lib/adminAuth';

export async function POST() {
  const response = NextResponse.json({ ok: true });
  const expiredCookie = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  };

  response.cookies.set(OTP_CHALLENGE_COOKIE, '', expiredCookie);
  response.cookies.set(SESSION_COOKIE, '', expiredCookie);

  return response;
}
