'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/20 flex items-center justify-center">
              <Lock className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <h1 className="text-white text-xl font-bold text-center mb-1">AMI Admin</h1>
          <p className="text-white/30 text-sm text-center mb-6">Enter admin password to continue</p>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500 mb-4"
            />
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-xs mb-3"
              >
                Invalid password
              </motion.p>
            )}
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-lg text-sm font-medium transition-colors"
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
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 260 : 72 }}
        className="bg-indigo-950/80 border-r border-white/5 flex flex-col fixed top-0 left-0 h-full z-50"
      >
        <div className="p-4 border-b border-white/5 flex items-center gap-3">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Menu className="text-white" size={20} />
          </button>
          {sidebarOpen && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-white font-bold text-sm"
            >
              AMI Admin
            </motion.span>
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
                    ? 'bg-purple-600/30 text-purple-300'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={18} />
                {sidebarOpen && <span>{page.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/5 space-y-1">
          <button
            onClick={() => { sessionStorage.removeItem('admin-key'); setAdminKey(null); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <Lock size={18} />
            {sidebarOpen && <span>Logout</span>}
          </button>
          <a
            href="/"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all"
          >
            <LogOut size={18} />
            {sidebarOpen && <span>View Site</span>}
          </a>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all ${sidebarOpen ? 'ml-[260px]' : 'ml-[72px]'}`}>
        {/* Header */}
        <header className="sticky top-0 z-40 bg-gray-950/90 backdrop-blur-xl border-b border-white/5 px-6 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-white font-semibold text-lg">
              {PAGES.find((p) => p.key === activePage)?.label}
            </h1>
            <p className="text-white/30 text-xs">Edit content for this page</p>
          </div>

          <div className="flex items-center gap-3">
            {saved && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1 text-green-400 text-sm"
              >
                <Check size={16} />
                Saved &amp; Revalidated!
              </motion.div>
            )}
            <button
              onClick={handleSave}
              disabled={saving || !data}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
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
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
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

function JsonEditor({ data, path, onChange, onAddItem, onRemoveItem, onDuplicateItem, onMoveItem, depth = 0 }) {
  if (data === null || data === undefined) return null;

  if (typeof data === 'string') {
    const isLong = data.length > 100;
    return isLong ? (
      <textarea
        value={data}
        onChange={(e) => onChange(path, e.target.value)}
        rows={3}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500 resize-y font-mono"
      />
    ) : (
      <input
        type="text"
        value={data}
        onChange={(e) => onChange(path, e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500 font-mono"
      />
    );
  }

  if (typeof data === 'number') {
    return (
      <input
        type="number"
        value={data}
        onChange={(e) => onChange(path, Number(e.target.value))}
        className="w-32 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500 font-mono"
      />
    );
  }

  if (typeof data === 'boolean') {
    return (
      <button
        onClick={() => onChange(path, !data)}
        className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
          data ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}
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

          return (
            <div key={i} className="relative group/item">
              <CollapsibleSection
                label={`[${i}]${itemLabel ? ` — ${itemLabel}` : ''}`}
                depth={depth}
                actions={
                  <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); onMoveItem(path, i, -1); }}
                      disabled={i === 0}
                      className="p-1 hover:bg-white/10 rounded disabled:opacity-20 text-white/40 hover:text-white"
                      title="Move up"
                    >
                      <ArrowUp size={12} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onMoveItem(path, i, 1); }}
                      disabled={i === data.length - 1}
                      className="p-1 hover:bg-white/10 rounded disabled:opacity-20 text-white/40 hover:text-white"
                      title="Move down"
                    >
                      <ArrowDown size={12} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDuplicateItem(path, i); }}
                      className="p-1 hover:bg-blue-500/20 rounded text-white/40 hover:text-blue-400"
                      title="Duplicate"
                    >
                      <Copy size={12} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); if (confirm('Remove this item?')) onRemoveItem(path, i); }}
                      className="p-1 hover:bg-red-500/20 rounded text-white/40 hover:text-red-400"
                      title="Remove"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                }
              >
                <JsonEditor
                  data={item}
                  path={path ? `${path}.${i}` : `${i}`}
                  onChange={onChange}
                  onAddItem={onAddItem}
                  onRemoveItem={onRemoveItem}
                  onDuplicateItem={onDuplicateItem}
                  onMoveItem={onMoveItem}
                  depth={depth + 1}
                />
              </CollapsibleSection>
            </div>
          );
        })}
        <button
          onClick={() => onAddItem(path)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-white/10 text-white/30 hover:text-purple-400 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all text-sm w-full justify-center"
        >
          <Plus size={14} />
          Add Item
        </button>
      </div>
    );
  }

  if (typeof data === 'object') {
    return (
      <div className="space-y-3">
        {Object.entries(data).map(([key, value]) => {
          const fieldPath = path ? `${path}.${key}` : key;
          const isSimple = typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';

          if (isSimple) {
            return (
              <div key={key} className="flex flex-col gap-1.5">
                <label className="text-white/40 text-xs font-medium uppercase tracking-wider flex items-center gap-1.5">
                  <Edit3 size={10} />
                  {key}
                </label>
                <JsonEditor
                  data={value}
                  path={fieldPath}
                  onChange={onChange}
                  onAddItem={onAddItem}
                  onRemoveItem={onRemoveItem}
                  onDuplicateItem={onDuplicateItem}
                  onMoveItem={onMoveItem}
                  depth={depth + 1}
                />
              </div>
            );
          }

          return (
            <CollapsibleSection key={key} label={key} depth={depth}>
              <JsonEditor
                data={value}
                path={fieldPath}
                onChange={onChange}
                onAddItem={onAddItem}
                onRemoveItem={onRemoveItem}
                onDuplicateItem={onDuplicateItem}
                onMoveItem={onMoveItem}
                depth={depth + 1}
              />
            </CollapsibleSection>
          );
        })}
      </div>
    );
  }

  return <span className="text-white/30 text-sm">unsupported type</span>;
}

function CollapsibleSection({ label, children, depth = 0, actions }) {
  const [open, setOpen] = useState(depth < 1);

  return (
    <div className={`border border-white/5 rounded-lg overflow-hidden ${depth > 0 ? 'ml-0' : ''}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-4 py-2.5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors text-left"
      >
        <motion.div animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronRight className="text-purple-400" size={14} />
        </motion.div>
        <span className="text-white/70 text-sm font-medium flex-1">{label}</span>
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
            <div className="p-4 border-t border-white/5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
