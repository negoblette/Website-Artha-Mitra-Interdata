import { NextResponse } from 'next/server';

export function getAllowedAdminHosts() {
  return String(process.env.ADMIN_ALLOWED_HOSTS || '')
    .split(',')
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);
}

export function getRequestHost(request) {
  const host = (
    request.headers.get('x-forwarded-host') ||
    request.headers.get('host') ||
    ''
  ).toLowerCase();
  // Strip port number for comparison (e.g. "localhost:3000" → "localhost")
  return host.replace(/:\d+$/, '');
}

export function isAllowedAdminHost(request) {
  const allowedHosts = getAllowedAdminHosts();

  if (allowedHosts.length === 0) {
    return process.env.NODE_ENV !== 'production';
  }

  const requestHost = getRequestHost(request);
  return allowedHosts.includes(requestHost);
}

export function rejectInvalidAdminHost(request) {  
  if (isAllowedAdminHost(request)) {
    return null;
  }

  return NextResponse.json(
    { error: 'Invalid admin host' },
    { status: 403 }
  );
}
