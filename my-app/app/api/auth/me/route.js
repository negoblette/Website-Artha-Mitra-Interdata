import { NextResponse } from 'next/server';
import { SESSION_COOKIE, verifyAdminSessionToken } from '@/lib/adminAuth';

export async function GET(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  if (!verifyAdminSessionToken(token)) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true });
}
