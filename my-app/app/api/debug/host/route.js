import { NextResponse } from 'next/server';
import { getAllowedAdminHosts, getRequestHost, isAllowedAdminHost } from '@/lib/adminHost';

export async function GET(request) {
  const allowedHosts = getAllowedAdminHosts();
  const requestHost = getRequestHost(request);
  const allowed = isAllowedAdminHost(request);

  return NextResponse.json({
    host: request.headers.get('host'),
    xForwardedHost: request.headers.get('x-forwarded-host'),
    url: request.url,
    debug: {
      allowedHosts,
      allowedHostsRaw: process.env.ADMIN_ALLOWED_HOSTS,
      requestHost,
      isAllowed: allowed,
      nodeEnv: process.env.NODE_ENV,
      hasRedisUrl: !!process.env.REDIS_URL,
    },
  });
}
