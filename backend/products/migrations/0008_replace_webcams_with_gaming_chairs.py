from django.db import migrations, models
from django.db.models import Q


CHAIR_SLUG = 'gaming-chairs'
CHAIR_SLUG_ALIASES = (CHAIR_SLUG, 'chairs', 'gaming_chairs')
CHAIR_NAMES = ('Gaming Chairs', 'Игровые кресла')


def replace_webcams_with_gaming_chairs(apps, schema_editor):
    Product = apps.get_model('products', 'Product')
    ProductCategory = apps.get_model('products', 'ProductCategory')
    database_alias = schema_editor.connection.alias
    categories = ProductCategory.objects.using(database_alias)
    products = Product.objects.using(database_alias)

    accessories = categories.filter(slug='accessories').first()
    if accessories is None:
        accessories = categories.filter(name__in=('Gaming Accessories', 'Аксессуары')).first()

    if accessories is None:
        accessories = categories.create(
            slug='accessories',
            name='Gaming Accessories',
            description='Gaming accessories including webcams, hubs, stands, cables, and desk gear.',
            device_type='accessory',
            sort_order=100,
            is_active=True,
        )
    else:
        accessories.slug = 'accessories'
        accessories.device_type = 'accessory'
        accessories.is_active = True
        accessories.save(update_fields=('slug', 'device_type', 'is_active', 'updated_at'))

    webcam_category = categories.filter(slug='webcams').first()
    if webcam_category is not None:
        products.filter(category_id=webcam_category.pk).update(category_id=accessories.pk)

    chair_candidates = list(
        categories.filter(Q(slug__in=CHAIR_SLUG_ALIASES) | Q(name__in=CHAIR_NAMES))
        .order_by('pk')
    )
    gaming_chairs = next(
        (category for category in chair_candidates if category.slug == CHAIR_SLUG),
        chair_candidates[0] if chair_candidates else None,
    )

    if gaming_chairs is None:
        gaming_chairs = webcam_category or categories.create(
            slug=CHAIR_SLUG,
            name='Gaming Chairs',
            description='Ergonomic gaming chairs with adjustable support for long sessions.',
            device_type='chair',
            sort_order=80,
            is_active=True,
        )

    for duplicate in chair_candidates:
        if duplicate.pk == gaming_chairs.pk:
            continue
        products.filter(category_id=duplicate.pk).update(category_id=gaming_chairs.pk)
        duplicate.delete()

    if webcam_category is not None and webcam_category.pk != gaming_chairs.pk:
        webcam_category.delete()

    gaming_chairs.slug = CHAIR_SLUG
    gaming_chairs.name = 'Gaming Chairs'
    gaming_chairs.description = 'Ergonomic gaming chairs with adjustable support for long sessions.'
    gaming_chairs.device_type = 'chair'
    gaming_chairs.sort_order = 80
    gaming_chairs.is_active = True
    gaming_chairs.save(
        update_fields=(
            'slug',
            'name',
            'description',
            'device_type',
            'sort_order',
            'is_active',
            'updated_at',
        )
    )


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0007_productstocksubscription'),
    ]

    operations = [
        migrations.AlterField(
            model_name='productcategory',
            name='device_type',
            field=models.CharField(
                choices=[
                    ('mouse', 'Мышь'),
                    ('keyboard', 'Клавиатура'),
                    ('headset', 'Гарнитура'),
                    ('mousepad', 'Коврик'),
                    ('controller', 'Контроллер'),
                    ('monitor', 'Монитор'),
                    ('chair', 'Игровое кресло'),
                    ('component', 'Компонент'),
                    ('accessory', 'Аксессуар'),
                    ('other', 'Другое'),
                ],
                default='other',
                max_length=24,
                verbose_name='тип устройства',
            ),
        ),
        migrations.RunPython(
            replace_webcams_with_gaming_chairs,
            reverse_code=migrations.RunPython.noop,
        ),
    ]
