'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  Home, Info, Layers, Package, Calendar, Globe, 
  Save, ChevronRight, ChevronDown, Edit3, Check, X,
  Menu, LogOut, Settings, Plus, Trash2, Copy, ArrowUp, ArrowDown,
  Lock, BookOpen
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

function isReadOnlyPath(path, readOnlyPaths = []) {
  if (!path) return false;
  return readOnlyPaths.some((blocked) => path === blocked || path.startsWith(`${blocked}.`));
}

function isImageKey(key = '') {
  return IMAGE_KEY_REGEX.test(key);
}

function looksLikeImagePath(value = '') {
  return /(\/uploads\/|\/images\/|\.png$|\.jpg$|\.jpeg$|\.webp$)/i.test(value);
}

function isImageField(path, key, value) {
  if (isImageKey(key)) return true;
  if (path && /(^|\.)images?\b/i.test(path)) return true;
  if (path && /(^|\.)logos?\b/i.test(path)) return true;
  return looksLikeImagePath(value);
}

const ARRAY_LABEL_OVERRIDES = {
  items: 'Item',
  testimonials: 'Testimonial',
  news: 'News',
  programs: 'Program',
  events: 'Event',
  solutions: 'Solution',
  services: 'Service',
  brands: 'Brand',
  images: 'Image',
  positions: 'Position',
  points: 'Point',
  milestones: 'Milestone',
  socials: 'Social',
  tabs: 'Tab',
  features: 'Feature',
};

const SINGLE_ITEM_ARRAY_PATHS = [
  /^programs\.items\.\d+\.images$/,
];

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
  const rawKey = (ARRAY_LABEL_OVERRIDES[last] && last !== 'items')
    ? last
    : fallbackKey;
  const override = ARRAY_LABEL_OVERRIDES[rawKey];
  if (override) return override;
  return singularize(toTitleCase(rawKey));
}

function isSingleItemArrayPath(path = '') {
  return SINGLE_ITEM_ARRAY_PATHS.some((pattern) => pattern.test(path));
}

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

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState(null);
  const [activePage, setActivePage] = useState('homepage');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem('admin-key');
    if (stored) setAdminKey(stored);
  }, []); 

  useEffect(() => {
    if (adminKey) loadData(activePage);
  }, [activePage, adminKey]);

  async function loadData(page) {
    setLoading(true);
    const res = await fetch(`/api/content?file=${page}`, {
      headers: { 'x-admin-key': adminKey },
    });
    if (res.ok) {
      const json = await res.json();
      setData(json);
    }
    setLoading(false);
  }

  async function handleSave() {
    setSaving(true);
    const res = await fetch(`/api/content?file=${activePage}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
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

  function removeArrayItem(path, index) {
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
                Saved &amp; Revalidated!
              </motion.div>
            )}
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
                onRemoveItem={removeArrayItem}
                onDuplicateItem={duplicateArrayItem}
                onMoveItem={moveArrayItem}
                onUpload={handleUpload}
                readOnlyPaths={READ_ONLY_MAP[activePage]}
              />
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}

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
}) {
  if (data === null || data === undefined) return null;

  const readOnly = isReadOnlyPath(path, readOnlyPaths);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  if (typeof data === 'string') {
    const isLong = data.length > 100;
    const showPreview = isImageField(path, fieldKey, data);
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

    const inputField = isLong ? (
      <textarea
        value={data}
        onChange={readOnly ? undefined : (e) => onChange(path, e.target.value)}
        rows={3}
        readOnly={readOnly}
        className={`w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-black text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-y font-mono ${readOnly ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`}
      />
    ) : (
      <input
        type="text"
        value={data}
        onChange={readOnly ? undefined : (e) => onChange(path, e.target.value)}
        readOnly={readOnly}
        className={`w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-black text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono ${readOnly ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`}
      />
    );

    return isLong ? (
      <div className="space-y-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex-1 min-w-0">{inputField}</div>
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
    ) : (
      <div className="space-y-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex-1 min-w-0">{inputField}</div>
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
  }

  if (typeof data === 'number') {
    return (
      <input
        type="number"
        value={data}
        onChange={readOnly ? undefined : (e) => onChange(path, Number(e.target.value))}
        readOnly={readOnly}
        className={`w-32 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-black text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono ${readOnly ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`}
      />
    );
  }

  if (typeof data === 'boolean') {
    return (
      <button
        onClick={readOnly ? undefined : () => onChange(path, !data)}
        disabled={readOnly}
        className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
          data ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'
        } ${readOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {data ? 'true' : 'false'}
      </button>
    );
  }

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
                      onClick={(e) => { e.stopPropagation(); if (confirm('Remove this item?')) onRemoveItem(path, i); }}
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

  if (typeof data === 'object') {
    return (
      <div className="space-y-3">
        {Object.entries(data).map(([key, value]) => {
          const fieldPath = path ? `${path}.${key}` : key;
          const isSimple = typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
          const isFieldReadOnly = isReadOnlyPath(fieldPath, readOnlyPaths);

          if (isSimple) {
            return (
              <div key={key} className="flex flex-col gap-1.5">
                <label className="text-black/70 text-xs font-medium uppercase tracking-wider flex items-center gap-1.5">
                  <Edit3 size={10} />
                  {key}
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
              />
            </CollapsibleSection>
          );
        })}
      </div>
    );
  }

  return <span className="text-gray-400 text-sm">unsupported type</span>;
}

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
