from __future__ import annotations

from dataclasses import dataclass
from datetime import date, timedelta
from decimal import Decimal, ROUND_HALF_UP
import random

from django.core.management.base import BaseCommand
from django.db import transaction

from products.models import (
    Brand,
    Product,
    ProductCategory,
    ProductColorOption,
    ProductFeature,
    ProductSpecification,
)


@dataclass(frozen=True)
class CategorySeed:
    slug: str
    name: str
    description: str
    device_type: str
    sort_order: int
    keywords: tuple[str, ...]
    colors: tuple[str, ...]
    features: tuple[str, ...]
    specs: tuple[tuple[str, str, str], ...]
    price_range: tuple[int, int]


CATEGORY_SEEDS: tuple[CategorySeed, ...] = (
    CategorySeed(
        slug="mice",
        name="Игровые мыши",
        description="Сенсоры, форма и быстрый отклик для соревновательной игры.",
        device_type=ProductCategory.DeviceType.MOUSE,
        sort_order=10,
        keywords=("Pulse", "Flick", "Vector", "Apex", "Scout"),
        colors=("Black", "White", "Crimson", "Ice"),
        features=("PixArt sensor", "Optical switches", "Lightweight shell"),
        specs=(("Sensor", "PixArt 3395", ""), ("Polling rate", "4000", "Hz"), ("Weight", "59", "g")),
        price_range=(2900, 9200),
    ),
    CategorySeed(
        slug="keyboards",
        name="Игровые клавиатуры",
        description="Механические и магнитные клавиатуры с акцентом на отклик и feel.",
        device_type=ProductCategory.DeviceType.KEYBOARD,
        sort_order=20,
        keywords=("Switch", "Rapid", "Tact", "Forge", "Core"),
        colors=("Black", "White", "Gunmetal", "Red"),
        features=("Hot-swap plate", "Rapid trigger", "PBT keycaps"),
        specs=(("Layout", "TKL", ""), ("Switches", "Magnetic", ""), ("Polling rate", "8000", "Hz")),
        price_range=(4200, 12800),
    ),
    CategorySeed(
        slug="headsets",
        name="Гарнитуры",
        description="Чистая сцена, позиционирование и комфорт для длинных сессий.",
        device_type=ProductCategory.DeviceType.HEADSET,
        sort_order=30,
        keywords=("Echo", "Stage", "Voice", "Arena", "Comm"),
        colors=("Black", "White", "Steel", "Carbon"),
        features=("Spatial audio", "ENC microphone", "Low-latency wireless"),
        specs=(("Drivers", "50", "mm"), ("Mic", "ENC", ""), ("Connection", "2.4G", "")),
        price_range=(3500, 11200),
    ),
    CategorySeed(
        slug="mousepads",
        name="Игровые коврики",
        description="Speed/control поверхности для точного трекинга и стабильного скольжения.",
        device_type=ProductCategory.DeviceType.MOUSEPAD,
        sort_order=40,
        keywords=("Control", "Glide", "Zero", "Grid", "Surface"),
        colors=("Black", "Graphite", "Grey", "Crimson"),
        features=("Control weave", "Stitched edges", "Anti-slip base"),
        specs=(("Surface", "Control", ""), ("Thickness", "4", "mm"), ("Size", "XL", "")),
        price_range=(1400, 4200),
    ),
    CategorySeed(
        slug="monitors",
        name="Игровые мониторы",
        description="Высокая частота обновления и низкая задержка для киберспорта.",
        device_type=ProductCategory.DeviceType.MONITOR,
        sort_order=50,
        keywords=("Frame", "Vision", "Sync", "Arena", "Pulse"),
        colors=("Black", "Grey", "Graphite"),
        features=("Fast IPS", "Adaptive sync", "1ms response"),
        specs=(("Refresh rate", "240", "Hz"), ("Panel", "Fast IPS", ""), ("Resolution", "2560x1440", "")),
        price_range=(14500, 38000),
    ),
    CategorySeed(
        slug="accessories",
        name="Аксессуары",
        description="Хабы, держатели, стойки и полезные элементы для аккуратного setup.",
        device_type=ProductCategory.DeviceType.ACCESSORY,
        sort_order=60,
        keywords=("Dock", "Hub", "Stand", "Arm", "Wire"),
        colors=("Black", "White", "Silver"),
        features=("Desk-ready", "Cable routing", "Compact build"),
        specs=(("Material", "Aluminum", ""), ("Ports", "4", ""), ("Mount", "Desk", "")),
        price_range=(900, 5600),
    ),
)

BRAND_SEEDS = (
    ("HyperX", "https://hyperx.com", "USA"),
    ("Logitech G", "https://www.logitechg.com", "Switzerland"),
    ("Razer", "https://www.razer.com", "Singapore"),
    ("SteelSeries", "https://steelseries.com", "Denmark"),
    ("ASUS ROG", "https://rog.asus.com", "Taiwan"),
    ("Corsair", "https://www.corsair.com", "USA"),
    ("Redragon", "https://redragonshop.com", "China"),
    ("Dareu", "https://www.dareu.com", "China"),
    ("Lamzu", "https://lamzu.com", "China"),
    ("Endgame Gear", "https://www.endgamegear.com", "Germany"),
)

