from django.db import models
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _


class ContactInfo(models.Model):
    class Locale(models.TextChoices):
        RU = 'ru', _('Русский')
        EN = 'en', _('Английский')
        KG = 'kg', _('Кыргызский')

    locale = models.CharField(_('язык'), max_length=2, choices=Locale.choices, unique=True)
    phone = models.CharField(_('телефон'), max_length=64, blank=True)
    email = models.EmailField(_('email'), blank=True)
    address = models.CharField(_('адрес'), max_length=255, blank=True)
    working_hours = models.CharField(_('часы работы'), max_length=255, blank=True)
    whatsapp = models.URLField(_('WhatsApp'), blank=True)
    telegram = models.URLField(_('Telegram'), blank=True)
    instagram = models.URLField(_('Instagram'), blank=True)
    facebook = models.URLField(_('Facebook'), blank=True)
    youtube = models.URLField(_('YouTube'), blank=True)
    tiktok = models.URLField(_('TikTok'), blank=True)
    x = models.URLField(_('X / Twitter'), blank=True)
    extra_contacts = models.JSONField(_('дополнительные контакты'), blank=True, default=dict)
    is_active = models.BooleanField(_('активно'), default=True)
    created_at = models.DateTimeField(_('создано'), auto_now_add=True)
    updated_at = models.DateTimeField(_('обновлено'), auto_now=True)

    class Meta:
        ordering = ['locale']
        verbose_name = _('контактная информация')
        verbose_name_plural = _('контактная информация')

    def __str__(self):
        return f'Contact info ({self.locale})'


class BlogPost(models.Model):
    image = models.ImageField(_('изображение'), upload_to='blog/images/')
    video = models.FileField(_('видео'), upload_to='blog/videos/', blank=True, null=True)
    slug = models.SlugField(_('slug'), max_length=180, unique=True, blank=True)

    title_ru = models.CharField(_('заголовок (RU)'), max_length=255)
    title_en = models.CharField(_('заголовок (EN)'), max_length=255)
    title_kg = models.CharField(_('заголовок (KG)'), max_length=255)

    text_ru = models.TextField(_('текст (RU)'))
    text_en = models.TextField(_('текст (EN)'))
    text_kg = models.TextField(_('текст (KG)'))

    is_published = models.BooleanField(_('опубликовано'), default=True)
    created_at = models.DateTimeField(_('создано'), auto_now_add=True)
    updated_at = models.DateTimeField(_('обновлено'), auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = _('статья блога')
        verbose_name_plural = _('статьи блога')

    def __str__(self):
        return self.title_ru

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title_en) or slugify(self.title_ru) or 'blog-post'
            slug = base_slug
            index = 2

            while BlogPost.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f'{base_slug}-{index}'
                index += 1

            self.slug = slug

        super().save(*args, **kwargs)
