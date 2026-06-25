const VALID_FILES = new Set([
  'global',
  'homepage',
  'about',
  'solution',
  'products',
  'activities',
  'insight',
]);

const DANGEROUS_KEYS = new Set([
  '__proto__',
  'constructor',
  'prototype',
]);

const URL_KEYS = /(^|\.)(href|link|url|mapLink|mapEmbedUrl|src|website)$/i;
const IMAGE_KEYS = /(^|\.)(image|logo|background|thumbnail|photo|icon|banner|cover)$/i;
const SLUG_KEYS = /(^|\.)(slug)$/i;
const EMAIL_KEYS = /(^|\.)(email|mail|formRecipient)$/i;
const PHONE_KEYS = /(^|\.)(phone|fax|whatsapp|mobile|telephone)$/i;
const DATE_KEYS = /(^|\.)(date|publishedAt|createdAt|updatedAt|eventDate|startDate|endDate)$/i;

const MAX_DEPTH = 12;
const MAX_ARRAY_LENGTH = 150;
const MAX_KEYS_PER_OBJECT = 120;
const MAX_TOTAL_NODES = 8000;
const MAX_SHORT_TEXT = 500;
const MAX_LONG_TEXT = 6000;
const MAX_URL_LENGTH = 2048;

function isPlainObject(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function isDangerousText(value) {
  return /<\s*script\b|<\s*iframe\b|<\s*object\b|<\s*embed\b|on\w+\s*=|javascript\s*:|vbscript\s*:|data\s*:/i.test(value);
}

function isSafeInternalPath(value) {
  if (!value.startsWith('/')) return false;
  if (value.startsWith('//')) return false;
  if (value.includes('\\')) return false;
  if (value.includes('..')) return false;
  return /^\/[a-z0-9\-._~/%?#=&+]*$/i.test(value);
}

function isSafeHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function isSafeUrl(value) {
  return isSafeInternalPath(value) || isSafeHttpUrl(value);
}

function isSafeImagePath(value) {
  if (!isSafeInternalPath(value) && !isSafeHttpUrl(value)) return false;
  return /\.(png|jpe?g|webp|gif|avif|svg)$/i.test(value);
}

function isSafeSlug(value) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(value);
}

function isSafeEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isSafePhone(value) {
  return /^[0-9+\-()\s.]{5,30}$/.test(value);
}

function isSafeDate(value) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return true;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp);
}

function maxStringLengthForPath(path) {
  if (URL_KEYS.test(path)) return MAX_URL_LENGTH;
  if (/description|content|message|body|fullDescription|subtitle/i.test(path)) return MAX_LONG_TEXT;
  return MAX_SHORT_TEXT;
}

function addError(errors, path, message) {
  errors.push({
    path: path || '(root)',
    message,
  });
}

function validateString(value, path, errors) {
  const maxLength = maxStringLengthForPath(path);

  if (value.length > maxLength) {
    addError(errors, path, `Text is too long. Max ${maxLength} characters.`);
  }

  if (isDangerousText(value)) {
    addError(errors, path, 'Text contains unsafe HTML, script, or URL content.');
  }

  if (URL_KEYS.test(path) && value && !isSafeUrl(value)) {
    addError(errors, path, 'URL must be http(s) or a safe internal path.');
  }

  if (IMAGE_KEYS.test(path) && value && !isSafeImagePath(value)) {
    addError(errors, path, 'Image path must be a safe image URL or internal image path.');
  }

  if (SLUG_KEYS.test(path) && value && !isSafeSlug(value)) {
    addError(errors, path, 'Slug must contain only letters, numbers, and hyphens.');
  }

  if (EMAIL_KEYS.test(path) && value && !isSafeEmail(value)) {
    addError(errors, path, 'Email format is invalid.');
  }

  if (PHONE_KEYS.test(path) && value && !isSafePhone(value)) {
    addError(errors, path, 'Phone format is invalid.');
  }

  if (DATE_KEYS.test(path) && value && !isSafeDate(value)) {
    addError(errors, path, 'Date format is invalid.');
  }
}

function validateNode(value, path, errors, state) {
  state.nodes += 1;

  if (state.nodes > MAX_TOTAL_NODES) {
    addError(errors, path, `Payload is too large. Max ${MAX_TOTAL_NODES} nodes.`);
    return;
  }

  if (state.depth > MAX_DEPTH) {
    addError(errors, path, `Object is too deeply nested. Max depth is ${MAX_DEPTH}.`);
    return;
  }

  if (value === null || value === undefined) {
    return;
  }

  if (typeof value === 'string') {
    validateString(value, path, errors);
    return;
  }

  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      addError(errors, path, 'Number must be finite.');
    }
    return;
  }

  if (typeof value === 'boolean') {
    return;
  }

  if (Array.isArray(value)) {
    if (value.length > MAX_ARRAY_LENGTH) {
      addError(errors, path, `Array has too many items. Max ${MAX_ARRAY_LENGTH}.`);
      return;
    }

    value.forEach((item, index) => {
      validateNode(item, `${path}.${index}`, errors, {
        ...state,
        depth: state.depth + 1,
      });
    });
    return;
  }

  if (!isPlainObject(value)) {
    addError(errors, path, 'Value must be a plain JSON object.');
    return;
  }

  const entries = Object.entries(value);

  if (entries.length > MAX_KEYS_PER_OBJECT) {
    addError(errors, path, `Object has too many fields. Max ${MAX_KEYS_PER_OBJECT}.`);
    return;
  }

  for (const [key, child] of entries) {
    if (DANGEROUS_KEYS.has(key)) {
      addError(errors, path ? `${path}.${key}` : key, 'Field name is not allowed.');
      continue;
    }

    if (!/^[a-zA-Z0-9_$-]+$/.test(key)) {
      addError(errors, path ? `${path}.${key}` : key, 'Field name contains invalid characters.');
      continue;
    }

    validateNode(child, path ? `${path}.${key}` : key, errors, {
      ...state,
      depth: state.depth + 1,
    });
  }
}

export function validateContentPayload(file, payload) {
  const errors = [];

  if (!VALID_FILES.has(file)) {
    addError(errors, 'file', 'Invalid content file.');
  }

  if (!isPlainObject(payload)) {
    addError(errors, '(root)', 'Payload must be a JSON object.');
    return { ok: false, errors };
  }

  validateNode(payload, '', errors, {
    depth: 0,
    nodes: 0,
  });

  return {
    ok: errors.length === 0,
    errors,
  };
}
