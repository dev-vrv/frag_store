from django.db import migrations


DEFAULT_CATEGORIES = [
    {
        "slug": "mice",
        "name": "Gaming Mice",
        "description": "Lightweight wired and wireless gaming mice with modern sensors and competitive shapes.",
        "device_type": "mouse",
        "sort_order": 10,
    },
    {
        "slug": "keyboards",
        "name": "Gaming Keyboards",
        "description": "Mechanical and low-profile gaming keyboards with fast actuation and RGB backlighting.",
        "device_type": "keyboard",
        "sort_order": 20,
    },
    {
        "slug": "headsets",
        "name": "Gaming Headsets",
        "description": "Closed and open-back gaming headsets with clear voice chat and positional audio.",
        "device_type": "headset",
        "sort_order": 30,
    },
    {
        "slug": "mousepads",
        "name": "Gaming Mousepads",
        "description": "Speed and control mousepads for stable tracking and confident flicks.",
        "device_type": "mousepad",
        "sort_order": 40,
    },
    {
        "slug": "controllers",
        "name": "Game Controllers",
        "description": "Gamepads and pro controllers for console and PC gaming.",
        "device_type": "controller",
        "sort_order": 50,
    },
    {
        "slug": "monitors",
        "name": "Gaming Monitors",
        "description": "High refresh gaming displays with low response time and adaptive sync.",
        "device_type": "monitor",
        "sort_order": 60,
    },
    {
        "slug": "microphones",
        "name": "Gaming Microphones",
        "description": "USB and XLR microphones for streaming, voice chat, and content creation.",
        "device_type": "accessory",
        "sort_order": 70,
    },
    {
        "slug": "webcams",
        "name": "Webcams",
        "description": "Streaming webcams for calls, broadcasts, and creator setups.",
        "device_type": "accessory",
        "sort_order": 80,
    },
    {
        "slug": "speakers",
        "name": "Desktop Speakers",
        "description": "Compact desktop speakers and sound systems for gaming setups.",
        "device_type": "accessory",
        "sort_order": 90,
    },
    {
        "slug": "accessories",
        "name": "Gaming Accessories",
        "description": "Useful gaming accessories including hubs, stands, cables, and desk gear.",
        "device_type": "accessory",
        "sort_order": 100,
    },
]


def seed_default_categories(apps, schema_editor):
    ProductCategory = apps.get_model("products", "ProductCategory")

    for payload in DEFAULT_CATEGORIES:
        ProductCategory.objects.update_or_create(
            slug=payload["slug"],
            defaults={
                "name": payload["name"],
                "description": payload["description"],
                "device_type": payload["device_type"],
                "sort_order": payload["sort_order"],
                "is_active": True,
            },
        )


def remove_default_categories(apps, schema_editor):
    ProductCategory = apps.get_model("products", "ProductCategory")
    ProductCategory.objects.filter(slug__in=[item["slug"] for item in DEFAULT_CATEGORIES]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("products", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_default_categories, remove_default_categories),
    ]
