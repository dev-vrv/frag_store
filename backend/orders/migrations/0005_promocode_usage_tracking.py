from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ('orders', '0004_orderitem_selected_color_fields'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='promocode',
            name='used_at',
            field=models.DateTimeField(blank=True, null=True, verbose_name='использован в'),
        ),
        migrations.AddField(
            model_name='promocode',
            name='used_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='used_promo_codes', to=settings.AUTH_USER_MODEL, verbose_name='кто использовал'),
        ),
        migrations.AddField(
            model_name='promocode',
            name='used_by_email',
            field=models.EmailField(blank=True, max_length=254, verbose_name='email использовавшего'),
        ),
    ]
