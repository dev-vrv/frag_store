#!/usr/bin/env sh
set -eu

cd /app/frontend

npm run dev -- --hostname 0.0.0.0 --port "${FRONTEND_PORT:-3000}"
