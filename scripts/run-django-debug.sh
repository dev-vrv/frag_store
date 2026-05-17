#!/usr/bin/env sh
set -eu

cd /app/backend

python - <<'PY'
import os
import sys
import time
from urllib.parse import urlparse

database_url = os.getenv("DATABASE_URL", "")
if database_url.startswith(("postgres://", "postgresql://")):
    import psycopg2

    parsed = urlparse(database_url)
    for attempt in range(1, 31):
        try:
            conn = psycopg2.connect(
                dbname=parsed.path.lstrip("/"),
                user=parsed.username,
                password=parsed.password,
                host=parsed.hostname,
                port=parsed.port or 5432,
            )
            conn.close()
            break
        except psycopg2.OperationalError as exc:
            if attempt == 30:
                raise
            print(f"Waiting for PostgreSQL ({attempt}/30): {exc}", file=sys.stderr)
            time.sleep(1)
PY

python manage.py migrate
python manage.py shell -c "
from django.contrib.auth import get_user_model

User = get_user_model()
email = 'dev.vrv@gmail.com'
password = 'ggwp8888'

if not User.objects.filter(email=email).exists():
    username_field = User.USERNAME_FIELD
    user_data = {
        'email': email,
        'password': password,
    }
    if username_field != 'email':
        user_data[username_field] = email
    User.objects.create_superuser(**user_data)
    print(f'Created development superuser: {email}')
else:
    print(f'Development user already exists: {email}')
"
python manage.py runserver "0.0.0.0:${DJANGO_PORT:-8000}"
