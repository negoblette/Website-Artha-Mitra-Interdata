import { getContent } from './content';
const CACHE_TTL_MS = 5 * 60 * 1000;
const MAX_CACHE_ENTRIES = 100;
const SAFE_PATH_REGEX = /^[a-zA-Z0-9._]+$/;

const VALID_SOURCES = {
  'solution.json': { file: 'solution', paths: new Set(['solutions', 'services']) },
  'products.json': { file: 'products', paths: new Set(['brands']) },
  'insight.json': { file: 'insight', paths: new Set(['articles.items', 'news.items']) },
};

const SENSITIVE_FIELD_PATTERNS = [
  /password/i,
  /secret/i,
  /access[_-]?token/i,
  /refresh[_-]?token/i,
  /api[_-]?key/i,
  /private[_-]?key/i,
  /\btoken\b/i,
];

const resolutionCache = new Map();

export function clearResolutionCache() {
  resolutionCache.clear();
}

export async function resolveReferences(data, options = {}) {
  const settings = typeof options === 'boolean' ? { clearCache: options } : options;
  const ttl = Number.isFinite(settings.ttl) && settings.ttl > 0 ? settings.ttl : CACHE_TTL_MS;

  if (settings.clearCache) {
    resolutionCache.clear();
  }

  pruneExpiredCache();
  return walkAndResolve(data, {
    ttl,
    now: Date.now(),
    stack: new WeakSet(),
  });
}

function walkAndResolve(value, state) {
  if (Array.isArray(value)) {
    return value.map((item) => walkAndResolve(item, state)).filter(Boolean);
  }

  if (!value || typeof value !== 'object') {
    return value;
  }

  if (Object.prototype.hasOwnProperty.call(value, '_ref')) {
     const refResult = resolveRef(value._ref, state);
    if (refResult && typeof refResult === 'object' && !Array.isArray(refResult)) {
      const { _ref, ...rest } = value;
      return { ...rest, ...refResult };
    }
    return refResult;
 }

  if (state.stack.has(value)) {
    return null;
  }

  state.stack.add(value);
  const resolved = {};

  for (const [key, nestedValue] of Object.entries(value)) {
    resolved[key] = walkAndResolve(nestedValue, state);
  }

  state.stack.delete(value);
  return resolved;
}

function resolveRef(ref, state) {
  if (!ref || typeof ref !== 'object') {
    return null;
  }

  const source = typeof ref.source === 'string' ? ref.source.trim() : '';
  const path = typeof ref.path === 'string' ? ref.path.trim() : '';

  if (!source || !path) {
    return null;
  }

  if (!Object.prototype.hasOwnProperty.call(VALID_SOURCES, source)) {
    return null;
  }

  if (!SAFE_PATH_REGEX.test(path)) {
    return null;
  }

  if (!VALID_SOURCES[source].paths.has(path)) {
    return null;
  }

  const match = isPlainObject(ref.match) ? ref.match : null;
  const filter = isPlainObject(ref.filter) ? ref.filter : null;
  const displayFields = Array.isArray(ref.displayFields)
    ? ref.displayFields.filter((field) => typeof field === 'string' && field.trim())
    : null;

  const cacheKey = JSON.stringify({ source, path, match, filter, displayFields });
  const cached = resolutionCache.get(cacheKey);
  if (cached && cached.expiresAt > state.now) {
    return cloneValue(cached.value);
  }
  if (cached) {
    resolutionCache.delete(cacheKey);
  }

  let sourceData;
  try {
    sourceData = getContent(VALID_SOURCES[source].file);
  } catch {
    return null;
  }

  const items = navigatePath(sourceData, path);
  if (!Array.isArray(items)) {
    return null;
  }

  let resolved = items;

  if (filter) {
    resolved = applyFilter(resolved, filter);
  }

  if (match) {
    const matched = resolved.find((item) =>
      isPlainObject(item) && Object.entries(match).every(([key, val]) => item[key] === val)
    );

    if (!matched) {
      return null;
    }

    resolved = matched;
  }

  const selected = pickFields(resolved, displayFields);
  storeInCache(cacheKey, selected, state.now + state.ttl);
  return cloneValue(selected);
}

function navigatePath(root, path) {
  let current = root;
  const segments = path.split('.');

  for (const segment of segments) {
    if (current === null || current === undefined) {
      return null;
    }

    if (Array.isArray(current)) {
      if (!/^\d+$/.test(segment)) {
        return null;
      }

      const index = Number.parseInt(segment, 10);
      current = current[index];
      continue;
    }

    if (typeof current !== 'object') {
      return null;
    }

    current = current[segment];
  }

  return current;
}

function applyFilter(items, filter) {
  let result = [...items];

  if (typeof filter.sort === 'string' && filter.sort.trim()) {
    const isDesc = filter.sort.startsWith('-');
    const field = isDesc ? filter.sort.slice(1) : filter.sort;

    if (field) {
      result.sort((a, b) => {
        const aVal = String(a?.[field] ?? '');
        const bVal = String(b?.[field] ?? '');
        return isDesc ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
      });
    }
  }

  if (filter.limit !== undefined) {
    const limit = Number.parseInt(filter.limit, 10);
    if (Number.isInteger(limit) && limit >= 0) {
      result = result.slice(0, Math.min(limit, 100));
    }
  }

  return result;
}

function pickFields(item, fields) {
  if (!fields) {
    return sanitizeValue(item);
  }

  if (Array.isArray(item)) {
    return item.map((entry) => pickFields(entry, fields));
  }

  if (!isPlainObject(item)) {
    return item;
  }

  const picked = {};
  for (const field of fields) {
    if (isSensitiveField(field)) {
      continue;
    }

    if (Object.prototype.hasOwnProperty.call(item, field)) {
      picked[field] = sanitizeValue(item[field]);
    }
  }

  return picked;
}

function sanitizeValue(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => sanitizeValue(entry));
  }

  if (!isPlainObject(value)) {
    return value;
  }

  const safe = {};
  for (const [key, nestedValue] of Object.entries(value)) {
    if (isSensitiveField(key)) {
      continue;
    }

    safe[key] = sanitizeValue(nestedValue);
  }

  return safe;
}

function isPlainObject(value) {
  return Boolean(value) && Object.prototype.toString.call(value) === '[object Object]';
}

function isSensitiveField(field) {
  return SENSITIVE_FIELD_PATTERNS.some((pattern) => pattern.test(String(field)));
}

function pruneExpiredCache() {
  const now = Date.now();
  for (const [key, entry] of resolutionCache.entries()) {
    if (entry.expiresAt <= now) {
      resolutionCache.delete(key);
    }
  }

  while (resolutionCache.size > MAX_CACHE_ENTRIES) {
    const oldestKey = resolutionCache.keys().next().value;
    if (oldestKey === undefined) {
      break;
    }
    resolutionCache.delete(oldestKey);
  }
}

function storeInCache(key, value, expiresAt) {
  resolutionCache.set(key, { value, expiresAt });
  pruneExpiredCache();
}

function cloneValue(value) {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value));
}
