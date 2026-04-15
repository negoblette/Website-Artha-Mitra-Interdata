import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getContent, updateContent } from '@/lib/content';

const VALID_FILES = ['global', 'homepage', 'about', 'solution', 'products', 'activities', 'insight'];

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ami-admin-2026';

function checkAuth(request) {
  const key = request.headers.get('x-admin-key');
  return key === ADMIN_PASSWORD;
}

// Map which files affect which routes (for revalidation)
const FILE_ROUTES = {
  global: ['/', '/about', '/solution', '/products', '/activities', '/contact'],
  homepage: ['/'],
  about: ['/about'],
  solution: ['/solution'],
  products: ['/products'],
  activities: ['/activities'],
  insight: ['/insight'],
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const file = searchParams.get('file');

  if (!file || !VALID_FILES.includes(file)) {
    return NextResponse.json({ error: 'Invalid file parameter' }, { status: 400 });
  }

  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = getContent(file);
  return NextResponse.json(data);
}

export async function PUT(request) {
  const { searchParams } = new URL(request.url);
  const file = searchParams.get('file');

  if (!file || !VALID_FILES.includes(file)) {
    return NextResponse.json({ error: 'Invalid file parameter' }, { status: 400 });
  }

  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const updated = updateContent(file, body);

  // Revalidate affected routes so static pages update
  const routes = FILE_ROUTES[file] || [];
  for (const route of routes) {
    try { revalidatePath(route); } catch {}
  }

  // If solution data changed, revalidate all dynamic solution pages
  if (file === 'solution' && body.solutions) {
    for (const sol of body.solutions) {
      try { revalidatePath(`/solution/${sol.slug}`); } catch {}
    }
  }

  return NextResponse.json({ ...updated, _revalidated: routes });
}
