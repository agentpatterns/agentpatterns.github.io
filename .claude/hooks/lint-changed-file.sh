#!/usr/bin/env bash
# PostToolUse: Auto-lint changed TypeScript files
set -euo pipefail
FILE="$1"
if [[ "$FILE" == *.ts || "$FILE" == *.tsx ]]; then
  npx eslint --fix "$FILE" 2>/dev/null || true
fi
