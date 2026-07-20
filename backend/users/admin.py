from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import ContactMessage, Notification, User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    ordering = ('-date_joined',)
    list_display = (
        'email',
        'first_name',
        'last_name',
        'phone',
        'personal_discount_percent',
        'email_verified',
        'two_factor_enabled',
        'is_staff',
        'is_active',
    )
    list_filter = ('is_staff', 'is_active', 'is_superuser', 'email_verified', 'two_factor_enabled', 'date_joined')
    search_fields = ('email', 'first_name', 'last_name', 'phone', 'city', 'address')
    readonly_fields = ('last_login', 'date_joined', 'email_verification_expires_at')

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (
            'Личные данные',
            {
                'fields': (
                    'first_name',
                    'last_name',
                    'phone',
                    'city',
                    'address',
                    'personal_discount_percent',
                )
            },
        ),
        (
            'Безопасность',
            {
                'fields': (
                    'email_verified',
                    'two_factor_enabled',
                    'pending_two_factor_enabled',
                    'email_verification_code',
                    'email_verification_expires_at',
                )
            },
        ),
        ('Права доступа', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Важные даты', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (
            None,
            {
                'classes': ('wide',),
                'fields': ('email', 'first_name', 'last_name', 'phone', 'city', 'address', 'password1', 'password2'),
            },
        ),
    )


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'locale', 'status', 'created_at')
    list_filter = ('locale', 'status', 'created_at')
    search_fields = ('name', 'email', 'phone', 'message')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'notification_type', 'status', 'created_at', 'read_at')
    list_filter = ('notification_type', 'status', 'created_at')
    search_fields = ('title', 'text', 'user__email')
    readonly_fields = ('created_at', 'updated_at', 'read_at')
    autocomplete_fields = ('user',)
