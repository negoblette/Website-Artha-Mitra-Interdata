import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export const runtime = 'nodejs';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ami-admin-2026';
const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/png', 'image/jpeg']);

function checkAuth(request) {
  const key = request.headers.get('x-admin-key');
  return key === ADMIN_PASSWORD;
}

function extensionForType(mime) {
  if (mime === 'image/png') return '.png';
  if (mime === 'image/jpeg') return '.jpg';
  return '';
}

export async function POST(request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(uploadsDir, { recursive: true });

  const ext = extensionForType(file.type);
  const fileName = `${crypto.randomUUID()}${ext}`;
  const filePath = path.join(uploadsDir, fileName);

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);

  return NextResponse.json({
    url: `/uploads/${fileName}`,
    name: fileName,
    size: file.size,
    type: file.type,
  });
}
