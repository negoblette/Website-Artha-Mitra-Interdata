import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getContent, updateContent, backupContent, purgeOldBackups } from '@/lib/content';
import { SESSION_COOKIE, verifyAdminSessionToken } from '@/lib/adminAuth';
import { rejectInvalidAdminHost } from '@/lib/adminHost';
import { validateContentPayload } from '@/lib/contentValidation';
import { logContentUpdate, logRateLimitHit, logApiError } from '@/lib/auditLogger';
import { readJsonWithLimit, REQUEST_LIMITS } from '@/lib/requestLimits';
import { checkRateLimit } from '@/lib/rateLimit';
import { resolveReferences } from '@/lib/referenceResolver';


const VALID_FILES = ['global', 'homepage', 'about', 'solution', 'products', 'activities', 'insight'];

async function checkAuth(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  return await verifyAdminSessionToken(token, request);
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

const READ_ONLY_MAP = {
  homepage: ['hero', 'howItWorks', 'contactSection'],
  about: ['hero', 'vision', 'mission', 'coreValues'],
  solution: ['hero'],
  products: ['hero'],
  activities: ['hero'],
  insight: ['hero'],
};

function getValueAtPath(obj, path) {
  if (!obj || !path) return undefined;
  return path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), obj);
}

function setValueAtPath(obj, path, value) {
  if (!obj || !path) return;
  const keys = path.split('.');
  let target = obj;
  for (let i = 0; i < keys.length - 1; i += 1) {
    const key = keys[i];
    if (typeof target[key] !== 'object' || target[key] === null) {
      target[key] = {};
    }
    target = target[key];
  }
  target[keys[keys.length - 1]] = value;
}

export async function GET(request) {
  const invalidHost = rejectInvalidAdminHost(request);
  if (invalidHost) return invalidHost;

  const { searchParams } = new URL(request.url);
  const file = searchParams.get('file');
  const resolveRefs = searchParams.get('resolveRefs') === 'true';

  if (!file || !VALID_FILES.includes(file)) {
    return NextResponse.json({ error: 'Invalid file parameter' }, { status: 400 });
  }

  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let data = getContent(file);

    if(resolveRefs) {
      data = await resolveReferences(data);
    }
    
    return NextResponse.json(data);
  } catch (err) {
    await logApiError('/api/content', 500, err?.message, request);
    return NextResponse.json({ error: 'Failed to load content' }, { status: 500 });
  }
}

export async function PUT(request) {
  const invalidHost = rejectInvalidAdminHost(request);
  if (invalidHost) return invalidHost;

  const { searchParams } = new URL(request.url);
  const file = searchParams.get('file');

  if (!file || !VALID_FILES.includes(file)) {
    return NextResponse.json({ error: 'Invalid file parameter' }, { status: 400 });
  }

  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rateLimit = await checkRateLimit(request, 'admin_content_update', {
    limit: 60,
    windowSeconds: 5 * 60,
    lockoutSeconds: 3 * 60,
  });

  if(!rateLimit.allowed) {
    await logRateLimitHit('/api/content', request);

    return NextResponse.json(
      { error: 'Too many content update request.' },
      {
        status: 429,
        headers: { 'Retry-After': String(rateLimit.retryAfter)},
      }
    );
  }

  const parsed = await readJsonWithLimit(request, REQUEST_LIMITS.content);
  if (!parsed.ok) {
    return parsed.response;
  }
  

  const body = parsed.body;
  const validation = validateContentPayload(file, body);

  if (!validation.ok) {
    return NextResponse.json(
      { error: 'Invalid content payload', details: validation.errors },
      { status: 400 }
    );
  }

  let existing;
  try {
    existing = getContent(file);
  } catch (err) {
    await logApiError('/api/content', 500, err?.message, request);
    return NextResponse.json({ error: 'Failed to read current content' }, { status: 500 });
  }

  const readOnlyPaths = READ_ONLY_MAP[file] || [];
  for (const readOnlyPath of readOnlyPaths) {
    const preserved = getValueAtPath(existing, readOnlyPath);
    if (preserved !== undefined) {
      setValueAtPath(body, readOnlyPath, preserved);
    }
  }

  // Backup current version before overwriting
  try {
    backupContent(file);
    purgeOldBackups(file);
  } catch {
    // Non-fatal — continue even if backup fails
  }

  let updated;
  try {
    updated = updateContent(file, body);
  } catch (err) {
    await logApiError('/api/content', 500, err?.message, request);
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }

  //Log Update Content
  await logContentUpdate(file,'admin', request);

  // Revalidate affected routes so static pages update
  const routes = FILE_ROUTES[file] || [];
  for (const route of routes) {
    try { revalidatePath(route); } catch {}
  }

  // If section visibility changed, revalidate the root layout so the navbar updates
  if (body._sectionVisibility && file !== 'global' && file !== 'homepage') {
    try { revalidatePath('/', 'layout'); } catch {}
  }

  // If solution data changed, revalidate all dynamic solution pages
  if (file === 'solution' && body.solutions) {
    for (const sol of body.solutions) {
      try { revalidatePath(`/solution/${sol.slug}`); } catch {}
    }
  }

  return NextResponse.json({ ...updated, _revalidated: routes });
}
