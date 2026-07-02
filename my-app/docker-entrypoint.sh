#!/bin/sh
# Initialize data volume if empty (first run)
DATA_DIR="/app/data"

if [ ! -f "$DATA_DIR/global.json" ]; then
  echo "[entrypoint] Initializing data directory..."
  mkdir -p "$DATA_DIR/backups"

  # Copy initial data from image if available
  if [ -d "/app/data-init" ] && [ "$(ls -A /app/data-init 2>/dev/null)" ]; then
    cp -n /app/data-init/*.json "$DATA_DIR/" 2>/dev/null || true
    echo "[entrypoint] Initial data copied."
  fi
fi

exec node server.js
