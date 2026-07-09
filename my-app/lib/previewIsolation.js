'use client';

const ALLOWED_IFRAME_HOSTS = new Set([
  'www.google.com',
  'maps.google.com',
]);

export function isAllowedIframeUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return false;

  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) return false;
    return ALLOWED_IFRAME_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

export function isSafeImageUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return false;

  if (value.startsWith('/')) {
    return /\.(png|jpe?g|webp|gif|avif)$/i.test(value);
  }

  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) return false;
    return /\.(png|jpe?g|webp|gif|avif)$/i.test(url.pathname);
  } catch {
    return false;
  }
}

export function sanitizeHtmlForPreview(html = '') {
  const parser = new DOMParser();
  const doc = parser.parseFromString(String(html), 'text/html');

  doc.querySelectorAll('script, object, embed, link, meta, base').forEach((node) => {
    node.remove();
  });

  doc.querySelectorAll('*').forEach((el) => {
    [...el.attributes].forEach((attr) => {
      const name = attr.name.toLowerCase();
      const value = String(attr.value || '').trim();

      if (name.startsWith('on')) {
        el.removeAttribute(attr.name);
        return;
      }

      if (/^(javascript|vbscript|data):/i.test(value)) {
        el.removeAttribute(attr.name);
        return;
      }

      if ((name === 'href' || name === 'src' || name === 'xlink:href') && value) {
        try {
          const url = new URL(value, window.location.origin);
          const allowedProtocol = ['http:', 'https:'].includes(url.protocol);
          const allowedRelative = value.startsWith('/');
          if (!allowedProtocol && !allowedRelative) {
            el.removeAttribute(attr.name);
          }
        } catch {
          el.removeAttribute(attr.name);
        }
      }
    });
  });

  return doc.body.innerHTML;
}

export function buildSandboxSrcDoc(html = '') {
  const safeHtml = sanitizeHtmlForPreview(html);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="Content-Security-Policy"
    content="
      default-src 'none';
      img-src data: https:;
      style-src 'unsafe-inline';
      font-src data:;
      connect-src 'none';
      frame-src 'none';
      media-src 'none';
      object-src 'none';
      base-uri 'none';
      form-action 'none';
    " />
  <style>
    html, body {
      margin: 0;
      padding: 0;
      background: #fff;
      color: #111827;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    body {
      padding: 16px;
    }
    img {
      max-width: 100%;
      height: auto;
    }
    a {
      color: #2563eb;
    }
  </style>
</head>
<body>
  ${safeHtml}
</body>
</html>`;
}
