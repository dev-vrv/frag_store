from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError(_('Необходимо указать email адрес.'))

        email = self.normalize_email(email).strip().lower()
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('У суперпользователя должен быть is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('У суперпользователя должен быть is_superuser=True.'))

        return self._create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_('email'), unique=True)
    first_name = models.CharField(_('имя'), max_length=150)
    last_name = models.CharField(_('фамилия'), max_length=150, blank=True)
    phone = models.CharField(_('телефон'), max_length=32, blank=True)
    city = models.CharField(_('город'), max_length=120, blank=True)
    address = models.CharField(_('адрес'), max_length=255, blank=True)
    personal_discount_percent = models.DecimalField(_('персональная скидка, %'), max_digits=5, decimal_places=2, default=0)
    email_verified = models.BooleanField(_('email подтвержден'), default=False)
    two_factor_enabled = models.BooleanField(_('двухфакторная аутентификация включена'), default=False)
    pending_two_factor_enabled = models.BooleanField(_('ожидает включения 2FA'), default=False)
    email_verification_code = models.CharField(_('код подтверждения email'), max_length=6, blank=True)
    email_verification_expires_at = models.DateTimeField(_('код подтверждения действует до'), blank=True, null=True)
    is_staff = models.BooleanField(_('доступ к админке'), default=False)
    is_active = models.BooleanField(_('активен'), default=True)
    date_joined = models.DateTimeField(_('дата регистрации'), default=timezone.now)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name']

    class Meta:
        ordering = ['-date_joined']
        verbose_name = _('пользователь')
        verbose_name_plural = _('пользователи')

    def __str__(self):
        return self.email

    @property
    def full_name(self):
        return ' '.join(part for part in [self.first_name, self.last_name] if part).strip()


class Notification(models.Model):
    class Type(models.TextChoices):
        STOCK = 'stock', _('Поступление товара')
        ORDER = 'order', _('Заказ')
        PROMOTION = 'promotion', _('Акция')
        SYSTEM = 'system', _('Системное')

    class Status(models.TextChoices):
        UNREAD = 'unread', _('Не просмотрено')
        READ = 'read', _('Просмотрено')
        ARCHIVED = 'archived', _('В архиве')

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications', verbose_name=_('пользователь'))
    title = models.CharField(_('заголовок'), max_length=180)
    text = models.TextField(_('текст'))
    notification_type = models.CharField(_('тип'), max_length=20, choices=Type.choices, default=Type.SYSTEM)
    status = models.CharField(_('статус'), max_length=16, choices=Status.choices, default=Status.UNREAD)
    link = models.CharField(_('ссылка'), max_length=500, blank=True)
    image_url = models.CharField(_('изображение'), max_length=500, blank=True)
    metadata = models.JSONField(_('дополнительные данные'), default=dict, blank=True)
    read_at = models.DateTimeField(_('просмотрено'), blank=True, null=True)
    created_at = models.DateTimeField(_('создано'), auto_now_add=True)
    updated_at = models.DateTimeField(_('обновлено'), auto_now=True)

    class Meta:
        ordering = ('-created_at',)
        verbose_name = _('уведомление')
        verbose_name_plural = _('уведомления')
        indexes = [models.Index(fields=('user', 'status', '-created_at'))]

    def __str__(self):
        return f'{self.user.email}: {self.title}'

    def mark_as_read(self):
        if self.status == self.Status.UNREAD:
            self.status = self.Status.READ
            self.read_at = timezone.now()
            self.save(update_fields=('status', 'read_at', 'updated_at'))


class ContactMessage(models.Model):
    class Locale(models.TextChoices):
        RU = 'ru', _('Русский')
        EN = 'en', _('Английский')
        KG = 'kg', _('Кыргызский')

    class Status(models.TextChoices):
        NEW = 'new', _('Новый')
        IN_PROGRESS = 'in_progress', _('В работе')
        DONE = 'done', _('Завершен')

    name = models.CharField(_('имя'), max_length=120)
    email = models.EmailField(_('email'))
    phone = models.CharField(_('телефон'), max_length=64, blank=True)
    message = models.TextField(_('сообщение'))
    locale = models.CharField(_('язык'), max_length=2, choices=Locale.choices, default=Locale.RU)
    status = models.CharField(_('статус'), max_length=16, choices=Status.choices, default=Status.NEW)
    created_at = models.DateTimeField(_('создано'), auto_now_add=True)
    updated_at = models.DateTimeField(_('обновлено'), auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = _('сообщение')
        verbose_name_plural = _('сообщения')

    def __str__(self):
        return f'{self.name} <{self.email}>'
