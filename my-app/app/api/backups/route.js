import { NextResponse } from 'next/server';
import { listBackups, restoreBackup, purgeOldBackups } from '@/lib/content';
import { revalidatePath } from 'next/cache';
import { SESSION_COOKIE, verifyAdminSessionToken } from '@/lib/adminAuth';
import { rejectInvalidAdminHost } from '@/lib/adminHost';
import { readJsonWithLimit, REQUEST_LIMITS } from '@/lib/requestLimits';
import { checkRateLimit } from '@/lib/rateLimit';
import { logRateLimitHit, logBackupRestore, logBackupListAccess, logApiError } from '@/lib/auditLogger';

const VALID_FILES = ['global', 'homepage', 'about', 'solution', 'products', 'activities', 'insight'];

const FILE_ROUTES = {
  global: ['/', '/about', '/solution', '/products', '/activities', '/contact'],
  homepage: ['/'],
  about: ['/about'],
  solution: ['/solution'],
  products: ['/products'],
  activities: ['/activities'],
  insight: ['/insight'],
};

async function checkAuth(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  return await verifyAdminSessionToken(token, request);
}

/**
 * GET /api/backups?file=<name>
 * Returns list of backups for the given file, newest first.
 */
export async function GET(request) {
  const invalidHost = rejectInvalidAdminHost(request);
  if (invalidHost) return invalidHost;

  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const file = searchParams.get('file');

  if (!file || !VALID_FILES.includes(file)) {
    return NextResponse.json({ error: 'Invalid file parameter' }, { status: 400 });
  }

  try {
    const backups = listBackups(file);
    await logBackupListAccess(file, request);
    return NextResponse.json({ backups });
  } catch (err) {
    await logApiError('/api/backups', 500, err?.message, request);
    return NextResponse.json({ error: 'Failed to list backups' }, { status: 500 });
  }
}

/**
 * POST /api/backups
 * Body: { file: string, filename: string }
 * Restores the given backup file to the active JSON.
 * Also revalidates affected pages.
 */
export async function POST(request) {
  const invalidHost = rejectInvalidAdminHost(request);
  if (invalidHost) return invalidHost;

  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rateLimit = await checkRateLimit(request, 'admin_backup', {
    limit: 20,
    windowSeconds: 60 * 60,
    lockoutSeconds: 15 * 60,
  });

  if (!rateLimit.allowed) {
    await logRateLimitHit('/api/backups', request);

    return NextResponse.json(
      { error: 'Too many backup restore requests.' },
      {
        status: 429,
        headers: { 'Retry-After': String(rateLimit.retryAfter) },
      }
    );
  }

  const parsed = await readJsonWithLimit(request, REQUEST_LIMITS.backup);

  if (!parsed.ok) {
    return parsed.response;
  }

  const body = parsed.body;
  const { file, filename } = body || {};

  if (!file || !VALID_FILES.includes(file)) {
    return NextResponse.json({ error: 'Invalid file parameter' }, { status: 400 });
  }

  if (!filename || typeof filename !== 'string' || !filename.endsWith('.json')) {
    return NextResponse.json({ error: 'Invalid filename parameter' }, { status: 400 });
  }

  // Prevent path traversal
  if (filename.includes('/') || filename.includes('\\') || filename.includes('..')) {
    return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
  }

  try {
    const restored = restoreBackup(file, filename);

    await logBackupRestore(file, filename, true, request);

    // Purge old backups after restore creates a new one
    try { purgeOldBackups(file); } catch {}

    // Revalidate affected routes
    const routes = FILE_ROUTES[file] || [];
    for (const route of routes) {
      try { revalidatePath(route); } catch {}
    }

    return NextResponse.json({ success: true, data: restored, _revalidated: routes });
  } catch (err) {
    await logBackupRestore(file, filename, false, request);
    await logApiError('/api/backups', 500, err?.message, request);
    return NextResponse.json({ error: 'Failed to restore backup' }, { status: 500 });
  }
}
