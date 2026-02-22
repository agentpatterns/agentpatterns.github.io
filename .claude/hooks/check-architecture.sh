#!/usr/bin/env bash
# Stop hook: Verify architecture fitness tests pass
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
npm run test:arch 2>&1
