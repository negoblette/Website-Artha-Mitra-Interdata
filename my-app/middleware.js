import { NextResponse } from 'next/server';
import { isAllowedAdminHost } from './lib/adminHost';

export function middleware(request) {
  const Allowed_Methods= ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'];

  if (request.nextUrl.pathname.startsWith('/api')) { // penerapan poin 13
    if(!Allowed_Methods.includes(request.method)) {
      return NextResponse.json(
        { error: `Method ${request.method} not Allowed` },
        { status: 405 }
      );
    }
  }
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
