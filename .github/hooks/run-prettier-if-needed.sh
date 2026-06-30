#!/usr/bin/env bash
set -euo pipefail

tool_name="${1:-${toolName:-}}"

if [ "$tool_name" = "create" ] || [ "$tool_name" = "edit" ]; then
  npx prettier --write .
fi
