'use client';

import { useMemo } from 'react';
import {
  buildSandboxSrcDoc,
  isAllowedIframeUrl,
  isSafeImageUrl,
} from '@/lib/previewIsolation';

export default function SafePreview({ kind, value, title = 'Preview' }) {
  const srcDoc = useMemo(() => {
    if (kind !== 'html') return '';
    return buildSandboxSrcDoc(value);
  }, [kind, value]);

  if (!value) return null;

  if (kind === 'image') {
    if (!isSafeImageUrl(value)) {
      return (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Preview gambar diblokir karena URL atau format tidak aman.
        </div>
      );
    }

    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
        <img
          src={value}
          alt={title}
          className="max-h-64 w-auto rounded"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  if (kind === 'iframe') {
    if (!isAllowedIframeUrl(value)) {
      return (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Preview iframe diblokir karena host tidak ada di allowlist.
        </div>
      );
    }

    return (
      <iframe
        title={title}
        src={value}
        sandbox=""
        referrerPolicy="no-referrer"
        loading="lazy"
        className="h-96 w-full rounded-lg border border-gray-200 bg-white"
      />
    );
  }

  if (kind === 'html') {
    return (
      <iframe
        title={title}
        srcDoc={srcDoc}
        sandbox=""
        loading="lazy"
        className="h-96 w-full rounded-lg border border-gray-200 bg-white"
      />
    );
  }

  return null;
}