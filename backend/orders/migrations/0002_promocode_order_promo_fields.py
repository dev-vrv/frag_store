from decimal import Decimal

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='PromoCode',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=32, unique=True)),
                ('title', models.CharField(max_length=120)),
                ('description', models.TextField(blank=True)),
                ('discount_type', models.CharField(choices=[('percent', 'Percent'), ('fixed', 'Fixed amount')], default='percent', max_length=16)),
                ('discount_value', models.DecimalField(decimal_places=2, max_digits=10)),
                ('is_active', models.BooleanField(default=True)),
                ('starts_at', models.DateTimeField(blank=True, null=True)),
                ('ends_at', models.DateTimeField(blank=True, null=True)),
                ('usage_limit', models.PositiveIntegerField(blank=True, null=True)),
                ('used_count', models.PositiveIntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'promo code',
                'verbose_name_plural': 'promo codes',
                'ordering': ('code',),
            },
        ),
        migrations.AddField(
            model_name='order',
            name='promo_code',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='orders', to='orders.promocode'),
        ),
        migrations.AddField(
            model_name='order',
            name='promo_code_snapshot',
            field=models.CharField(blank=True, max_length=32),
        ),
        migrations.AddField(
            model_name='order',
            name='promo_discount_total',
            field=models.DecimalField(decimal_places=2, default=Decimal('0.00'), max_digits=12),
        ),
    ]
