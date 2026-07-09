'use client';
import { useState, useEffect, useRef } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import NextLink from 'next/link';
import {
  Home, Info, Layers, Package, Calendar, Globe,
  Save, ChevronRight, Edit3, Check, X,
  Menu, LogOut, Plus, Trash2, Copy, ArrowUp, ArrowDown,
  Lock, BookOpen, History, RotateCcw, Eye, AlertTriangle,
  Link, Mail, Phone, Hash, Calendar as CalendarIcon, Tag,
  ChevronDown,
} from 'lucide-react';
import { MasterListPicker } from '@/components/admin/MasterListPicker';
import SafePreview from '@/components/admin/SafePreview';

const PAGES = [
  { key: 'global', label: 'Global Settings', icon: Globe },
  { key: 'homepage', label: 'Homepage', icon: Home },
  { key: 'about', label: 'About Us', icon: Info },
  { key: 'solution', label: 'Solution', icon: Layers },
  { key: 'products', label: 'Products', icon: Package },
  { key: 'activities', label: 'Activities', icon: Calendar },
  { key: 'insight', label: 'Insight', icon: BookOpen },
];

const READ_ONLY_MAP = {
  homepage: ['hero', 'howItWorks', 'contactSection'],
  about: ['hero', 'vision', 'mission', 'coreValues'],
  solution: ['hero'],
  products: ['hero'],
  activities: ['hero'],
  insight: ['hero'],
};

const UPLOAD_MAX_BYTES = 10 * 1024 * 1024;
const IMAGE_MIME_TYPES = ['image/png', 'image/jpeg'];
const IMAGE_KEY_REGEX = /(image|logo|background|thumbnail|photo|icon|banner|cover)$/i;
const ICON_KEY_REGEX = /^(icon)$/i;

// ─── Field type detection ────────────────────────────────────────────────────

const URL_KEY_REGEX = /^(href|link|url|mapLink|mapEmbedUrl|src|website)$/i;
const DATE_KEY_REGEX = /^(date|publishedAt|createdAt|updatedAt|eventDate|startDate|endDate)$/i;
const PHONE_KEY_REGEX = /^(phone|fax|whatsapp|mobile|telephone)$/i;
const EMAIL_KEY_REGEX = /^(email|mail)$/i;
const CATEGORY_KEY_REGEX = /^(category|type|status|platform)$/i;
const HTML_KEY_REGEX = /(^|\.)(html|richText|richContent|bodyHtml|contentHtml|previewHtml)$/i;
const IFRAME_KEY_REGEX = /(^|\.)(iframeSrc|iframe|embedUrl|mapEmbedUrl)$/i;

function detectFieldType(key = '', value = '', path = '') {
  if (ICON_KEY_REGEX.test(key)) return 'icon';
  if (IMAGE_KEY_REGEX.test(key)) return 'image';
  if (path && /(^|\.)images?\b/i.test(path)) return 'image';
  if (path && /(^|\.)logos?\b/i.test(path)) return 'image';
  if (typeof value === 'string' && /(\/uploads\/|\/images\/|\.png$|\.jpg$|\.jpeg$|\.webp$)/i.test(value) && value.length < 200) return 'image';

  if (HTML_KEY_REGEX.test(key) || (typeof value === 'string' && /<\/?[a-z][\s\S]*>/i.test(value))) return 'html';
  if (IFRAME_KEY_REGEX.test(key)) return 'iframe';

  if (URL_KEY_REGEX.test(key)) return 'url';
  if (typeof value === 'string' && /^https?:\/\//i.test(value) && !IMAGE_KEY_REGEX.test(key)) return 'url';

  if (DATE_KEY_REGEX.test(key)) return 'date';
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return 'date';

  if (PHONE_KEY_REGEX.test(key)) return 'phone';
  if (EMAIL_KEY_REGEX.test(key)) return 'email';
  if (CATEGORY_KEY_REGEX.test(key)) return 'category';

  return 'text';
}

const LUCIDE_ICON_OPTIONS = [
  {name: 'Activity', label: 'Activity'},
    {name: 'AlertCircle', label: 'Alert Circle'},
    {name: 'ArrowDown', label: 'Arrow Down'},
    {name: 'AlertTriangle', label: 'Alert Triangle'},
    {name: 'ArrowLeft', label: 'Arrow Left'},
    {name: 'ArrowRight', label: 'Arrow Right'},
    {name: 'ArrowUp', label: 'Arrow Up'},
    {name: 'Award', label: 'Award'},
    {name: 'BarChart', label: 'Bar Chart'},
    {name: 'BarChart3', label: 'Bar Chart 3'},
    {name: 'Book', label: 'Book'},
    {name: 'BookOpen', label: 'Book Open'},
    {name: 'Calendar', label: 'Calendar'},
    {name: 'Camera', label: 'Camera'},
    {name: 'Check', label: 'Check'},
    {name: 'CheckCircle', label: 'Check Circle'},
    {name: 'ChevronDown', label: 'Chevron Down'},
    {name: 'Cloud', label: 'Cloud'},
    {name: 'Code', label: 'Code'},
    {name: 'Database', label: 'Database'},
    {name: 'Download', label: 'Download'},
    {name: 'Edit', label: 'Edit'},
    {name: 'Edit3', label: 'Edit 3'},
    {name: 'Eye', label: 'Eye'},
    { name: 'Eye', label: 'Eye' },
    { name: 'File', label: 'File' },
    { name: 'FileLock', label: 'File Lock' },
    { name: 'FileLock2', label: 'File Lock 2' },
    { name: 'Filter', label: 'Filter' },
    { name: 'Folder', label: 'Folder' },
    { name: 'Globe', label: 'Globe' },
    { name: 'GraduationCap', label: 'Graduation Cap' },
    { name: 'Grid', label: 'Grid' },
    { name: 'Heart', label: 'Heart' },
    { name: 'Home', label: 'Home' },
    { name: 'Image', label: 'Image' },
    { name: 'Info', label: 'Info' },
    { name: 'Key', label: 'Key' },
    { name: 'Layers', label: 'Layers' },
    { name: 'Layout', label: 'Layout' },
    { name: 'LifeBuoy', label: 'Life Buoy' },
    { name: 'Link', label: 'Link' },
    { name: 'List', label: 'List' },
    { name: 'Lock', label: 'Lock' },
    { name: 'LogOut', label: 'Log Out' },
    { name: 'Mail', label: 'Mail' },
    { name: 'Map', label: 'Map' },
    { name: 'Menu', label: 'Menu' },
    { name: 'Monitor', label: 'Monitor' },
    { name: 'Moon', label: 'Moon' },
    { name: 'MoreHorizontal', label: 'More Horizontal' },
    { name: 'MoreVertical', label: 'More Vertical' },
    { name: 'Network', label: 'Network' },
    { name: 'Package', label: 'Package' },
    { name: 'PenTool', label: 'Pen Tool' },
    { name: 'Phone', label: 'Phone' },
    { name: 'Play', label: 'Play' },
    { name: 'Plus', label: 'Plus' },
    { name: 'Power', label: 'Power' },
    { name: 'Printer', label: 'Printer' },
    { name: 'Recycle', label: 'Recycle' },
    { name: 'RefreshCw', label: 'Refresh CW' },
    { name: 'Save', label: 'Save' },
    { name: 'Search', label: 'Search' },
    { name: 'Send', label: 'Send' },
    { name: 'Server', label: 'Server' },
    { name: 'Settings', label: 'Settings' },
    { name: 'Share', label: 'Share' },
    { name: 'Shield', label: 'Shield' },
    { name: 'ShieldCheck', label: 'Shield Check' },
    { name: 'ShoppingCart', label: 'Shopping Cart' },
    { name: 'Smartphone', label: 'Smartphone' },
    { name: 'Star', label: 'Star' },
    { name: 'Sun', label: 'Sun' },
    { name: 'Tag', label: 'Tag' },
    { name: 'Terminal', label: 'Terminal' },
    { name: 'ThumbsUp', label: 'Thumbs Up' },
    { name: 'Tool', label: 'Tool' },
    { name: 'Trash', label: 'Trash' },
    { name: 'Trash2', label: 'Trash 2' },
    { name: 'TrendingUp', label: 'Trending Up' },
    { name: 'Upload', label: 'Upload' },
    { name: 'User', label: 'User' },
    { name: 'Users', label: 'Users' },
    { name: 'Video', label: 'Video' },
    { name: 'Wifi', label: 'Wifi' },
    { name: 'Wrench', label: 'Wrench' },
    { name: 'X', label: 'X' },
    { name: 'XCircle', label: 'X Circle' },
    { name: 'Zap', label: 'Zap' },
];

// ─── Diff computation ────────────────────────────────────────────────────────

function flattenObject(obj, prefix = '') {
  const result = {};
  if (obj === null || obj === undefined) return result;
  if (typeof obj !== 'object' || Array.isArray(obj)) {
    result[prefix || '(root)'] = obj;
    return result;
  }
  for (const [key, val] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
      Object.assign(result, flattenObject(val, fullKey));
    } else if (Array.isArray(val)) {
      result[fullKey] = JSON.stringify(val);
    } else {
      result[fullKey] = val;
    }
  }
  return result;
}

