//point no 1 & 2
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
// Note: 'icon' excluded - handled separately to support both Lucide icon names AND image paths
const IMAGE_KEYS = /(^|\.)(image|logo|background|thumbnail|photo|banner|cover)$/i;
const ICON_KEYS = /(^|\.)(icon)$/i;
const SLUG_KEYS = /(^|\.)(slug)$/i;
const EMAIL_KEYS = /(^|\.)(email|mail|formRecipient)$/i;
const PHONE_KEYS = /(^|\.)(phone|fax|whatsapp|mobile|telephone)$/i;
const DATE_KEYS = /(^|\.)(date|publishedAt|createdAt|updatedAt|eventDate|startDate|endDate)$/i;

const MAX_DEPTH = 12;
const MAX_ARRAY_LENGTH = 150;
const MAX_KEYS_PER_OBJECT = 120;
const MAX_TOTAL_NODES = 8000;
const MAX_SHORT_TEXT = 1000;
const MAX_LONG_TEXT = 6000;
const MAX_URL_LENGTH = 2048;

function maxArrayLengthForPath(file, path) {
  if (file === 'homepage' && path === 'news.items') return 3;
  return MAX_ARRAY_LENGTH;
}

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

// Lucide icon names - common ones used in the project
const LUCIDE_ICONS = new Set([
  'Activity', 'AlertCircle', 'AlertTriangle', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp',
  'Award', 'BarChart', 'BarChart3', 'Book', 'BookOpen', 'Calendar', 'Camera', 'Check',
  'CheckCircle', 'ChevronDown', 'ChevronLeft', 'ChevronRight', 'ChevronUp', 'Clock', 'Cloud',
  'Code', 'Coffee', 'Copy', 'Database', 'Download', 'Edit', 'Edit2', 'Edit3', 'Eye',
  'EyeOff', 'File', 'FileLock', 'FileLock2', 'FileText', 'Filter', 'Flag', 'Folder',
  'FolderOpen', 'Globe', 'GraduationCap', 'Grid', 'Hash', 'Heart', 'Home', 'Image',
  'Info', 'Key', 'Layers', 'Layout', 'LifeBuoy', 'Link', 'List', 'Lock', 'Login',
  'LogOut', 'Mail', 'Map', 'Menu', 'MessageCircle', 'Monitor', 'Moon', 'MoreHorizontal',
  'MoreVertical', 'Network', 'Package', 'PenTool', 'Phone', 'Play', 'Plus', 'Power',
  'Printer', 'Profile', 'Recycle', 'RefreshCw', 'Repeat', 'Save', 'Search', 'Send',
  'Server', 'Settings', 'Share', 'Shield', 'ShieldCheck', 'ShoppingCart', 'Sidebar',
  'Slack', 'Smartphone', 'Square', 'Star', 'Sun', 'Tag', 'Terminal', 'ThumbsDown',
  'ThumbsUp', 'Tool', 'Trash', 'Trash2', 'TrendingDown', 'TrendingUp', 'Type', 'Upload',
  'User', 'Users', 'Video', 'Volume', 'Volume2', 'Wifi', 'Wrench', 'X', 'XCircle',
  'Zap', 'Airplay', 'AlignCenter', 'AlignJustify', 'AlignLeft', 'AlignRight',
  'Anchor', 'Aperture', 'Archive', 'ArrowDownCircle', 'ArrowLeftCircle', 'ArrowRightCircle',
  'ArrowUpCircle', 'AtSign', 'Battery', 'BatteryCharging', 'Bell', 'BellOff',
  'Bluetooth', 'Bold', 'BorderBottom', 'BorderLeft', 'BorderRight', 'BorderTop',
  'Box', 'Briefcase', 'Cast', 'Chatbubble', 'Checkmark',
  'ChevronsDown', 'ChevronsLeft', 'ChevronsRight', 'ChevronsUp', 'Clipboard', 'Close',
  'ColorFilter', 'Compass', 'Connection', 'Contacts', 'Contrast', 'Crop',
  'Cursor', 'Desktop', 'Disc', 'Document', 'DollarSign', 'Droplet',
  'ExternalLink', 'FastForward', 'Feather', 'Flipchart', 'Frown',
  'Gamepad', 'Gift', 'Guitar', 'Headphones',
  'HelpCircle', 'Hexagon', 'Inbox', 'Infinity', 'Italic',
  'Journal', 'Keyboard', 'Loader', 'LogIn', 'Maximize', 'Mic',
  'Minimize', 'Minus', 'Mouse', 'Move', 'Music', 'Navigation', 'Octagon', 'Paperclip',
  'Pause', 'Percent', 'PhoneCall', 'PieChart', 'Pin', 'Power',
  'Radio', 'Rewind', 'Scissors',
  'ShieldOff', 'Shirt', 'ShoppingBag', 'Shrink', 'Signal',
  'SkipBack', 'SkipForward', 'Slash', 'Sliders',
  'Smile', 'Speaker', 'SquareSplitHorizontal', 'SquareSplitVertical',
  'StopCircle', 'Sunrise', 'Sunset', 'Table', 'Tablet',
  'Target', 'Thermometer',
  'ToggleLeft', 'ToggleRight', 'Tree', 'Triangle',
  'Trophy', 'Truck', 'Tv', 'Twitch', 'Twitter', 'Umbrella', 'Underline',
  'Undo', 'Unlink', 'Unlock', 'UserMinus', 'UserPlus',
  'Utensils', 'Voicemail', 'Watch', 'Wind',
  'Youtube', 'ZoomIn', 'ZoomOut',
  'Assessment', 'Design', 'Implementation', 'Maintenance', 'Security', 'Training',
  'Audit', 'Support', 'Asset', 'Disposal', 'Awareness', 'Event',
]);

function isSafeLucideIcon(value) {
  if (!value || typeof value !== 'string') return false;
  return LUCIDE_ICONS.has(value);
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

  // Icon field: Accept either Lucide icon name OR image path
  if (ICON_KEYS.test(path) && value) {
    const isLucide = isSafeLucideIcon(value);
    const isImage = isSafeImagePath(value);
    if (!isLucide && !isImage) {
      addError(errors, path, 'Icon must be a valid Lucide icon name (e.g., "Network", "Activity") or an image path (e.g., "/uploads/icon.png").');
    }
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
    const maxLength = maxArrayLengthForPath(state.file, path);
    if (value.length > maxLength) {
      addError(errors, path, `Array has too many items. Max ${maxLength}.`);
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
    file,
  });

  return {
    ok: errors.length === 0,
    errors,
  };
}
