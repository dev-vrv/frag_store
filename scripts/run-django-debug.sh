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
python manage.py seed_debug_catalog --reset
python manage.py shell -c "
from django.contrib.auth import get_user_model
from products.models import Brand, Product, ProductCategory
from django.db.models import Count

User = get_user_model()
email = 'dev.vrv@gmail.com'
password = 'ggwp8888'
first_name = 'Dev'

if not User.objects.filter(email=email).exists():
    username_field = User.USERNAME_FIELD
    user_data = {
        'email': email,
        'password': password,
        'first_name': first_name,
    }
    if username_field != 'email':
        user_data[username_field] = email
    User.objects.create_superuser(**user_data)
    print(f'Created development superuser: {email}')
else:
    print(f'Development user already exists: {email}')

product_count = Product.objects.count()
category_count = ProductCategory.objects.count()
brand_count = Brand.objects.count()
best_seller_count = Product.objects.filter(is_best_seller=True).count()
discounted_count = Product.objects.filter(old_price__isnull=False).count()
category_breakdown = list(
    ProductCategory.objects.filter(products__isnull=False)
    .annotate(total=Count('products'))
    .order_by('sort_order', 'slug')
    .values_list('slug', 'total')
)
print(
    f'Debug catalog ready: {product_count} products, {category_count} categories, '
    f'{brand_count} brands, {best_seller_count} best sellers, {discounted_count} discounted'
)
print('Category mix:', ', '.join(f'{slug}={total}' for slug, total in category_breakdown))
"
python manage.py runserver "0.0.0.0:${DJANGO_PORT:-8000}"
