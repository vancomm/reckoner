#!/usr/bin/env bash
set -euxo pipefail

REMOTE_HOST="${REMOTE_HOST:-mskbox}"
SOURCE_DIR="${SOURCE_DIR:-dist}"
TARGET_DIR="${TARGET_DIR:-/var/www/vancommdot.com/splitcheck}"

pnpm run build
rsync -avz "$SOURCE_DIR/" "$REMOTE_HOST:$TARGET_DIR"