PRODUCT_TARGET = 120
BEST_SELLER_TARGET = 18
FEATURED_TARGET = 24
NEW_ARRIVAL_TARGET = 16
DISCOUNTED_TARGET = 42


class Command(BaseCommand):
    help = "Populate debug catalog with deterministic demo data."

    def add_arguments(self, parser):
        parser.add_argument(
            "--reset",
            action="store_true",
            help="Delete existing products, product details and brands before seeding.",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        seed = 20260625
        rng = random.Random(seed)

        if options["reset"]:
            Product.objects.all().delete()
            Brand.objects.all().delete()

        categories = self._ensure_categories()
        brands = self._ensure_brands()
        products = self._ensure_products(categories, brands, rng)
        self._apply_flags(products)
        self._sync_related_data(products, categories, rng)
        self._print_summary(products)

    def _ensure_categories(self) -> dict[str, ProductCategory]:
        categories: dict[str, ProductCategory] = {}

        for seed in CATEGORY_SEEDS:
            category, _ = ProductCategory.objects.update_or_create(
                slug=seed.slug,
                defaults={
                    "name": seed.name,
                    "description": seed.description,
                    "device_type": seed.device_type,
                    "sort_order": seed.sort_order,
                    "is_active": True,
                },
            )
            categories[seed.slug] = category

        return categories

    def _ensure_brands(self) -> list[Brand]:
        brands: list[Brand] = []

        for name, website, country in BRAND_SEEDS:
            brand, created = Brand.objects.get_or_create(
                name=name,
                defaults={
                    "website": website,
                    "country": country,
                    "is_active": True,
                },
            )
            if not created:
                brand.website = website
                brand.country = country
                brand.is_active = True
                brand.save(update_fields=("website", "country", "is_active", "updated_at"))
            brands.append(brand)

        return brands

    def _ensure_products(
        self,
        categories: dict[str, ProductCategory],
        brands: list[Brand],
        rng: random.Random,
    ) -> list[Product]:
        products: list[Product] = []
        seed_map = {seed.slug: seed for seed in CATEGORY_SEEDS}
        per_category = PRODUCT_TARGET // len(CATEGORY_SEEDS)

        for category_index, seed in enumerate(CATEGORY_SEEDS):
            category = categories[seed.slug]
            for index in range(per_category):
                global_index = category_index * per_category + index + 1
                brand = brands[(global_index + category_index) % len(brands)]
                keyword = seed.keywords[index % len(seed.keywords)]
                color = seed.colors[index % len(seed.colors)]
                name = f"{brand.name} {keyword} {seed.name[:-1] if seed.name.endswith('ы') else seed.name} {global_index:03d}"
                sku = f"DBG-{seed.slug[:3].upper()}-{global_index:04d}"
                price_value = rng.randint(*seed.price_range)
                old_price_value = (
                    Decimal(price_value) * Decimal(rng.choice(("1.10", "1.15", "1.20", "1.25")))
                    if global_index <= DISCOUNTED_TARGET
                    else None
                )
                quantity = rng.randint(0, 36)
                availability = self._resolve_availability(quantity, global_index)

                product, _ = Product.objects.update_or_create(
                    sku=sku,
                    defaults={
                        "category": category,
                        "brand": brand,
                        "name": name,
                        "short_description": self._build_short_description(seed, brand.name),
                        "description": self._build_description(seed, brand.name, color),
                        "price": Decimal(price_value),
                        "old_price": self._quantize(old_price_value) if old_price_value else None,
                        "currency": Product.Currency.KGS,
                        "quantity_in_stock": quantity,
                        "availability_status": availability,
                        "warranty_months": rng.choice((6, 12, 18, 24)),
                        "color": color,
                        "weight_grams": self._resolve_weight(seed.slug, rng),
                        "release_date": date.today() - timedelta(days=rng.randint(15, 640)),
                        "is_active": True,
                        "is_featured": False,
                        "is_best_seller": False,
                        "is_new_arrival": False,
                        "meta_title": f"{name} | FRAG STORE",
                        "meta_description": f"{name}. {seed.description}",
                    },
                )
                products.append(product)

        return products

    def _apply_flags(self, products: list[Product]) -> None:
        ordered = sorted(products, key=lambda item: item.sku)

        for index, product in enumerate(ordered):
            product.is_best_seller = index < BEST_SELLER_TARGET
            product.is_featured = index < FEATURED_TARGET or product.category.slug in {"mice", "keyboards"}
            product.is_new_arrival = index % 7 == 0 or index < NEW_ARRIVAL_TARGET
            product.save(
                update_fields=(
                    "is_best_seller",
                    "is_featured",
                    "is_new_arrival",
                    "updated_at",
                )
            )

    def _sync_related_data(
        self,
        products: list[Product],
        categories: dict[str, ProductCategory],
        rng: random.Random,
    ) -> None:
        seed_map = {seed.slug: seed for seed in CATEGORY_SEEDS}
        ProductColorOption.objects.filter(product__in=products).delete()
        ProductFeature.objects.filter(product__in=products).delete()
        ProductSpecification.objects.filter(product__in=products).delete()

        color_options: list[ProductColorOption] = []
        features: list[ProductFeature] = []
        specifications: list[ProductSpecification] = []

        for product in products:
            seed = seed_map[product.category.slug]
            palette = list(seed.colors)
            primary_color = product.color or palette[0]
            secondary_color = next(
                (candidate for candidate in palette if candidate != primary_color),
                f"{primary_color} Alt",
            )
            for color_index, color_name in enumerate((primary_color, secondary_color)):
                color_options.append(
                    ProductColorOption(
                        product=product,
                        name=color_name,
                        hex_code=self._hex_for_color(color_name, color_index),
                        sort_order=color_index,
                        is_active=True,
                    )
                )

            for feature_index, feature_title in enumerate(seed.features):
                features.append(
                    ProductFeature(
                        product=product,
                        title=feature_title,
                        description=f"{feature_title} tuned for {product.category.name.lower()} and competitive play.",
                        sort_order=feature_index,
                    )
                )

            for spec_index, (spec_name, value, unit) in enumerate(seed.specs):
                specifications.append(
                    ProductSpecification(
                        product=product,
                        group="Core",
                        name=spec_name,
                        value=value,
                        unit=unit,
                        value_type=ProductSpecification.ValueType.NUMBER if value.isdigit() else ProductSpecification.ValueType.TEXT,
                        is_highlight=spec_index < 2,
                        sort_order=spec_index,
                    )
                )

            specifications.append(
                ProductSpecification(
                    product=product,
                    group="Debug",
                    name="Drop batch",
                    value=f"DBG-{rng.randint(100, 999)}",
                    unit="",
                    value_type=ProductSpecification.ValueType.TEXT,
                    is_highlight=False,
                    sort_order=20,
                )
            )

        ProductColorOption.objects.bulk_create(color_options)
        ProductFeature.objects.bulk_create(features)
        ProductSpecification.objects.bulk_create(specifications)

    def _resolve_availability(self, quantity: int, index: int) -> str:
        if quantity == 0:
            return Product.AvailabilityStatus.OUT_OF_STOCK
        if quantity <= 3:
            return Product.AvailabilityStatus.LOW_STOCK
        if index % 17 == 0:
            return Product.AvailabilityStatus.PREORDER
        return Product.AvailabilityStatus.IN_STOCK

    def _resolve_weight(self, slug: str, rng: random.Random) -> int | None:
        if slug == "mice":
            return rng.randint(52, 84)
        if slug == "keyboards":
            return rng.randint(620, 1180)
        if slug == "headsets":
            return rng.randint(240, 390)
        if slug == "mousepads":
            return rng.randint(320, 780)
        if slug == "monitors":
            return rng.randint(3800, 6900)
        if slug == "accessories":
            return rng.randint(90, 620)
        return None

    def _build_short_description(self, seed: CategorySeed, brand_name: str) -> str:
        return f"{brand_name} {seed.name.lower()} для быстрой, точной и стабильной игры."

    def _build_description(self, seed: CategorySeed, brand_name: str, color: str) -> str:
        feature_text = ", ".join(seed.features[:2]).lower()
        return (
            f"{brand_name} {seed.name.lower()} в цвете {color}. "
            f"Подходит для FPS, MOBA и ranked-сессий, где важны отклик, контроль и надежность. "
            f"Внутри акцент на {feature_text}."
        )

    def _hex_for_color(self, color_name: str, index: int) -> str:
        mapping = {
            "Black": "#101114",
            "White": "#F4F4F5",
            "Crimson": "#BE123C",
            "Ice": "#67E8F9",
            "Gunmetal": "#4B5563",
            "Red": "#EF4444",
            "Steel": "#94A3B8",
            "Carbon": "#27272A",
            "Graphite": "#3F3F46",
            "Grey": "#A1A1AA",
            "Silver": "#D4D4D8",
        }
        return mapping.get(color_name, "#FFFFFF" if index % 2 else "#111827")

    def _quantize(self, value: Decimal) -> Decimal:
        return value.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

    def _print_summary(self, products: list[Product]) -> None:
        discounted = sum(1 for product in products if product.has_discount)
        best_sellers = sum(1 for product in products if product.is_best_seller)
        featured = sum(1 for product in products if product.is_featured)
        new_arrivals = sum(1 for product in products if product.is_new_arrival)
        per_category: dict[str, int] = {}

        for product in products:
            per_category[product.category.slug] = per_category.get(product.category.slug, 0) + 1

        self.stdout.write(self.style.SUCCESS("Debug catalog seeded."))
        self.stdout.write(
            f"Products: {len(products)}, discounted: {discounted}, best sellers: {best_sellers}, "
            f"featured: {featured}, new arrivals: {new_arrivals}"
        )
        self.stdout.write(
            "By category: "
            + ", ".join(
                f"{slug}={count}"
                for slug, count in sorted(per_category.items())
            )
        )
