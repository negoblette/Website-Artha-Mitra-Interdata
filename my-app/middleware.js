import { NextResponse } from 'next/server';
import { isAllowedAdminHost } from './lib/adminHost';

export function middleware(request) {
  if (isAllowedAdminHost(request)) {
    return NextResponse.next();
  }

  return NextResponse.json(
    { error: 'Invalid admin host' },
    { status: 403 }
  );
}

export const config = {
  matcher: ['/admin/:path*', '/api/auth/:path*'],
};
