import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const dataInitDir = path.join(process.cwd(), 'data-init');
const backupsRoot = path.join(dataDir, 'backups');

const MAX_BACKUPS = 10;

// ─── Core read/write ────────────────────────────────────────────────────────
let initialized = false;

function initDataDir() {
  if(initialized) return;
  initialized = true;

  //only run when dataDir is empty
  if (!fs.existsSync(dataDir) || fs.readdirSync(dataDir).length > 0) return;
  if(!fs.existsSync(dataInitDir)) return;

  const files = fs.readdirSync(dataInitDir).filter((f) => f.endsWith('.json'));
  for (const file of files) {
    fs.copyFileSync(path.join(dataInitDir, file), path.join(dataDir, file));
  }

  // Also copy seed uploads
  const uploadsInit = path.join(dataInitDir, 'uploads');
  if (fs.existsSync(uploadsInit)) {
    const uploadsDest = path.join(dataDir, 'uploads');
    fs.mkdirSync(uploadsDest, { recursive: true });
    const uploadFiles = fs.readdirSync(uploadsInit);
    for (const file of uploadFiles) {
      fs.copyFileSync(path.join(uploadsInit, file), path.join(uploadsDest, file));
    }
    console.log(`[content] Copied ${uploadFiles.length} seed uploads`);
  }

  console.log(`[content] Initialized data directory with ${files.length} files`);
}

// Migrate legacy uploads from public/uploads/ to data/uploads/
function migrateLegacyUploads() {
  const legacyDir = path.join(process.cwd(), 'public', 'uploads');
  const destDir = path.join(dataDir, 'uploads');

  if (!fs.existsSync(legacyDir)) return;
  if (fs.existsSync(destDir) && fs.readdirSync(destDir).length > 0) return;

  fs.mkdirSync(destDir, { recursive: true });
  const files = fs.readdirSync(legacyDir).filter((f) => !f.startsWith('.'));
  for (const file of files) {
    fs.copyFileSync(path.join(legacyDir, file), path.join(destDir, file));
  }
  if (files.length > 0) {
    console.log(`[content] Migrated ${files.length} legacy uploads from public/uploads/`);
  }
}

export function getContent(fileName) {
  initDataDir();
  migrateLegacyUploads();
  const filePath = path.join(dataDir, `${fileName}.json`);
  if (!fs.existsSync(filePath)) {
    return {};
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

export function updateContent(fileName, data) {
  const filePath = path.join(dataDir, `${fileName}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  return data;
}

export function updateSection(fileName, sectionKey, sectionData) {
  const content = getContent(fileName);
  content[sectionKey] = sectionData;
  return updateContent(fileName, content);
}

// ─── Backup / Rollback ───────────────────────────────────────────────────────

/**
 * Returns the directory where backups for a given file are stored.
 * Creates the directory synchronously if it does not exist.
 */
function getBackupDir(fileName) {
  const dir = path.join(backupsRoot, fileName);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

/**
 * Creates a timestamped backup of the current JSON file before overwriting it.
 * Returns the backup filename, or null if the source file does not exist yet.
 */
export function backupContent(fileName) {
  const sourcePath = path.join(dataDir, `${fileName}.json`);
  if (!fs.existsSync(sourcePath)) return null;

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupName = `${fileName}_${timestamp}.json`;
  const backupDir = getBackupDir(fileName);
  const backupPath = path.join(backupDir, backupName);

  fs.copyFileSync(sourcePath, backupPath);
  return backupName;
}

/**
 * Returns a list of backups for a file, sorted newest-first.
 * Each entry: { filename, timestamp, size }
 */
export function listBackups(fileName) {
  const backupDir = getBackupDir(fileName);
  const files = fs.readdirSync(backupDir)
    .filter((f) => f.endsWith('.json') && f.startsWith(`${fileName}_`));

  const entries = files.map((f) => {
    const stat = fs.statSync(path.join(backupDir, f));
    // Extract ISO timestamp from filename: <name>_<timestamp>.json
    const raw = f.slice(fileName.length + 1, -5); // strip "<name>_" prefix and ".json"
    // Convert back from safe filename format (dashes) to ISO: 2026-06-24T08-15-30-000Z
    const iso = raw
      .replace(/T(\d{2})-(\d{2})-(\d{2})-(\d+)Z/, 'T$1:$2:$3.$4Z');
    return {
      filename: f,
      timestamp: iso,
      size: stat.size,
    };
  });

  // Sort newest first
  entries.sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1));
  return entries;
}

/**
 * Restores a backup file to the active JSON.
 * Creates a backup of the current state first (safety net).
 */
export function restoreBackup(fileName, backupFilename) {
  const backupDir = getBackupDir(fileName);
  const backupPath = path.join(backupDir, backupFilename);

  if (!fs.existsSync(backupPath)) {
    throw new Error(`Backup not found: ${backupFilename}`);
  }

  // Safety: backup current state before restoring
  backupContent(fileName);

  const raw = fs.readFileSync(backupPath, 'utf-8');
  const data = JSON.parse(raw);
  updateContent(fileName, data);
  return data;
}

/**
 * Removes old backups so that only the `max` most recent are kept.
 */
export function purgeOldBackups(fileName, max = MAX_BACKUPS) {
  const backupDir = getBackupDir(fileName);
  const entries = listBackups(fileName); // already sorted newest-first

  if (entries.length <= max) return;

  const toDelete = entries.slice(max);
  for (const entry of toDelete) {
    try {
      fs.unlinkSync(path.join(backupDir, entry.filename));
    } catch {
      // ignore individual delete failures
    }
  }
}
