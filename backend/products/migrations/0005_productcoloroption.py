from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ('products', '0004_alter_productcategory_options'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProductColorOption',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=80, verbose_name='название цвета')),
                ('hex_code', models.CharField(blank=True, max_length=7, verbose_name='hex код')),
                ('sort_order', models.PositiveIntegerField(default=0, verbose_name='порядок сортировки')),
                ('is_active', models.BooleanField(default=True, verbose_name='активен')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='создано')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='обновлено')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='color_options', to='products.product', verbose_name='товар')),
            ],
            options={
                'verbose_name': 'цвет товара',
                'verbose_name_plural': 'цвета товара',
                'ordering': ('sort_order', 'id'),
            },
        ),
        migrations.AddConstraint(
            model_name='productcoloroption',
            constraint=models.UniqueConstraint(fields=('product', 'name'), name='unique_product_color_name'),
        ),
    ]
