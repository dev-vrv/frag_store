from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('orders', '0003_alter_order_options_alter_orderitem_options_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='orderitem',
            name='selected_color_hex',
            field=models.CharField(blank=True, max_length=7, verbose_name='hex выбранного цвета'),
        ),
        migrations.AddField(
            model_name='orderitem',
            name='selected_color_name',
            field=models.CharField(blank=True, max_length=80, verbose_name='выбранный цвет'),
        ),
    ]
