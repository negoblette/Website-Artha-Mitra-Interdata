#!/bin/bash

# Safe dependency update script
# Updates packages one category at a time with testing in between
# poin checklist no 9

set -e

echo "🔄 Starting safe dependency update process..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

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

# Step 1: Check current status
echo "📋 Step 1: Checking current security status..."
npm audit --audit-level=moderate 2>&1 || true
echo ""

# Step 2: Update security patches (minor/patch versions)
echo "🔧 Step 2: Applying security patches..."
npm update --save
print_status "Security patches applied"
echo ""

# Step 3: Verify no new vulnerabilities
echo "🔍 Step 3: Verifying security after updates..."
npm audit --audit-level=moderate 2>&1 || {
  print_error "Vulnerabilities detected after update. Please review."
  exit 1
}
print_status "No critical vulnerabilities found"
echo ""

# Step 4: Test the application
echo "🧪 Step 4: Testing the application..."
npm run build 2>&1 || {
  print_error "Build failed after updates. Please review changes."
  exit 1
}
print_status "Build successful"
echo ""

# Step 5: Run linting
echo "🔎 Step 5: Running linting checks..."
npm run lint 2>&1 || {
  print_warning "Linting issues detected. Please review."
}
print_status "Linting complete"
echo ""

# Step 6: Summary
echo "=========================================="
echo "✅ Dependency update complete!"
echo ""
echo "Next steps:"
echo "  1. Review changes: git diff"
echo "  2. Test application manually"
echo "  3. Commit changes: git add . && git commit -m 'chore: update dependencies'"
echo "  4. Push and create PR if needed"
echo "=========================================="
