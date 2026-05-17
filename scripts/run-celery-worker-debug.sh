#!/usr/bin/env sh
set -eu

cd /app/backend

celery -A backend worker --loglevel="${CELERY_LOG_LEVEL:-info}"
