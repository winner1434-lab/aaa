#!/usr/bin/env bash
set -euo pipefail

PORT="${1:-8000}"
HOST="${HOST:-127.0.0.1}"

if command -v python3 >/dev/null 2>&1; then
  PYTHON=python3
elif command -v python >/dev/null 2>&1; then
  PYTHON=python
else
  echo "找不到 Python（python3 / python）。請先安裝 Python 3。" >&2
  exit 1
fi

echo "啟動中: http://${HOST}:${PORT}/apps/web/playground.html"
echo "按 Ctrl+C 可停止"
exec "$PYTHON" -m http.server "$PORT" --bind "$HOST"
