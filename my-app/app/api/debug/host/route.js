import { NextResponse } from 'next/server';

export async function GET(request) {
  return NextResponse.json({
    host: request.headers.get('host'),
    xForwardedHost: request.headers.get('x-forwarded-host'),
    xRealIp: request.headers.get('x-real-ip'),
    xForwardedFor: request.headers.get('x-forwarded-for'),
    xForwardedProto: request.headers.get('x-forwarded-proto'),
    url: request.url,
    nextUrl: {
      host: request.nextUrl.host,
      hostname: request.nextUrl.hostname,
      port: request.nextUrl.port,
      protocol: request.nextUrl.protocol,
    },
  });
}
