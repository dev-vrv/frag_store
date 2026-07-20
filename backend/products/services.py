from django.db import transaction
from django.utils import timezone

from users.models import Notification
from .models import Product, ProductStockSubscription

COPY = {
    'ru': ('Товар снова в наличии', 'Товар «{product}», на который вы подписывались, снова доступен для заказа.'),
    'en': ('Back in stock', 'The product “{product}” you subscribed to is available to order again.'),
    'kg': ('Товар кайра сатыкта', 'Сиз көз салып жаткан «{product}» товары кайрадан заказ кылууга жеткиликтүү.'),
}


@transaction.atomic
def create_stock_arrival_notifications(product_id):
    product = Product.objects.select_for_update().filter(pk=product_id).first()
    if not product or product.quantity_in_stock <= 0:
        return 0
    subscriptions = list(ProductStockSubscription.objects.select_for_update().filter(product=product, status=ProductStockSubscription.Status.ACTIVE))
    if not subscriptions:
        return 0
    media = product.media_items.filter(is_primary=True).first() or product.media_items.first()
    image_url = (media.file.url if media and media.file else media.external_url if media else '')
    Notification.objects.bulk_create([
        Notification(
            user_id=item.user_id,
            title=COPY.get(item.locale, COPY['ru'])[0],
            text=COPY.get(item.locale, COPY['ru'])[1].format(product=product.name),
            notification_type=Notification.Type.STOCK,
            link=f'/catalog?product={product.slug}',
            image_url=image_url,
            metadata={'product_id': product.id, 'product_slug': product.slug, 'sku': product.sku},
        ) for item in subscriptions
    ])
    now = timezone.now()
    ProductStockSubscription.objects.filter(pk__in=[item.pk for item in subscriptions]).update(status=ProductStockSubscription.Status.NOTIFIED, notified_at=now, updated_at=now)
    return len(subscriptions)
