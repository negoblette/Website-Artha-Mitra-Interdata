import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

const uploadsDir = path.join(process.cwd(), 'data', 'uploads');

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

  // Prevent path traversal
  if (fileName.includes('..') || fileName.includes('\\')) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
  }

  const fullPath = path.join(uploadsDir, fileName);

  // Ensure resolved path is still inside uploadsDir
  const resolved = path.resolve(fullPath);
  const resolvedUploads = path.resolve(uploadsDir);
  if (!resolved.startsWith(resolvedUploads)) {
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
