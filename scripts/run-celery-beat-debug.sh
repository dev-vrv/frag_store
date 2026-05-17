#!/usr/bin/env sh
set -eu

cd /app/backend

python manage.py shell -c "
import sys
import time
from django.db import connection

table_name = 'django_celery_beat_periodictask'
for attempt in range(1, 61):
    if table_name in connection.introspection.table_names():
        break
    print(f'Waiting for Celery Beat migrations ({attempt}/60): {table_name}', file=sys.stderr)
    time.sleep(1)
else:
    raise SystemExit(f'Missing required table after waiting: {table_name}')
"
celery -A backend beat --loglevel="${CELERY_LOG_LEVEL:-info}" --scheduler django_celery_beat.schedulers:DatabaseScheduler
