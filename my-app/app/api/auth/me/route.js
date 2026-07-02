import { NextResponse } from 'next/server';
import { SESSION_COOKIE, verifyAdminSessionToken } from '@/lib/adminAuth';
import { rejectInvalidAdminHost } from '@/lib/adminHost';

export async function GET(request) {
  const invalidHost = rejectInvalidAdminHost(request);
  if (invalidHost) return invalidHost;

  const sessionId = request.cookies.get(SESSION_COOKIE)?.value;

  // Verify session from Redis
  const session = await verifyAdminSessionToken(sessionId);

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    session: {
      userId: session.userId,
      role: session.role,
      createdAt: session.createdAt,
    },
  });
}
