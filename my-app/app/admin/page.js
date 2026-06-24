'use client';
import { useState, useEffect, useRef } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  Home, Info, Layers, Package, Calendar, Globe,
  Save, ChevronRight, Edit3, Check, X,
  Menu, LogOut, Plus, Trash2, Copy, ArrowUp, ArrowDown,
  Lock, BookOpen, History, RotateCcw, Eye, AlertTriangle,
  Link, Mail, Phone, Hash, Calendar as CalendarIcon, Tag,
  ChevronDown,
} from 'lucide-react';

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

// ─── Field type detection ────────────────────────────────────────────────────

const URL_KEY_REGEX = /^(href|link|url|mapLink|mapEmbedUrl|src|website)$/i;
const DATE_KEY_REGEX = /^(date|publishedAt|createdAt|updatedAt|eventDate|startDate|endDate)$/i;
const PHONE_KEY_REGEX = /^(phone|fax|whatsapp|mobile|telephone)$/i;
const EMAIL_KEY_REGEX = /^(email|mail)$/i;
const CATEGORY_KEY_REGEX = /^(category|type|status|platform)$/i;

function detectFieldType(key = '', value = '', path = '') {
  if (IMAGE_KEY_REGEX.test(key)) return 'image';
  if (path && /(^|\.)images?\b/i.test(path)) return 'image';
  if (path && /(^|\.)logos?\b/i.test(path)) return 'image';
  if (typeof value === 'string' && /(\/uploads\/|\/images\/|\.png$|\.jpg$|\.jpeg$|\.webp$)/i.test(value) && value.length < 200) return 'image';


  if (URL_KEY_REGEX.test(key)) return 'url';
  if (typeof value === 'string' && /^https?:\/\//i.test(value) && !IMAGE_KEY_REGEX.test(key)) return 'url';

  if (DATE_KEY_REGEX.test(key)) return 'date';
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return 'date';

  if (PHONE_KEY_REGEX.test(key)) return 'phone';
  if (EMAIL_KEY_REGEX.test(key)) return 'email';
  if (CATEGORY_KEY_REGEX.test(key)) return 'category';

  return 'text';
}

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

function HistoryPanel({ open, onClose, file, adminKey, onRestored }) {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(null);
  const [restoreConfirm, setRestoreConfirm] = useState(null);

  useEffect(() => {
    if (!open || !file) return;
    setLoading(true);
    fetch(`/api/backups?file=${file}`, { headers: { 'x-admin-key': adminKey } })
      .then((r) => r.json())
      .then((json) => setBackups(json.backups || []))
      .catch(() => setBackups([]))
      .finally(() => setLoading(false));
  }, [open, file, adminKey]);

  async function handleRestore(backup) {
    setRestoring(backup.filename);
    try {
      const res = await fetch('/api/backups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
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
  const [error, setError] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch('/api/content?file=global', {
      headers: { 'x-admin-key': password },
    });
    if (res.ok) {
      sessionStorage.setItem('admin-key', password);
      onLogin(password);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
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
          <p className="text-gray-500 text-sm text-center mb-6">Enter admin password to continue</p>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              autoFocus
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 mb-4"
            />
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-xs mb-3"
              >
                Invalid password
              </motion.p>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-sm font-medium transition-colors"
            >
              Sign In
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Admin Page ───────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState(null);
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

  useEffect(() => {
    const stored = sessionStorage.getItem('admin-key');
    if (stored) setAdminKey(stored);
  }, []);

  useEffect(() => {
    if (adminKey) loadData(activePage);
  }, [activePage, adminKey]);

  async function loadData(page) {
    setLoading(true);
    setHistoryOpen(false);
    const res = await fetch(`/api/content?file=${page}`, {
      headers: { 'x-admin-key': adminKey },
    });
    if (res.ok) {
      const json = await res.json();
      setData(json);
      setOriginalData(JSON.parse(JSON.stringify(json)));
    }
    setLoading(false);
  }

  async function doSave() {
    setSaving(true);
    const res = await fetch(`/api/content?file=${activePage}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const saved_data = await res.json();
      setOriginalData(JSON.parse(JSON.stringify(data)));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
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
      headers: { 'x-admin-key': adminKey },
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error?.error || 'Upload failed');
    }

    const json = await res.json();
    if (json?.url) updateField(path, json.url);
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

  if (!adminKey) return <LoginScreen onLogin={setAdminKey} />;

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
            onClick={() => { sessionStorage.removeItem('admin-key'); setAdminKey(null); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500/70 hover:text-red-600 hover:bg-red-50 transition-all"
          >
            <Lock size={18} />
            {sidebarOpen && <span>Logout</span>}
          </button>
          <a
            href="/"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all"
          >
            <LogOut size={18} />
            {sidebarOpen && <span>View Site</span>}
          </a>
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
                onChange={updateField}
                onAddItem={addArrayItem}
                onRemoveItem={requestRemoveArrayItem}
                onDuplicateItem={duplicateArrayItem}
                onMoveItem={moveArrayItem}
                onUpload={handleUpload}
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
        adminKey={adminKey}
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

// ─── JsonEditor ───────────────────────────────────────────────────────────────

function JsonEditor({
  data,
  path,
  onChange,
  onAddItem,
  onRemoveItem,
  onDuplicateItem,
  onMoveItem,
  onUpload,
  readOnlyPaths = [],
  fieldKey,
  depth = 0,
  allData,
}) {
  if (data === null || data === undefined) return null;

  const readOnly = isReadOnlyPath(path, readOnlyPaths);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  // ── String fields ──────────────────────────────────────────────────────────
  if (typeof data === 'string') {
    const isLong = data.length > 100;
    const fieldType = detectFieldType(fieldKey || '', data, path);
    const isImageType = fieldType === 'image';
    const showPreview = isImageType;
    const showUploader = !readOnly && showPreview && typeof onUpload === 'function';

    async function handleFileChange(e) {
      const file = e.target.files?.[0];
      if (!file) return;
      if (!IMAGE_MIME_TYPES.includes(file.type)) {
        setUploadError('Only PNG/JPG images are allowed.');
        e.target.value = '';
        return;
      }
      if (file.size > UPLOAD_MAX_BYTES) {
        setUploadError('File is too large. Max 10MB.');
        e.target.value = '';
        return;
      }
      setUploadError('');
      setUploading(true);
      try {
        await onUpload(path, file);
      } catch (error) {
        setUploadError(error?.message || 'Upload failed.');
      } finally {
        setUploading(false);
        e.target.value = '';
      }
    }

    // Determine which input to render based on fieldType
    let inputElement;

    if (isLong || isImageType) {
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
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
              <img src={data} alt="Preview" className="max-h-40 w-auto rounded" />
            </div>
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
            ? item.title || item.label || item.name || item.slug || item.year || ''
            : typeof item === 'string' ? item.substring(0, 50) : '';
          const baseLabel = getArrayItemBaseLabel(path);
          const displayLabel = baseLabel ? `${baseLabel} ${i + 1}` : `[${i}]`;
          const isSingleItemArray = isSingleItemArrayPath(path);

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
                    {!isSingleItemArray && (
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
                <JsonEditor
                  data={item}
                  path={path ? `${path}.${i}` : `${i}`}
                  onChange={onChange}
                  onAddItem={onAddItem}
                  onRemoveItem={onRemoveItem}
                  onDuplicateItem={onDuplicateItem}
                  onMoveItem={onMoveItem}
                  onUpload={onUpload}
                  readOnlyPaths={readOnlyPaths}
                  depth={depth + 1}
                  allData={allData}
                />
              </CollapsibleSection>
            </div>
          );
        })}
        {!readOnly && !isSingleItemArrayPath(path) && (
          <button
            onClick={() => onAddItem(path)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-gray-300 text-gray-400 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all text-sm w-full justify-center"
          >
            <Plus size={14} />
            Add Item
          </button>
        )}
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
                  onChange={onChange}
                  onAddItem={onAddItem}
                  onRemoveItem={onRemoveItem}
                  onDuplicateItem={onDuplicateItem}
                  onMoveItem={onMoveItem}
                  onUpload={onUpload}
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
                onChange={onChange}
                onAddItem={onAddItem}
                onRemoveItem={onRemoveItem}
                onDuplicateItem={onDuplicateItem}
                onMoveItem={onMoveItem}
                onUpload={onUpload}
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
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <motion.div animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronRight className="text-blue-600" size={14} />
        </motion.div>
        <span className="text-black text-sm font-medium flex-1 capitalize">{label}</span>
        {readOnly && !actions && (
          <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-[0.625rem] uppercase tracking-wider text-gray-500">
            <Lock size={10} />
            Read-only
          </span>
        )}
        {actions}
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
            <div className="p-4 border-t border-gray-200 bg-white">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
