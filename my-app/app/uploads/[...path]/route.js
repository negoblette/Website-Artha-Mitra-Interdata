import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

const uploadsDir = path.join(process.cwd(), 'data', 'uploads');
const legacyDir = path.join(process.cwd(), 'public', 'uploads');

const MIME_TYPES = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

export async function GET(request, { params }) {
  const { path: filePath } = await params;
  const fileName = Array.isArray(filePath) ? filePath.join('/') : filePath;

  if (fileName.includes('..') || fileName.includes('\\')) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
  }

  // Check data/uploads first, then fallback to public/uploads
  let fullPath = path.join(uploadsDir, fileName);
  if (!fs.existsSync(fullPath)) {
    fullPath = path.join(legacyDir, fileName);
  }

  const resolved = path.resolve(fullPath);
  const resolvedUploads = path.resolve(uploadsDir);
  const resolvedLegacy = path.resolve(legacyDir);
  if (!resolved.startsWith(resolvedUploads) && !resolved.startsWith(resolvedLegacy)) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
  }

  if (!fs.existsSync(fullPath)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const ext = path.extname(fileName).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  const fileBuffer = fs.readFileSync(fullPath);

  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
