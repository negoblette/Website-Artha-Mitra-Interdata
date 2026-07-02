import { NextResponse } from 'next/server';
import { isAllowedAdminHost } from './lib/adminHost';

const ALLOWED_API_METHODS= ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'];

export function middleware(request) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith('/api')) { // penerapan poin 13
    if(!ALLOWED_API_METHODS.includes(request.method)) {
      return NextResponse.json(
        { error: `Method ${request.method} not Allowed` },
        { status: 405 }
      );
    }
  }
  
  if(pathname.startsWith('/admin') || pathname.startsWith('/api/auth')) {
    if(!isAllowedAdminHost(request)) {
      return NextResponse.json(
        { error: 'Invalid admin host'},
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};