function computeDiff(original, updated) {
  const origFlat = flattenObject(original);
  const newFlat = flattenObject(updated);
  const allKeys = new Set([...Object.keys(origFlat), ...Object.keys(newFlat)]);
  const changes = [];

  for (const key of allKeys) {
    const oldVal = origFlat[key];
    const newVal = newFlat[key];
    const oldStr = oldVal === undefined ? undefined : String(oldVal);
    const newStr = newVal === undefined ? undefined : String(newVal);
    if (oldStr !== newStr) {
      changes.push({ path: key, oldVal, newVal });
    }
  }
  return changes;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isReadOnlyPath(path, readOnlyPaths = []) {
  if (!path) return false;
  return readOnlyPaths.some((blocked) => path === blocked || path.startsWith(`${blocked}.`));
}

function getValueAtPath(obj, path) {
  if (!obj || !path) return undefined;
  return path.split('.').reduce((acc, key) => {
    if (acc === null || acc === undefined) return undefined;
    return acc[key];
  }, obj);
}

function normalizeHomepageData(payload) {
  const copy = JSON.parse(JSON.stringify(payload));
  const tabs = copy?.offerings?.tabs;

  if (Array.isArray(tabs)) {
    copy.offerings.tabs = tabs.map((tab) => {
      const normalizedTab = { ...tab };
      if (normalizedTab.items && !Array.isArray(normalizedTab.items)) {
        normalizedTab.items = [normalizedTab.items];
      }
      if (!Array.isArray(normalizedTab.items)) {
        normalizedTab.items = [];
      }
      return normalizedTab;
    });
  }

  if (copy?.news) {
    if (copy.news.items && !Array.isArray(copy.news.items)) {
      copy.news.items = [copy.news.items];
    }
    if (!Array.isArray(copy.news.items)) {
      copy.news.items = [];
    }
  }

  return copy;
}

function isHomepageOfferingsItemsPath(path = '') {
  return /^offerings\.tabs\.\d+\.items$/.test(path);
}

function isHomepageNewsItemsPath(path = '') {
  return path === 'news.items';
}

function getOfferingTabConfig(allData, path = '') {
  const match = path.match(/^offerings\.tabs\.(\d+)\.items$/);
  if (!match) return null;

  const tabIndex = Number.parseInt(match[1], 10);
  const tab = getValueAtPath(allData, `offerings.tabs.${tabIndex}`);
  if (!tab || typeof tab !== 'object') return null;

  const label = String(tab.label || tab.title || tab.eyebrow || '').toLowerCase();
  if (label.includes('service')) {
    return {
      source: 'solution.json',
      sourcePath: 'services',
      displayField: 'name',
      matchField: 'name',
      displayFields: ['name', 'description'],
      placeholder: 'Pilih Service dari Master List',
      searchPlaceholder: 'Cari service yang ingin ditampilkan',
    };
  }

  return {
    source: 'solution.json',
    sourcePath: 'solutions',
    displayField: 'name',
    matchField: 'slug',
    displayFields: ['name', 'shortDescription'],
    placeholder: 'Pilih Solution dari Master List',
    searchPlaceholder: 'Cari solution yang ingin ditampilkan',
  };
}

function getHomepageNewsConfig(path = '') {
  if (!isHomepageNewsItemsPath(path)) return null;

  return {
    source: 'insight.json',
    sourcePath: 'news.items',
    displayField: 'title',
    matchField: 'slug',
    displayFields: ['slug', 'category', 'title', 'excerpt', 'date'],
    placeholder: 'Pilih News dari Master List',
    searchPlaceholder: 'Cari news yang ingin ditampilkan',
    maxItems: 3,
  };
}

function getHomepageMasterListConfig(allData, path = '') {
  return getOfferingTabConfig(allData, path) || getHomepageNewsConfig(path);
}

function buildMasterListRef(item, config) {
  const matchValue = item?.[config.matchField];
  if (!matchValue) return null;

  return {
    _ref: {
      source: config.source,
      path: config.sourcePath,
      match: { [config.matchField]: matchValue },
      displayFields: config.displayFields,
    },
  };
}

const ARRAY_LABEL_OVERRIDES = {
  items: 'Item', testimonials: 'Testimonial', news: 'News',
  programs: 'Program', events: 'Event', solutions: 'Solution',
  services: 'Service', brands: 'Brand', images: 'Image',
  positions: 'Position', points: 'Point', milestones: 'Milestone',
  socials: 'Social', tabs: 'Tab', features: 'Feature', links: 'Link',
  columns: 'Column', tags: 'Tag',
};

const SINGLE_ITEM_ARRAY_PATHS = [/^programs\.items\.\d+\.images$/];

function toTitleCase(value = '') {
  return value
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function singularize(label = '') {
  if (!label) return label;
  if (label.toLowerCase() === 'news') return 'News';
  if (label.endsWith('s')) return label.slice(0, -1);
  return label;
}

function getArrayItemBaseLabel(path = '') {
  if (!path) return '';
  const parts = path.split('.');
  const last = parts[parts.length - 1];
  const fallbackKey = last === 'items' && parts.length > 1 ? parts[parts.length - 2] : last;
  const rawKey = (ARRAY_LABEL_OVERRIDES[last] && last !== 'items') ? last : fallbackKey;
  const override = ARRAY_LABEL_OVERRIDES[rawKey];
  if (override) return override;
  return singularize(toTitleCase(rawKey));
}

function isSingleItemArrayPath(path = '') {
  return SINGLE_ITEM_ARRAY_PATHS.some((pattern) => pattern.test(path));
}

/** Collect all unique category values from a data object */
function collectCategories(obj, acc = new Set()) {
  if (!obj || typeof obj !== 'object') return acc;
  if (Array.isArray(obj)) {
    obj.forEach((item) => collectCategories(item, acc));
  } else {
    for (const [key, val] of Object.entries(obj)) {
      if (CATEGORY_KEY_REGEX.test(key) && typeof val === 'string' && val) acc.add(val);
      else if (typeof val === 'object') collectCategories(val, acc);
    }
  }
  return acc;
}

/** Collect all unique brand objects from data (keyed by name) */
function collectAllBrands(obj) {
  const brandsMap = new Map();
  function walk(node) {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    for (const [key, val] of Object.entries(node)) {
      if (key === 'brands' && Array.isArray(val)) {
        val.forEach((brand) => {
          if (brand && typeof brand === 'object' && brand.name) {
            if (!brandsMap.has(brand.name)) {
              brandsMap.set(brand.name, { ...brand });
            }
          }
        });
      } else if (typeof val === 'object') {
        walk(val);
      }
    }
  }
  walk(obj);
  return [...brandsMap.values()].sort((a, b) => a.name.localeCompare(b.name));
}


function collectAllSolutions(obj) {
  const solutionsMap = new Map();
  function walk(node) {
    if(!node || typeof node !== 'object') return;
    if(Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    for (const [key, val] of Object.entries(node)) {
      if (key === 'solutions' && Array.isArray(val)) {
        val.forEach((sol) => {
          if (sol && typeof sol === 'object' && sol.slug) {
            if(!solutionsMap.has(sol.slug)) {
              solutionsMap.set(sol.slug, { ...sol });
            }
          }
        });
      } else if (typeof val === 'object') {
        walk(val);
      }
    }
  }
  walk(obj);
  return [...solutionsMap.values()].sort((a, b) => a.name.localeCompare(b.name)); 
}

function formatTimestamp(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Modals ───────────────────────────────────────────────────────────────────

function DeleteConfirmModal({ item, onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onCancel}
          />
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <Trash2 size={18} className="text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Hapus Item?</h3>
                <p className="text-gray-500 text-xs">Aksi ini tidak dapat dibatalkan.</p>
              </div>
            </div>
            {item.label && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mb-4">
                <p className="text-gray-700 text-sm font-mono truncate">{item.label}</p>
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors"
              >
                Batal
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
              >
                Hapus
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DiffPreviewModal({ diff, onConfirm, onCancel, saving }) {
  return (
    <AnimatePresence>
      {diff !== null && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={!saving ? onCancel : undefined}
          />
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl z-10 flex flex-col max-h-[80vh]"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Eye size={16} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm">Preview Perubahan</h3>
                <p className="text-gray-500 text-xs">
                  {diff.length === 0
                    ? 'Tidak ada perubahan yang terdeteksi.'
                    : `${diff.length} field yang berubah`}
                </p>
              </div>
              <button onClick={!saving ? onCancel : undefined} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Diff content */}
            <div className="overflow-y-auto flex-1 px-6 py-4">
              {diff.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                  <Check size={32} className="mb-2 text-green-500" />
                  <p className="text-sm">Semua data sudah sama dengan yang tersimpan.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {diff.map((change, i) => (
                    <div key={i} className="rounded-lg border border-gray-200 overflow-hidden text-xs font-mono">
                      <div className="px-3 py-1.5 bg-gray-50 border-b border-gray-200">
                        <span className="text-gray-600 font-sans font-medium">{change.path}</span>
                      </div>
                      {change.oldVal !== undefined && (
                        <div className="px-3 py-2 bg-red-50 border-b border-red-100 flex gap-2">
                          <span className="text-red-400 select-none">−</span>
                          <span className="text-red-700 break-all">
                            {String(change.oldVal).length > 200
                              ? String(change.oldVal).slice(0, 200) + '…'
                              : String(change.oldVal)}
                          </span>
                        </div>
                      )}
                      {change.newVal !== undefined && (
                        <div className="px-3 py-2 bg-green-50 flex gap-2">
                          <span className="text-green-400 select-none">+</span>
                          <span className="text-green-700 break-all">
                            {String(change.newVal).length > 200
                              ? String(change.newVal).slice(0, 200) + '…'
                              : String(change.newVal)}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-2 px-6 py-4 border-t border-gray-200 flex-shrink-0">
              <button
                onClick={onCancel}
                disabled={saving}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={onConfirm}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium transition-colors"
              >
                <Save size={14} />
                {saving ? 'Menyimpan...' : (diff.length === 0 ? 'Simpan Tanpa Perubahan' : 'Konfirmasi & Simpan')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ErrorModal({ error, onClose }) {
  return (
    <AnimatePresence>
      {error && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10 flex flex-col max-h-[80vh]"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle size={16} className="text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm">{error.title || 'Error'}</h3>
                <p className="text-gray-500 text-xs">{error.message}</p>
              </div>
              <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Error details */}
            {error.details && error.details.length > 0 && (
              <div className="overflow-y-auto flex-1 px-6 py-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Validation Errors:</p>
                <div className="space-y-2">
                  {error.details.map((detail, i) => (
                    <div key={i} className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                      <p className="text-xs font-mono text-red-800 font-semibold">{detail.path}</p>
                      <p className="text-sm text-red-600 mt-1">{detail.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex gap-2 px-6 py-4 border-t border-gray-200 flex-shrink-0">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function IconPicker({value, onChange, label}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIcons = LUCIDE_ICON_OPTIONS.filter(icon =>
    icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    icon.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedIcon = LUCIDE_ICON_OPTIONS.find(i => i.name === value);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>

      {/* display selected icon */}
      <div
        className="flex items-center gap-2 p-2 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedIcon ? (
          <>
            <span className="text-lg">{selectedIcon.name}</span>
            <span className="text-sm text-gray-600">{selectedIcon.label}</span>
          </>
        ) : (
          <span className="text-sm text-gray-400">Select icon...</span>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {/* search Input */}
          <div className="sticky top-0 bg-white p-2 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search Icons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          {/* icon grid */}
          <div className="p-2 grid grid-cols-4 gap-2">
            {filteredIcons.map(icon => (
              <div
                key={icon.name}
                className={`flex flex-col items-center p-2 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors ${
                  value === icon.name ? 'bg-blue-100 border-2 border-blue-500' : ''
                }`}
                onClick={() => {
                  onChange(icon.name);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
              >
                  <span className="text-xl mb-1">{icon.name}</span>
                  <span className="text-xs text-gray-600 text-center">{icon.label}</span>
              </div>
            ))}
          </div>

          {filteredIcons.length === 0 && (
            <div className="p-4 text-center text-sm text-gray-500">
              No icons found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function HistoryPanel({ open, onClose, file, onRestored }) {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(null);
  const [restoreConfirm, setRestoreConfirm] = useState(null);

  useEffect(() => {
    if (!open || !file) return;

    let cancelled = false;

    async function loadBackups() {
      setLoading(true);
      try {
        const res = await fetch(`/api/backups?file=${file}`);
        const json = await res.json();
        if (!cancelled) setBackups(json.backups || []);
      } catch {
        if (!cancelled) setBackups([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadBackups();

    return () => {
      cancelled = true;
    };
  }, [open, file]);

  async function handleRestore(backup) {
    setRestoring(backup.filename);
    try {
      const res = await fetch('/api/backups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file, filename: backup.filename }),
      });
      if (res.ok) {
        onRestored();
        onClose();
      }
    } finally {
      setRestoring(null);
      setRestoreConfirm(null);
    }
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-[90] bg-black/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            <motion.aside
              className="fixed top-0 right-0 h-full w-80 bg-white border-l border-gray-200 shadow-2xl z-[100] flex flex-col"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            >
              <div className="flex items-center gap-2 px-4 py-4 border-b border-gray-200">
                <History size={18} className="text-blue-600" />
                <h2 className="font-semibold text-gray-900 text-sm flex-1">Riwayat Backup</h2>
                <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
                  {PAGES.find((p) => p.key === file)?.label}
                </span>
                <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : backups.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <History size={32} className="mb-3 opacity-40" />
                    <p className="text-sm text-center">Belum ada backup.<br />Backup dibuat otomatis saat save.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-400 px-1 mb-3">
                      Maksimal 10 backup terbaru disimpan per file.
                    </p>
                    {backups.map((b, i) => (
                      <div key={b.filename} className="group border border-gray-200 rounded-xl p-3 hover:border-blue-200 hover:bg-blue-50/30 transition-colors">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              {i === 0 && (
                                <span className="text-[10px] font-semibold text-blue-600 bg-blue-100 rounded-full px-1.5 py-0.5 leading-none">
                                  Terbaru
                                </span>
                              )}
                              <span className="text-xs text-gray-700 font-medium">
                                {formatTimestamp(b.timestamp)}
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-400">{formatBytes(b.size)}</p>
                          </div>
                          <button
                            onClick={() => setRestoreConfirm(b)}
                            disabled={restoring === b.filename}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 text-xs font-medium transition-colors disabled:opacity-50 flex-shrink-0"
                          >
                            <RotateCcw size={11} />
                            {restoring === b.filename ? '...' : 'Restore'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Restore akan menyimpan backup dari data saat ini sebelum mengembalikan versi lama.
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Restore confirmation modal */}
      <AnimatePresence>
        {restoreConfirm && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setRestoreConfirm(null)} />
            <motion.div
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle size={18} className="text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Restore Backup?</h3>
                  <p className="text-gray-500 text-xs">Konten aktif akan diganti dengan versi ini.</p>
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4">
                <p className="text-amber-800 text-xs font-medium">{formatTimestamp(restoreConfirm.timestamp)}</p>
                <p className="text-amber-600 text-[11px]">{formatBytes(restoreConfirm.size)}</p>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Data saat ini akan di-backup terlebih dahulu sebelum restore dilakukan.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setRestoreConfirm(null)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleRestore(restoreConfirm)}
                  disabled={restoring !== null}
                  className="flex-1 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-sm font-medium transition-colors"
                >
                  {restoring ? 'Restoring...' : 'Restore'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Login ───────────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const officialAdminURL = process.env.NEXT_PUBLIC_ADMIN_CANONICAL_URL;

  function getRetryMessage(res, fallback) {
    const retryAfter = Number(res.headers.get('Retry-After') || 0);

    if (!retryAfter) {
      return fallback;
    }

    const minutes = Math.ceil(retryAfter / 60);
    return `${fallback} Try again in about ${minutes} minute${minutes > 1 ? 's' : ''}.`;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (step === 'password') {
        const res = await fetch('/api/auth/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password }),
        });

        if (res.ok) {
          setStep('otp');
          setOtp('');
        } else if (res.status === 429) {
          setError(getRetryMessage(res, 'Too many login attempts.'));
        } else if (res.status === 500) {
          setError('Admin auth is not configured. Check server environment variables.');
        } else {
          setError('Invalid password');
        }
      } else {
        const res = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ otp }),
        });

        if (res.ok) {
          onLogin();
        } else if (res.status === 429) {
          setError(getRetryMessage(res, 'Too many OTP attempts.'));
        } else if (res.status === 500) {
          setError('Admin auth is not configured. Check server environment variables.');
        } else {
          setError('Invalid or expired OTP');
        }
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-36 h-14">
              <Image src="/logo.png" alt="AMI" fill className="object-contain" priority />
            </div>
          </div>
          <h1 className="text-gray-900 text-xl font-bold text-center mb-1">AMI Admin</h1>
          <p className="text-gray-500 text-sm text-center mb-6">
            {step === 'password' ? 'Enter admin password to continue' : 'Enter your authenticator code'}
          </p>
          <form onSubmit={handleSubmit}>
            {step === 'password' ? (
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin password"
                autoFocus
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 mb-4"
              />
            ) : (
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="6-digit OTP"
                autoFocus
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 text-sm text-center tracking-[0.35em] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 mb-4"
              />
            )}
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-xs mb-3"
              >
                {error}
              </motion.p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-sm font-medium transition-colors"
            >
              {loading ? 'Checking...' : step === 'password' ? 'Continue' : 'Sign In'}
            </button>
            {step === 'otp' && (
              <button
                type="button"
                onClick={() => {
                  setStep('password');
                  setOtp('');
                  setError('');
                }}
                className="w-full mt-3 text-gray-500 hover:text-gray-800 text-xs transition-colors"
              >
                Use a different password
              </button>
            )}
          </form>

          {officialAdminURL && (
            <p className="mt-4 text-center text-xs text-gray-400">
              Official admin URL: {officialAdminURL}
            </p>
          )}

        </div>
      </motion.div>
    </div>
  );
}

// ─── Admin Page ───────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [activePage, setActivePage] = useState('homepage');
  const [data, setData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(false);

  // Diff preview modal state
  const [diffModal, setDiffModal] = useState(null); // null | diff[]

  // Delete confirmation modal state
  const [deleteConfirm, setDeleteConfirm] = useState(null); // null | { path, index, label }

  // Error modal state
  const [errorModal, setErrorModal] = useState(null); // null | { title, message, details: [] }

  useEffect(() => {
    async function checkSession() {
      const res = await fetch('/api/auth/me');
      setIsAuthenticated(res.ok);
      setAuthChecked(true);
    }

    checkSession();
  }, []);

  useEffect(() => {
    if (isAuthenticated) loadData(activePage);
  }, [activePage, isAuthenticated]);

  async function loadData(page) {
    setLoading(true);
    setHistoryOpen(false);
    const res = await fetch(`/api/content?file=${page}`);
    if (res.ok) {
      const json = await res.json();
      const normalized = page === 'homepage' ? normalizeHomepageData(json) : json;
      setData(normalized);
      setOriginalData(JSON.parse(JSON.stringify(normalized)));
    } else if (res.status === 401) {
      setIsAuthenticated(false);
      setData(null);
    }
    setLoading(false);
  }

  async function doSave() {
    setSaving(true);
    const res = await fetch(`/api/content?file=${activePage}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const saved_data = await res.json();
      setOriginalData(JSON.parse(JSON.stringify(data)));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } else {
      // Handle error response
      const errorData = await res.json().catch(() => ({ error: 'Unknown error occurred' }));
      const errorMessage = errorData.error || 'Failed to save content';
      const errorDetails = errorData.details || [];

      // Show error in modal
      setErrorModal({
        title: 'Save Failed',
        message: errorMessage,
        details: errorDetails,
      });
    }
    setSaving(false);
    setDiffModal(null);
  }

  function handleSave() {
    if (!data) return;
    const diff = computeDiff(originalData || {}, data);
    setDiffModal(diff);
  }

  async function handleUpload(path, file) {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error?.error || 'Upload failed');
    }

    const json = await res.json();
    if (json?.url) updateField(path, json.url);
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setIsAuthenticated(false);
    setData(null);
  }

  function updateField(path, value) {
    setData((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let obj = copy;
      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        obj = isNaN(k) ? obj[k] : obj[parseInt(k)];
      }
      const lastKey = keys[keys.length - 1];
      obj[isNaN(lastKey) ? lastKey : parseInt(lastKey)] = value;
      return copy;
    });
  }

  function addArrayItem(path) {
    setData((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let obj = copy;
      for (const k of keys) {
        obj = isNaN(k) ? obj[k] : obj[parseInt(k)];
      }
      if (!Array.isArray(obj)) return copy;
      if (isSingleItemArrayPath(path) && obj.length >= 1) return copy;
      if (obj.length > 0) {
        const template = JSON.parse(JSON.stringify(obj[obj.length - 1]));
        clearValues(template);
        obj.push(template);
      } else {
        obj.push('');
      }
      return copy;
    });
  }

  function addBrandItem(path, brand) {
    setData((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let obj = copy;
      for (const k of keys) {
        obj = isNaN(k) ? obj[k] : obj[parseInt(k)];
      }
      if (!Array.isArray(obj)) return copy;
      // Prevent duplicate brands
      const alreadyExists = obj.some((b) => b && b.name === brand.name);
      if (alreadyExists) return copy;
      obj.push(JSON.parse(JSON.stringify(brand)));
      return copy;
    });
  }

  function addMasterListItems(path, items) {
    setData((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let obj = copy;
      for (const k of keys) {
        obj = isNaN(k) ? obj[k] : obj[parseInt(k)];
      }
      if (!Array.isArray(obj)) return copy;

      const config = activePage === 'homepage' ? getHomepageMasterListConfig(copy, path) : null;
      if (config) {
        const existingKeys = new Set(
          obj.map((entry) => JSON.stringify(entry?._ref?.match || {})).filter((value) => value !== '{}')
        );
        const maxItems = Number.isInteger(config.maxItems) && config.maxItems > 0 ? config.maxItems : null;
        const remainingSlots = maxItems ? Math.max(maxItems - obj.length, 0) : Infinity;
        if (remainingSlots === 0) return copy;

        let addedCount = 0;
        for (const item of items) {
          if (addedCount >= remainingSlots) break;
          const refItem = buildMasterListRef(item, config);
          const refKey = refItem?._ref?.match ? JSON.stringify(refItem._ref.match) : '';
          if (!refItem || existingKeys.has(refKey)) continue;
          existingKeys.add(refKey);
          obj.push(refItem);
          addedCount += 1;
        }
        return copy;
      }

      for (const item of items) {
        const existsKey = item?.slug || item?.name;
        const alreadyExists = obj.some((entry) => (entry?.slug || entry?.name) === existsKey);
        if (!alreadyExists) {
          obj.push(JSON.parse(JSON.stringify(item)));
        }
      }
      return copy;
    });
  }

  function addSolutionItem(path, solution) {
    addMasterListItems(path, [solution]);
  }

  // NEW: Function to add service from master list
  function addServiceItem(path, service) {
    addMasterListItems(path, [service]);
  }

  // NEW: Function to add news from master list
  function addNewsItem(path, news) {
    setData((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let obj = copy;
      for (const k of keys) {
        obj = isNaN(k) ? obj[k] : obj[parseInt(k)];
      }
      if (!Array.isArray(obj)) return copy;

      // Prevent duplicate news
      const alreadyExists = obj.some((n) => n && n.slug === news.slug);
      if (alreadyExists) return copy;

      // Add the news (from master list picker)
      obj.push(JSON.parse(JSON.stringify(news)));
      return copy;
    });
  }

  function requestRemoveArrayItem(path, index, label) {
    setDeleteConfirm({ path, index, label });
  }

  function confirmRemoveArrayItem() {
    if (!deleteConfirm) return;
    const { path, index } = deleteConfirm;
    setData((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let obj = copy;
      for (const k of keys) {
        obj = isNaN(k) ? obj[k] : obj[parseInt(k)];
      }
      if (Array.isArray(obj)) obj.splice(index, 1);
      return copy;
    });
    setDeleteConfirm(null);
  }

  function duplicateArrayItem(path, index) {
    setData((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let obj = copy;
      for (const k of keys) {
        obj = isNaN(k) ? obj[k] : obj[parseInt(k)];
      }
      if (Array.isArray(obj)) {
        if (isSingleItemArrayPath(path)) return copy;
        const duplicate = JSON.parse(JSON.stringify(obj[index]));
        obj.splice(index + 1, 0, duplicate);
      }
      return copy;
    });
  }

  function moveArrayItem(path, index, direction) {
    setData((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let obj = copy;
      for (const k of keys) {
        obj = isNaN(k) ? obj[k] : obj[parseInt(k)];
      }
      if (!Array.isArray(obj)) return copy;
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= obj.length) return copy;
      [obj[index], obj[newIndex]] = [obj[newIndex], obj[index]];
      return copy;
    });
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 260 : 72 }}
        className="bg-white border-r-2 border-gray-200 shadow-[2px_0_8px_rgba(0,0,0,0.06)] flex flex-col fixed top-0 left-0 h-full z-50"
      >
        <div className="p-4 border-b border-gray-200 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="text-gray-700" size={20} />
          </button>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative w-52 h-14 overflow-hidden"
            >
              <Image src="/logo.png" alt="AMI" fill className="object-contain object-left" priority />
            </motion.div>
          )}
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {PAGES.map((page) => {
            const Icon = page.icon;
            return (
              <button
                key={page.key}
                onClick={() => setActivePage(page.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  activePage === page.key
                    ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon size={18} />
                {sidebarOpen && <span>{page.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-200 space-y-1">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500/70 hover:text-red-600 hover:bg-red-50 transition-all"
          >
            <Lock size={18} />
            {sidebarOpen && <span>Logout</span>}
          </button>
          <NextLink
            href="/"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all"
          >
            <LogOut size={18} />
            {sidebarOpen && <span>View Site</span>}
          </NextLink>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all ${sidebarOpen ? 'ml-[260px]' : 'ml-[72px]'}`}>
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200 px-6 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-black font-semibold text-lg">
              {PAGES.find((p) => p.key === activePage)?.label}
            </h1>
            <p className="text-black/60 text-xs">Edit content for this page</p>
          </div>

          <div className="flex items-center gap-3">
            {saved && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1 text-green-600 text-sm"
              >
                <Check size={16} />
                Saved & Revalidated!
              </motion.div>
            )}

            {/* History button */}
            <button
              onClick={() => setHistoryOpen(true)}
              className="flex items-center gap-2 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              title="Riwayat Backup"
            >
              <History size={16} />
              <span className="hidden sm:inline">History</span>
            </button>

            <button
              onClick={handleSave}
              disabled={saving || !data}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Save size={16} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : data ? (
            <div className="max-w-4xl">
              <JsonEditor
                data={data}
                path=""
                activePage={activePage}
                onChange={updateField}
                onAddItem={addArrayItem}
                onRemoveItem={requestRemoveArrayItem}
                onDuplicateItem={duplicateArrayItem}
                onMoveItem={moveArrayItem}
                onUpload={handleUpload}
                onAddBrand={addBrandItem}
                onAddSolution={addSolutionItem}
                onAddService={addServiceItem}
                onAddNews={addNewsItem}
                onAddMasterListItems={addMasterListItems}
                readOnlyPaths={READ_ONLY_MAP[activePage]}
                allData={data}
              />
            </div>
          ) : null}
        </div>
      </main>

      {/* History Panel */}
      <HistoryPanel
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        file={activePage}
        onRestored={() => loadData(activePage)}
      />

      {/* Diff Preview Modal */}
      <DiffPreviewModal
        diff={diffModal}
        onConfirm={doSave}
        onCancel={() => setDiffModal(null)}
        saving={saving}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        item={deleteConfirm}
        onConfirm={confirmRemoveArrayItem}
        onCancel={() => setDeleteConfirm(null)}
      />

      {/* Error Modal */}
      <ErrorModal
        error={errorModal}
        onClose={() => setErrorModal(null)}
      />
    </div>
  );
}

// ─── Clear helper ─────────────────────────────────────────────────────────────

function clearValues(obj) {
  if (typeof obj === 'object' && obj !== null) {
    for (const key of Object.keys(obj)) {
      if (typeof obj[key] === 'string') obj[key] = '';
      else if (typeof obj[key] === 'number') obj[key] = 0;
      else if (typeof obj[key] === 'boolean') obj[key] = false;
      else if (Array.isArray(obj[key])) obj[key] = [];
      else if (typeof obj[key] === 'object') clearValues(obj[key]);
    }
  }
}

// ─── Smart field inputs ───────────────────────────────────────────────────────

const FIELD_TYPE_META = {
  url:      { icon: Link,         accent: 'blue',  label: 'URL'      },
  date:     { icon: CalendarIcon, accent: 'purple', label: 'Date'     },
  category: { icon: Tag,          accent: 'orange', label: 'Kategori' },
  phone:    { icon: Phone,        accent: 'green',  label: 'Telepon'  },
  email:    { icon: Mail,         accent: 'cyan',   label: 'Email'    },
  text:     { icon: Edit3,        accent: 'gray',   label: 'Teks'     },
  image:    { icon: Edit3,        accent: 'gray',   label: 'Gambar'   },
};

const ACCENT_CLASSES = {
  blue:   { border: 'focus:border-blue-500 focus:ring-blue-500',   badge: 'bg-blue-50 text-blue-600 border-blue-200' },
  purple: { border: 'focus:border-purple-500 focus:ring-purple-500', badge: 'bg-purple-50 text-purple-600 border-purple-200' },
  orange: { border: 'focus:border-orange-500 focus:ring-orange-500', badge: 'bg-orange-50 text-orange-600 border-orange-200' },
  green:  { border: 'focus:border-green-500 focus:ring-green-500',  badge: 'bg-green-50 text-green-600 border-green-200' },
  cyan:   { border: 'focus:border-cyan-500 focus:ring-cyan-500',    badge: 'bg-cyan-50 text-cyan-600 border-cyan-200' },
  gray:   { border: 'focus:border-blue-500 focus:ring-blue-500',    badge: 'bg-gray-100 text-gray-500 border-gray-200' },
};

function FieldTypeBadge({ type }) {
  const meta = FIELD_TYPE_META[type];
  if (!meta || type === 'text' || type === 'image') return null;
  const Icon = meta.icon;
  const classes = ACCENT_CLASSES[meta.accent] || ACCENT_CLASSES.gray;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-medium ${classes.badge}`}>
      <Icon size={9} />
      {meta.label}
    </span>
  );
}

function CategoryCombobox({ value, onChange, allData, readOnly }) {
  const [open, setOpen] = useState(false);
  const categories = [...collectCategories(allData)].sort();

  return (
    <div className="relative">
      <div className="flex items-center gap-1">
        <input
          type="text"
          value={value}
          onChange={readOnly ? undefined : (e) => onChange(e.target.value)}
          readOnly={readOnly}
          placeholder="Pilih atau ketik kategori..."
          className={`flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-black text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-mono ${readOnly ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`}
        />
        {!readOnly && categories.length > 0 && (
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="p-2 rounded-lg border border-gray-300 hover:border-orange-400 hover:bg-orange-50 text-gray-400 hover:text-orange-600 transition-colors"
          >
            <ChevronDown size={14} />
          </button>
        )}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => { onChange(cat); setOpen(false); }}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors"
              >
                {cat}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── BrandPicker (inline list to select existing brand) ──────────────────────

function BrandPicker({ allBrands = [], currentBrands, onSelect, createOnly = false }) {
  const [open, setOpen] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Filter out brands already in the current array
  const sourceBrands = Array.isArray(allBrands) ? allBrands : [];
  const currentNames = new Set((currentBrands || []).map((b) => b?.name).filter(Boolean));
  const available = createOnly ? [] : sourceBrands.filter((b) => !currentNames.has(b.name));

  //auto generating slug
  const autoSlug = (name) => {
    if(!name) return '';
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  //handle add custom brand
  const handleAddCustom = async () => {
    //input validation
    if(!customName.trim()){
      setError('Brand name cannot be empty');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const newBrand = {
        name: customName.trim(),
        slug: customSlug.trim() || autoSlug(customName),
        logo: '',
        website: '',
        description: '',
        solutions: [],
      };

      //slug validation
      if(!newBrand.slug) {
        setError('Slug cannot be empty');
        return;
      }

      //call API
      const res = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBrand), 
      });


      //handle response
      if(!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to add brand');
      }

      //sukses add to current page
      onSelect(newBrand);

      //Reset form
      setCustomName('');
      setCustomSlug('');
      setShowCustom(false);
      setOpen(false);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to add brand');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-gray-300 text-gray-400 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all text-sm w-full justify-center"
      >
        <Plus size={14} />
        {createOnly ? 'Tambah Brand Baru' : 'Add Item'}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-2 border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
              <div className="max-h-64 overflow-y-auto divide-y divide-gray-100">
                {/* error message */}
                {error && (
                  <div className="px-4 py-3 bg-red-50 border-b border-red-100">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* custom brand form */}
                {createOnly || showCustom ? (
                <div className="p-4 bg-white space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">
                      Brand Name *
                    </label>
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => {
                        setCustomName(e.target.value);
                        setCustomSlug(autoSlug(e.target.value));
                        setError(null);
                      }}
                      placeholder="e.g., Microsoft Azure"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !saving) {
                          handleAddCustom();
                        }
                        if (e.key === 'Escape') {
                          setShowCustom(false);
                          setCustomName('');
                          setCustomSlug('');
                          setError(null);
                        }
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">
                      Slug *
                    </label>
                    <input
                      type="text"
                      value={customSlug}
                      onChange={(e) => {
                        setCustomSlug(e.target.value);
                        setError(null);
                      }}
                      placeholder="e.g., microsoft-azure"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !saving) {
                          handleAddCustom();
                        }
                        if (e.key === 'Escape') {
                          setShowCustom(false);
                          setCustomName('');
                          setCustomSlug('');
                          setError(null);
                        }
                      }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCustom(false);
                        setCustomName('');
                        setCustomSlug('');
                        setError(null);
                      }}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAddCustom}
                      disabled={saving || !customName.trim()}
                      className="flex-1 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
                    >
                      {saving ? 'Adding...' : 'Add Brand'}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Button to add custom brand - TAMBAH INI */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustom(true);
                      setError(null);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50 transition-colors group bg-white border-b border-gray-100"
                  >
                    <div className="w-9 h-9 rounded-lg border border-dashed border-blue-300 bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Plus size={16} className="text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                        Tambah Brand Baru
                      </p>
                      <p className="text-xs text-gray-400">
                        Buat brand custom baru
                      </p>
                    </div>
                  </button>




                {available.map((brand) => (
                  <button
                    key={brand.name}
                    type="button"
                    onClick={() => {
                      onSelect(brand);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50 transition-colors group bg-white"
                  >
                    {brand.logo && (
                      <div className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
                        <Image src={brand.logo} alt={brand.name} className="w-7 h-7 object-contain" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 group-hover:text-blue-700 truncate">{brand.name}</p>
                    </div>
                    <Plus size={14} className="text-gray-300 group-hover:text-blue-500 flex-shrink-0" />
                  </button>
                ))}
                {available.length === 0 && (
                  <div className="px-4 py-3 text-sm text-gray-400 text-center bg-white">Semua brand sudah ditambahkan</div>
                )}
              </>
            )}
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</div>
);
}



function SolutionPicker({ currentSolutions, onSelect}) {
  const [open, setOpen] = useState(false);
  const [allSolutions, setAllSolutions] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const fetchSolutions = async () => {
    if (allSolutions.length > 0) return; // Sudah di-fetch
    setLoading(true);
    try {
      const res = await fetch('/api/solutions');
      const data = await res.json();
      if (data.success) {
        setAllSolutions(data.solutions);
      }
    } catch (error) {
      console.error('Failed to fetch solutions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter solutions yang SUDAH ada di current brand
  const currentSlugs = new Set(
    (currentSolutions || []).map((s) => s?.slug).filter(Boolean)
  );
  const available = allSolutions.filter((s) => !currentSlugs.has(s.slug));

  const handleOpen = () => {
    setOpen(!open);
    if (!open) {
      fetchSolutions();
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleOpen}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-gray-300 text-gray-400 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all text-sm w-full justify-center"
      >
        <Plus size={14} />
        Add Item
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-2 border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
              <div className="max-h-64 overflow-y-auto divide-y divide-gray-100">
                {available.map((solution) => (
                  <button
                    key={solution.slug}
                    type="button"
                    onClick={() => onSelect({ name: solution.name, slug: solution.slug })}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50 transition-colors group bg-white"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 group-hover:text-blue-700 truncate">
                        {solution.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{solution.slug}</p>
                    </div>
                    <Plus size={14} className="text-gray-300 group-hover:text-blue-500 flex-shrink-0" />
                  </button>
                ))}
                {available.length === 0 && (
                  <div className="px-4 py-3 text-sm text-gray-400 text-center bg-white">
                    Semua solution sudah ditambahkan
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── JsonEditor ───────────────────────────────────────────────────────────────

function JsonEditor({
  data,
  path,
  activePage,
  onChange,
  onAddItem,
  onRemoveItem,
  onDuplicateItem,
  onMoveItem,
  onUpload,
  onAddBrand,
  onAddSolution,
  onAddService,
  onAddNews,
  onAddMasterListItems,
  readOnlyPaths = [],
  fieldKey,
  depth = 0,
  allData,
}) {
  const readOnly = isReadOnlyPath(path, readOnlyPaths);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  if (data === null || data === undefined) return null;

  // ── String fields ──────────────────────────────────────────────────────────
  if (typeof data === 'string') {
    const isLong = data.length > 100;
    const fieldType = detectFieldType(fieldKey || '', data, path);
    const isImageType = fieldType === 'image';
    const isPreviewableType = fieldType === 'image' || fieldType === 'html' || fieldType === 'iframe';
    const showPreview = isPreviewableType;
    const showUploader = !readOnly && isImageType && typeof onUpload === 'function';

    async function handleFileChange(e) {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        await onUpload(path, file);
        setUploadError('');
      } catch (error) {
        setUploadError(error.message || 'Upload failed');
      } finally {
        e.target.value = '';
      }
    }

    // Determine which input to render based on fieldType
    let inputElement;

    if (isLong || isImageType || fieldType === 'html' || fieldType === 'iframe') {
      // Long text / image path → textarea or existing image UI
      inputElement = (
        <div className="space-y-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex-1 min-w-0">
              <textarea
                value={data}
                onChange={readOnly ? undefined : (e) => onChange(path, e.target.value)}
                rows={isImageType ? 1 : 3}
                readOnly={readOnly}
                className={`w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-black text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-y font-mono ${readOnly ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`}
              />
            </div>
            {showUploader && (
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:text-blue-600 hover:border-blue-400 transition-colors text-xs uppercase tracking-wider disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </button>
              </div>
            )}
          </div>

          {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}
          
          {showPreview && data && (
            <SafePreview
              kind={fieldType}
              value={data}
              title={fieldKey || path || 'Preview'}
            />
          )}
        </div>
      );
    } else if (fieldType === 'url') {
      const meta = FIELD_TYPE_META.url;
      const Icon = meta.icon;
      inputElement = (
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none" />
            <input
              type="url"
              value={data}
              onChange={readOnly ? undefined : (e) => onChange(path, e.target.value)}
              readOnly={readOnly}
              placeholder="https://..."
              className={`w-full bg-gray-50 border border-gray-300 rounded-lg pl-8 pr-3 py-2 text-black text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono ${readOnly ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`}
            />
          </div>
          {data && (
            <a
              href={data}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors flex-shrink-0"
              title="Buka URL"
            >
              <LogOut size={13} />
            </a>
          )}
        </div>
      );
    } else if (fieldType === 'date') {
      const meta = FIELD_TYPE_META.date;
      const Icon = meta.icon;
      inputElement = (
        <div className="relative">
          <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 pointer-events-none" />
          <input
            type="date"
            value={data}
            onChange={readOnly ? undefined : (e) => onChange(path, e.target.value)}
            readOnly={readOnly}
            className={`w-full bg-gray-50 border border-gray-300 rounded-lg pl-8 pr-3 py-2 text-black text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-mono ${readOnly ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`}
          />
        </div>
      );
    } else if (fieldType === 'phone') {
      const meta = FIELD_TYPE_META.phone;
      const Icon = meta.icon;
      inputElement = (
        <div className="relative">
          <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400 pointer-events-none" />
          <input
            type="tel"
            value={data}
            onChange={readOnly ? undefined : (e) => onChange(path, e.target.value)}
            readOnly={readOnly}
            className={`w-full bg-gray-50 border border-gray-300 rounded-lg pl-8 pr-3 py-2 text-black text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 font-mono ${readOnly ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`}
          />
        </div>
      );
    } else if (fieldType === 'email') {
      const meta = FIELD_TYPE_META.email;
      const Icon = meta.icon;
      inputElement = (
        <div className="relative">
          <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400 pointer-events-none" />
          <input
            type="email"
            value={data}
            onChange={readOnly ? undefined : (e) => onChange(path, e.target.value)}
            readOnly={readOnly}
            className={`w-full bg-gray-50 border border-gray-300 rounded-lg pl-8 pr-3 py-2 text-black text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono ${readOnly ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`}
          />
        </div>
      );
    } else if (fieldType === 'category') {
      inputElement = (
        <CategoryCombobox
          value={data}
          onChange={(val) => onChange(path, val)}
          allData={allData}
          readOnly={readOnly}
        />
      );
    } else if (fieldType === 'icon') {
      inputElement = (
        <IconPicker
          value={data}
          onChange={(val) => onChange(path, val)}
          label={fieldKey || 'Icon'}
        />
      );
    } else {
      // Default text
      inputElement = (
        <input
          type="text"
          value={data}
          onChange={readOnly ? undefined : (e) => onChange(path, e.target.value)}
          readOnly={readOnly}
          className={`w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-black text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono ${readOnly ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`}
        />
      );
    }

    return <div>{inputElement}</div>;
  }

  // ── Number fields ──────────────────────────────────────────────────────────
  if (typeof data === 'number') {
    return (
      <div className="relative">
        <Hash size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="number"
          value={data}
          onChange={readOnly ? undefined : (e) => onChange(path, Number(e.target.value))}
          readOnly={readOnly}
          className={`w-32 bg-gray-50 border border-gray-300 rounded-lg pl-8 pr-3 py-2 text-black text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono ${readOnly ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`}
        />
      </div>
    );
  }

  // ── Boolean fields ─────────────────────────────────────────────────────────
  if (typeof data === 'boolean') {
    return (
      <button
        onClick={readOnly ? undefined : () => onChange(path, !data)}
        disabled={readOnly}
        className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
          data
            ? 'bg-green-100 text-green-700 border border-green-300 hover:bg-green-200'
            : 'bg-gray-100 text-gray-500 border border-gray-300 hover:bg-gray-200'
        } ${readOnly ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span className={`w-3 h-3 rounded-full transition-colors ${data ? 'bg-green-500' : 'bg-gray-400'}`} />
        {data ? 'Aktif' : 'Nonaktif'}
      </button>
    );
  }

  // ── Array fields ───────────────────────────────────────────────────────────
  if (Array.isArray(data)) {
    return (
      <div className="space-y-2">
        {data.map((item, i) => {
          const itemLabel = typeof item === 'object' && item
            ? item?._ref?.match?.name || item?._ref?.match?.slug || item.title || item.label || item.name || item.slug || item.year || ''
            : typeof item === 'string' ? item.substring(0, 50) : '';
          const baseLabel = getArrayItemBaseLabel(path);
          const displayLabel = baseLabel ? `${baseLabel} ${i + 1}` : `[${i}]`;
          const isSingleItemArray = isSingleItemArrayPath(path);
          const isOfferingsItem = isHomepageOfferingsItemsPath(path);

          return (
            <div key={i} className="relative group/item">
              <CollapsibleSection
                label={`${displayLabel}${itemLabel ? ` — ${itemLabel}` : ''}`}
                depth={depth}
                actions={!readOnly ? (
                  <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); onMoveItem(path, i, -1); }}
                      disabled={i === 0}
                      className="p-1 hover:bg-gray-100 rounded disabled:opacity-20 text-gray-400 hover:text-gray-700"
                      title="Move up"
                    >
                      <ArrowUp size={12} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onMoveItem(path, i, 1); }}
                      disabled={i === data.length - 1}
                      className="p-1 hover:bg-gray-100 rounded disabled:opacity-20 text-gray-400 hover:text-gray-700"
                      title="Move down"
                    >
                      <ArrowDown size={12} />
                    </button>
                    {!isSingleItemArray && !isOfferingsItem && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onDuplicateItem(path, i); }}
                        className="p-1 hover:bg-blue-50 rounded text-gray-400 hover:text-blue-600"
                        title="Duplicate"
                      >
                        <Copy size={12} />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const label = itemLabel || `${displayLabel}`;
                        onRemoveItem(path, i, label);
                      }}
                      className="p-1 hover:bg-red-50 rounded text-gray-400 hover:text-red-500"
                      title="Remove"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-[0.625rem] uppercase tracking-wider text-gray-500">
                    <Lock size={10} />
                    Read-only
                  </span>
                )}
              >
                {isOfferingsItem ? (
                  <div className="space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600">
                    <div><span className="font-medium text-gray-800">Source:</span> {item?._ref?.source || '-'}</div>
                    <div><span className="font-medium text-gray-800">Path:</span> {item?._ref?.path || '-'}</div>
                    <div>
                      <span className="font-medium text-gray-800">Match:</span>{' '}
                      {JSON.stringify(item?._ref?.match || {})}
                    </div>
                    <div>
                      <span className="font-medium text-gray-800">Fields:</span>{' '}
                      {(item?._ref?.displayFields || []).join(', ') || '-'}
                    </div>
                  </div>
                ) : (
                  <JsonEditor
                    data={item}
                    path={path ? `${path}.${i}` : `${i}`}
                    activePage={activePage}
                    onChange={onChange}
                    onAddItem={onAddItem}
                    onRemoveItem={onRemoveItem}
                    onDuplicateItem={onDuplicateItem}
                    onMoveItem={onMoveItem}
                    onUpload={onUpload}
                    onAddBrand={onAddBrand}
                    onAddSolution={onAddSolution}
                    onAddService={onAddService}
                    onAddNews={onAddNews}
                    onAddMasterListItems={onAddMasterListItems}
                    readOnlyPaths={readOnlyPaths}
                    depth={depth + 1}
                    allData={allData || data}
                  />
                )}
              </CollapsibleSection>
            </div>
          );
        })}
        {!readOnly && !isSingleItemArrayPath(path) && (() => {
          const isBrandsArray = /\.brands$|^brands$/.test(path);
          const isSolutionsArray = /\.solutions$|^solutions$/.test(path);
          const isServicesArray = /\.services$|^services$/i.test(path);
          const isNewsArray = /news\.items$|^news\.items$/i.test(path);
          const masterListConfig = activePage === 'homepage' ? getHomepageMasterListConfig(allData, path) : null;

          if (masterListConfig) {
            return (
              <MasterListPicker
                source={masterListConfig.source}
                path={masterListConfig.sourcePath}
                displayField={masterListConfig.displayField}
                matchField={masterListConfig.matchField}
                currentItems={data}
                placeholder={masterListConfig.placeholder}
                searchPlaceholder={masterListConfig.searchPlaceholder || 'Cari item yang ingin ditampilkan'}
                multiSelect
                maxSelections={masterListConfig.maxItems}
                onSelectMany={(items) => onAddMasterListItems(path, items)}
              />
            );
          }

          // Brands use the master list for existing items and a separate create-only flow for new brands.
          if (isBrandsArray && onAddBrand) {
            return (
              <div className="space-y-2">
                <MasterListPicker
                  source="products.json"
                  path="brands"
                  displayField="name"
                  matchField="slug"
                  onSelect={(brand) => onAddBrand(path, brand)}
                  currentItems={data}
                  placeholder="Pilih Brand dari Master List"
                />
                <BrandPicker
                  currentBrands={data}
                  onSelect={(brand) => onAddBrand(path, brand)}
                  createOnly
                />
              </div>
            );
          }



          

          // // For solutions array: using solution picker
          // if (isSolutionsArray && onAddSolution) {
          //   return (
          //     <MasterListPicker
          //       source="solution.json"
          //       path="solutions"
          //       displayField="name"
          //       matchField="slug"
          //       onSelect={(solution) => onAddSolution(path, solution)}
          //       currentItems={data}
          //       placeholder="Pilih Solution dari Master List"
          //     />
          //   );
          // }

          // // Services: Use MasterListPicker (NEW)
          // if (isServicesArray && onAddService) {
          //   return (
          //     <MasterListPicker
          //       source="solution.json"
          //       path="services"
          //       displayField="name"
          //       matchField="name"
          //       onSelect={(service) => onAddService(path, service)}
          //       currentItems={data}
          //       placeholder="Pilih Service dari Master List"
          //     />
          //   );
          // }

          // // News: Use MasterListPicker (NEW)
          // if (isNewsArray && onAddNews) {
          //   return (
          //     <MasterListPicker
          //       source="insight.json"
          //       path="news.items"
          //       displayField="title"
          //       matchField="slug"
          //       onSelect={(news) => onAddNews(path, news)}
          //       currentItems={data}
          //       placeholder="Pilih News dari Master List"
          //     />
          //   );
          // }

          // Default Add Item button for non-brands arrays
          return (
            <button onClick={() => onAddItem(path)}>Add Item</button>
          );
        })()}
      </div>
    );
  }

  // ── Object fields ──────────────────────────────────────────────────────────
  if (typeof data === 'object') {
    return (
      <div className="space-y-3">
        {Object.entries(data).map(([key, value]) => {
          const fieldPath = path ? `${path}.${key}` : key;
          const isSimple = typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
          const isFieldReadOnly = isReadOnlyPath(fieldPath, readOnlyPaths);
          const fieldType = typeof value === 'string'
            ? detectFieldType(key, value, fieldPath)
            : null;

          if (isSimple) {
            return (
              <div key={key} className="flex flex-col gap-1.5">
                <label className="text-black/70 text-xs font-medium uppercase tracking-wider flex items-center gap-1.5">
                  <Edit3 size={10} />
                  {key}
                  {fieldType && <FieldTypeBadge type={fieldType} />}
                  {isFieldReadOnly && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-[0.6rem] uppercase tracking-wider text-gray-500">
                      <Lock size={10} />
                      Read-only
                    </span>
                  )}
                </label>
                <JsonEditor
                  data={value}
                  path={fieldPath}
                  activePage={activePage}
                  onChange={onChange}
                  onAddItem={onAddItem}
                  onRemoveItem={onRemoveItem}
                  onDuplicateItem={onDuplicateItem}
                  onMoveItem={onMoveItem}
                  onUpload={onUpload}
                  onAddBrand={onAddBrand}
                  onAddSolution={onAddSolution}
                  onAddService={onAddService}
                  onAddNews={onAddNews}
                  onAddMasterListItems={onAddMasterListItems}
                  readOnlyPaths={readOnlyPaths}
                  fieldKey={key}
                  depth={depth + 1}
                  allData={allData}
                />
              </div>
            );
          }

          return (
            <CollapsibleSection key={key} label={key} depth={depth} readOnly={isFieldReadOnly}>
              <JsonEditor
                data={value}
                path={fieldPath}
                activePage={activePage}
                onChange={onChange}
                onAddItem={onAddItem}
                onRemoveItem={onRemoveItem}
                onDuplicateItem={onDuplicateItem}
                onMoveItem={onMoveItem}
                onUpload={onUpload}
                onAddBrand={onAddBrand}
                onAddSolution={onAddSolution}
                onAddService={onAddService}
                onAddNews={onAddNews}
                onAddMasterListItems={onAddMasterListItems}
                readOnlyPaths={readOnlyPaths}
                fieldKey={key}
                depth={depth + 1}
                allData={allData}
              />
            </CollapsibleSection>
          );
        })}
      </div>
    );
  }

  return <span className="text-gray-400 text-sm">unsupported type</span>;
}

// ─── CollapsibleSection ───────────────────────────────────────────────────────

function CollapsibleSection({ label, children, depth = 0, actions, readOnly = false }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden ${depth > 0 ? 'ml-0' : ''}`}>
      <div className="w-full flex items-center gap-2 bg-gray-50 hover:bg-gray-100 transition-colors">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex min-w-0 flex-1 items-center gap-2 px-4 py-2.5 text-left"
        >
          <motion.div animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronRight className="text-blue-600" size={14} />
          </motion.div>
          <span className="text-black text-sm font-medium flex-1 capitalize">{label}</span>
        </button>
        {readOnly && !actions && (
          <span className="mr-4 inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-[0.625rem] uppercase tracking-wider text-gray-500">
            <Lock size={10} />
            Read-only
          </span>
        )}
        {actions && <div className="pr-4">{actions}</div>}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 border-t border-gray-200 bg-white">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
