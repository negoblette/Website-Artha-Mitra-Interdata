import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { SESSION_COOKIE, verifyAdminSessionToken } from '@/lib/adminAuth';
import { rejectInvalidAdminHost } from '@/lib/adminHost';
import { logFileUpload, logRateLimitHit } from '@/lib/auditLogger';
import { rejectLargeRequest, REQUEST_LIMITS } from '@/lib/requestLimits';
import { checkRateLimit } from '@/lib/rateLimit';

export const runtime = 'nodejs';

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/png', 'image/jpeg']);

//Magic bytes for PNG and JPG files for validation purposes -> point no 18
const MAGIC_BYTES = {
  'image/png' : [0x89, 0x50, 0x4E, 0x47],
  'image/jpeg' : [0xFF, 0xD8, 0xFF],
};

function validateMagicBytes(buffer, expectedType) {
  const bytes = new Uint8Array(buffer.slice(0, 8));
  const expected = MAGIC_BYTES[expectedType];

  if (!expected) return false;

  return expected.every((byte, index) => bytes[index] === byte);
}

async function checkAuth(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  return await verifyAdminSessionToken(token, request);
}

function extensionForType(mime) {
  if (mime === 'image/png') return '.png';
  if (mime === 'image/jpeg') return '.jpg';
  return '';
}

export async function POST(request) {  
  const invalidHost = rejectInvalidAdminHost(request);
  if (invalidHost) return invalidHost;

  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rateLimit = await checkRateLimit(request, 'admin_upload', {
    limit: 30,
    windowSeconds: 60 * 60,
    lockoutSeconds: 15 * 60,
  });

  if (!rateLimit.allowed) {
    await logRateLimitHit('/api/upload', request);

    return NextResponse.json(
      { error: 'Too many upload requests. Please try again later.' },
      {
        status: 429,
        headers: { 'Retry-After': String(rateLimit.retryAfter) },
      }
    );
  }

  const tooLarge = rejectLargeRequest(request, REQUEST_LIMITS.upload);

  if (tooLarge) {
    return tooLarge;
  }

  const formData = await request.formData();
  const file = formData.get('file');

  if (!file || typeof file.arrayBuffer !== 'function') {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: 'Only PNG/JPG images are allowed' }, { status: 415 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'File is too large. Max 10MB.' }, { status: 413 });
  }

  // Validate MAGICBYTES to ensure file content matches MIME type -> poin no 18
  const buffer = Buffer.from(await file.arrayBuffer());
  if (!validateMagicBytes(buffer, file.type)) {
    return NextResponse.json({
      error: 'Invalid File content, File does not match declared Type.'
    }, { status: 415 });
  }

  const uploadsDir = path.join(process.cwd(), 'data', 'uploads');
  await fs.mkdir(uploadsDir, { recursive: true });

  const ext = extensionForType(file.type);
  const fileName = `${crypto.randomUUID()}${ext}`;
  const filePath = path.join(uploadsDir, fileName);

  await fs.writeFile(filePath, buffer);

  //Log Upload File
  await logFileUpload(fileName, file.size, file.type, request);

  return NextResponse.json({
    url: `/uploads/${fileName}`,
    name: fileName,
    size: file.size,
    type: file.type,
  });
}
