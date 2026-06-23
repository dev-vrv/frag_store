from django.contrib import admin

from .models import BlogPost, ContactInfo


@admin.register(ContactInfo)
class ContactInfoAdmin(admin.ModelAdmin):
    list_display = ('locale', 'phone', 'email', 'address', 'is_active', 'updated_at')
    list_filter = ('locale', 'is_active')
    search_fields = ('phone', 'email', 'address', 'working_hours')
    fieldsets = (
        ('Локализация', {'fields': ('locale', 'is_active')}),
        ('Основные контакты', {'fields': ('phone', 'email', 'address', 'working_hours')}),
        (
            'Социальные ссылки',
            {
                'fields': (
                    'whatsapp',
                    'telegram',
                    'instagram',
                    'facebook',
                    'youtube',
                    'tiktok',
                    'x',
                )
            },
        ),
        ('Дополнительные контакты', {'fields': ('extra_contacts',)}),
    )


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title_ru', 'slug', 'is_published', 'created_at')
    list_filter = ('is_published', 'created_at')
    prepopulated_fields = {'slug': ('title_en',)}
    search_fields = (
        'title_ru',
        'title_en',
        'title_kg',
        'text_ru',
        'text_en',
        'text_kg',
    )
    fieldsets = (
        (
            'Медиа',
            {
                'fields': (
                    'image',
                    'video',
                    'slug',
                    'is_published',
                )
            },
        ),
        ('Русский', {'fields': ('title_ru', 'text_ru')}),
        ('Английский', {'fields': ('title_en', 'text_en')}),
        ('Кыргызский', {'fields': ('title_kg', 'text_kg')}),
    )
