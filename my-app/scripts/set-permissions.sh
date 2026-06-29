#!/bin/bash

# ══════════════════════════════════════════════════════════════════
# Poin 17: File Permission Configuration Script
# Untuk deployment di VPS/cPanel
# Standard: OWASP A05 / OWASP ASVS
# ══════════════════════════════════════════════════════════════════

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔐 Setting file permissions for security..."
echo ""

# Function to print colored output
print_status() {
  echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
  echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
  echo -e "${RED}✗${NC} $1"
}

# Check if running as root (needed for chmod)
if [ "$EUID" -ne 0 ]; then
  print_error "Please run as root (sudo ./set-permissions.sh)"
  exit 1
fi

# Set project root directory
PROJECT_ROOT="${1:-.}"

if [ ! -d "$PROJECT_ROOT" ]; then
  print_error "Directory $PROJECT_ROOT does not exist"
  exit 1
fi

cd "$PROJECT_ROOT"

print_status "Project root: $(pwd)"
echo ""

# ══════════════════════════════════════════════════════════════════
# 1. Folder Permissions (755 = rwxr-xr-x)
# ══════════════════════════════════════════════════════════════════

print_warning "Setting folder permissions (755)..."

# Main directories
chmod 755 .
chmod 755 data
chmod 755 public
chmod 755 public/uploads
chmod 755 public/images

# Data backups directory
mkdir -p data/backups
chmod 755 data/backups

# Create subdirectories for each file backup
for dir in data/backups/*/; do
  if [ -d "$dir" ]; then
    chmod 755 "$dir"
  fi
done

print_status "Folder permissions set to 755"
echo ""

# ══════════════════════════════════════════════════════════════════
# 2. File Permissions - JSON Files (644 = rw-r--r--)
# ══════════════════════════════════════════════════════════════════

print_warning "Setting JSON file permissions (644)..."

# Data JSON files
find data -name "*.json" -type f -exec chmod 644 {} \;

print_status "JSON file permissions set to 644"
echo ""

# ══════════════════════════════════════════════════════════════════
# 3. Environment/Config Files (600 = rw-------)
# ══════════════════════════════════════════════════════════════════

print_warning "Setting environment file permissions (600)..."

# .env files
for env_file in .env .env.local .env.production .env.development; do
  if [ -f "$env_file" ]; then
    chmod 600 "$env_file"
    print_status "Set permissions for $env_file"
  fi
done

# Config files
for config_file in *.json *.config.js *.config.mjs; do
  if [ -f "$config_file" ]; then
    chmod 644 "$config_file"
    print_status "Set permissions for $config_file"
  fi
done

echo ""

# ══════════════════════════════════════════════════════════════════
# 4. Upload Directory (Writable but secure)
# ══════════════════════════════════════════════════════════════════

print_warning "Setting upload directory permissions..."

# Ensure uploads directory exists
mkdir -p public/uploads

# Set directory permission (writable)
chmod 755 public/uploads

# Set existing files in uploads (read-only)
find public/uploads -type f -exec chmod 644 {} \;

print_status "Upload directory permissions set"
echo ""

# ══════════════════════════════════════════════════════════════════
# 5. Node.js/Next.js Files (644)
# ══════════════════════════════════════════════════════════════════

print_warning "Setting Node.js file permissions..."

# Server files
for file in server.js next.config.js next.config.mjs package.json; do
  if [ -f "$file" ]; then
    chmod 644 "$file"
    print_status "Set permissions for $file"
  fi
done

# .next directory (if exists)
if [ -d ".next" ]; then
  find .next -type f -name "*.js" -exec chmod 644 {} \;
  find .next -type f -name "*.css" -exec chmod 644 {} \;
  find .next -type f -name "*.json" -exec chmod 644 {} \;
  print_status "Set permissions for .next directory"
fi

echo ""

# ══════════════════════════════════════════════════════════════════
# 6. Scripts (Executable)
# ══════════════════════════════════════════════════════════════════

print_warning "Setting script permissions..."

find scripts -name "*.sh" -type f -exec chmod 755 {} \; 2>/dev/null || true

print_status "Script permissions set"
echo ""

# ══════════════════════════════════════════════════════════════════
# 7. Verify Permissions
# ══════════════════════════════════════════════════════════════════

print_warning "Verifying permissions..."
echo ""

echo "📁 Folder permissions:"
ls -ld data public public/uploads 2>/dev/null | awk '{print $1, $9}'
echo ""

echo "📄 Sample JSON file permissions:"
ls -l data/*.json 2>/dev/null | head -3 | awk '{print $1, $9}'
echo ""

echo "🔐 Environment file permissions:"
ls -l .env* 2>/dev/null | awk '{print $1, $9}' || echo "No .env files found"
echo ""

# ══════════════════════════════════════════════════════════════════
# 8. Summary
# ══════════════════════════════════════════════════════════════════

echo "═══════════════════════════════════════════════════════════════"
echo "✅ File permissions configured successfully!"
echo ""
echo "Summary:"
echo "  📁 Folders: 755 (rwxr-xr-x)"
echo "  📄 JSON files: 644 (rw-r--r--)"
echo "  🔐 Env files: 600 (rw-------)"
echo "  📤 Uploads: 755 (directory), 644 (files)"
echo "═══════════════════════════════════════════════════════════════"
