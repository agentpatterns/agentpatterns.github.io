#!/usr/bin/env bash
# PreToolUse: Block edits to protected paths
set -euo pipefail
FILE="$1"
BLOCKED_PATHS=("dist/" ".github/" ".claude/hooks/")
for blocked in "${BLOCKED_PATHS[@]}"; do
  if [[ "$FILE" == "$blocked"* ]]; then
    echo "BLOCKED: Cannot edit files in $blocked — protected path"
    exit 1
  fi
done
