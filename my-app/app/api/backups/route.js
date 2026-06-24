import { NextResponse } from 'next/server';
import { listBackups, restoreBackup, backupContent, purgeOldBackups } from '@/lib/content';
import { revalidatePath } from 'next/cache';

const VALID_FILES = ['global', 'homepage', 'about', 'solution', 'products', 'activities', 'insight'];

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ami-admin-2026';

const FILE_ROUTES = {
  global: ['/', '/about', '/solution', '/products', '/activities', '/contact'],
  homepage: ['/'],
  about: ['/about'],
  solution: ['/solution'],
  products: ['/products'],
  activities: ['/activities'],
  insight: ['/insight'],
};

function checkAuth(request) {
  const key = request.headers.get('x-admin-key');
  return key === ADMIN_PASSWORD;
}

/**
 * GET /api/backups?file=<name>
 * Returns list of backups for the given file, newest first.
 */
export async function GET(request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const file = searchParams.get('file');

  if (!file || !VALID_FILES.includes(file)) {
    return NextResponse.json({ error: 'Invalid file parameter' }, { status: 400 });
  }

  try {
    const backups = listBackups(file);
    return NextResponse.json({ backups });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * POST /api/backups
 * Body: { file: string, filename: string }
 * Restores the given backup file to the active JSON.
 * Also revalidates affected pages.
 */
export async function POST(request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

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

    // Purge old backups after restore creates a new one
    try { purgeOldBackups(file); } catch {}

    // Revalidate affected routes
    const routes = FILE_ROUTES[file] || [];
    for (const route of routes) {
      try { revalidatePath(route); } catch {}
    }

    return NextResponse.json({ success: true, data: restored, _revalidated: routes });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
