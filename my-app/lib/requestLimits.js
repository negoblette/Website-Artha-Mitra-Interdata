// implementasi no 35 request limit (for resource exhaustion)

import { NextResponse } from 'next/server';

export const REQUEST_LIMITS = {
  auth: 4 * 1024,
  otp: 2 * 1024,
  contact: 64 * 1024,
  content: 1024 * 1024,
  backup: 16 * 1024,
  upload: 10 * 1024 * 1024,
};

export function getContentLength(request) {
  const rawContentLength = request.headers.get('content-length');

  if (!rawContentLength) {
    return null;
  }

  const contentLength = Number(rawContentLength);

  if (!Number.isFinite(contentLength) || contentLength < 0) {
    return null;
  }

  return contentLength;
}

export function rejectLargeRequest(request, maxBytes) {
  const contentLength = getContentLength(request);

  if (contentLength !== null && contentLength > maxBytes) {
    return NextResponse.json(
      { error: 'Request body too large.' },
      { status: 413 }
    );
  }

  return null;
}

export async function readJsonWithLimit(request, maxBytes) {
  const contentLengthResponse = rejectLargeRequest(request, maxBytes);

  if (contentLengthResponse) {
    return {
      ok: false,
      body: null,
      response: contentLengthResponse,
    };
  }

  if (!request.body) {
    return {
      ok: true,
      body: {},
      response: null,
    };
  }

  const reader = request.body.getReader();
  const chunks = [];
  let receivedBytes = 0;

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    receivedBytes += value.byteLength;

    if (receivedBytes > maxBytes) {
      return {
        ok: false,
        body: null,
        response: NextResponse.json(
          { error: 'Request body too large.' },
          { status: 413 }
        ),
      };
    }

    chunks.push(Buffer.from(value));
  }

  const rawBody = Buffer.concat(chunks).toString('utf8');

  if (!rawBody.trim()) {
    return {
      ok: true,
      body: {},
      response: null,
    };
  }

  try {
    return {
      ok: true,
      body: JSON.parse(rawBody),
      response: null,
    };
  } catch {
    return {
      ok: false,
      body: null,
      response: NextResponse.json(
        { error: 'Invalid JSON body.' },
        { status: 400 }
      ),
    };
  }
}
