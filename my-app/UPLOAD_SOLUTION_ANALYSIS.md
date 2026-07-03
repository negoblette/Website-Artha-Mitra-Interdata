# Upload Path Solution Analysis

## Current Problem

Upload files are saved to `public/uploads/` but this directory is NOT mounted in Docker, so:
- Files saved inside container are lost on restart
- Host `public/uploads/` has old seed files only
- JSON references non-existent files

## Current Architecture

```
Upload Flow:
  POST /api/upload → Save to: public/uploads/[uuid].png
                   → Return URL: /uploads/[uuid].png

Serving Flow:
  GET /uploads/[uuid].png → app/uploads/[...path]/route.js
                          → Check data/uploads/ first
                          → Fallback to public/uploads/

Migration Flow:
  getContent() → migrateLegacyUploads()
              → Copy from public/uploads/ → data/uploads/
              → (Only if data/uploads/ is empty)
```

## Solution Options

### Option 1: Change Upload Destination to data/uploads/ (RECOMMENDED)

**Change:** Update `app/api/upload/route.js` to save to `data/uploads/` instead of `public/uploads/`

**Before:**
```javascript
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
```

**After:**
```javascript
const uploadsDir = path.join(process.cwd(), 'data', 'uploads');
```

**Impact Analysis:**

✅ **Pros:**
1. Files persist across Docker restarts (data/ is bind-mounted)
2. No need to mount public/ directory (simpler setup)
3. Serving route already checks data/uploads/ first
4. Migration function already exists for legacy files
5. Consistent with existing architecture

⚠️ **Cons:**
1. Existing files in public/uploads/ won't be migrated automatically
   - Mitigation: Migration function will handle this
2. Need to ensure data/uploads/ directory exists
   - Mitigation: Upload route already creates directory with `fs.mkdirSync(..., { recursive: true })`

**Files Affected:**
- `app/api/upload/route.js` - Change uploadsDir path
- No changes needed to:
  - `app/uploads/[...path]/route.js` (already checks data/uploads/ first)
  - `app/api/uploads/[...path]/route.js` (only checks data/uploads/)
  - `lib/content.js` (migration already handles public/ → data/)

---

### Option 2: Add Bind Mount for public/

**Change:** Update `docker-compose.yml` to mount `./public:/app/public`

**Before:**
```yaml
volumes:
  - ./data:/app/data
  - ./logs:/app/logs
```

**After:**
```yaml
volumes:
  - ./data:/app/data
  - ./logs:/app/logs
  - ./public:/app/public
```

**Impact Analysis:**

✅ **Pros:**
1. All public files sync between host and container
2. Static assets (images/principals) accessible
3. Upload files persist

⚠️ **Cons:**
1. **CRITICAL:** Overwrites container's /app/public with host's public/
   - Docker image's public/ (built at build time) is ignored
   - Static assets built into image won't be available
2. Need to rebuild image if public/ changes
3. More complex setup
4. Potential permission issues between host and container

**Files Affected:**
- `docker-compose.yml` - Add volume mount
- **CRITICAL ISSUE:** Public directory in Docker image (line 28 in Dockerfile) is overwritten

---

### Option 3: Use Docker Named Volume for Uploads

**Change:** Create separate named volume for uploads

**Before:**
```yaml
volumes:
  - ./data:/app/data
  - ./logs:/app/logs
```

**After:**
```yaml
volumes:
  - ./data:/app/data
  - ./logs:/app/logs
  - uploads-data:/app/public/uploads

volumes:
  uploads-data:
```

**Impact Analysis:**

✅ **Pros:**
1. Upload files persist in Docker-managed volume
2. Clean separation between data and uploads
3. No changes to upload code

⚠️ **Cons:**
1. **Files NOT accessible from host** (like current issue)
2. Need `docker cp` to access files
3. More complex Docker setup
4. Doesn't solve the original problem (user can't see files)

**Files Affected:**
- `docker-compose.yml` - Add volume definition
- No code changes needed
- **Doesn't solve user's problem**

---

## Recommendation

**Option 1 is the BEST solution** because:

1. **Solves the root cause:** Files saved to data/ (which is mounted)
2. **Minimal changes:** Only 1 line change in upload route
3. **Backward compatible:** Existing serving routes already support data/uploads/
4. **Migration handled:** Existing migrateLegacyUploads() function
5. **No Docker changes needed:** Setup remains simple
6. **Consistent:** Aligns with existing architecture design

## Implementation Plan

### Step 1: Update Upload Route
File: `app/api/upload/route.js`
Change: Line 97
```javascript
// Before
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

// After
const uploadsDir = path.join(process.cwd(), 'data', 'uploads');
```

### Step 2: Verify data/uploads/ Directory
The upload route already has:
```javascript
await fs.mkdir(uploadsDir, { recursive: true });
```
So directory will be created automatically.

### Step 3: Test Upload Flow
1. Login to CMS
2. Upload a new photo
3. Verify file appears in `data/uploads/`
4. Verify URL works in browser
5. Restart Docker: `docker compose down && docker compose up -d`
6. Verify file still exists and URL still works

### Step 4: Handle Existing Files (Optional)
If there are files in public/uploads/ that need to be preserved:
1. Copy files from public/uploads/ to data/uploads/
2. They'll be served automatically (serving route checks data/uploads/ first)

## Risk Assessment

**Low Risk:**
- Only 1 line of code changes
- Existing architecture already supports this
- Migration function exists
- Serving routes already check data/uploads/ first

**No Breaking Changes:**
- Existing URLs still work
- No API changes
- No Docker setup changes
- Backward compatible

## Testing Checklist

- [ ] Upload new file via CMS → Saves to data/uploads/
- [ ] Access uploaded file via URL → Returns correct image
- [ ] Restart Docker → File persists
- [ ] Access file after restart → Still works
- [ ] Old files in public/uploads/ → Accessible via fallback
- [ ] No errors in Docker logs
- [ ] No errors in browser console

## Conclusion

**Option 1 (Change upload destination to data/uploads/) is the recommended solution** because:
- It's the simplest change (1 line)
- It solves the root cause
- It's aligned with existing architecture
- It has minimal risk
- It doesn't require Docker setup changes
