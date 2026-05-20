from django.contrib import admin

from .models import BlogPost


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
            'Media',
            {
                'fields': (
                    'image',
                    'video',
                    'slug',
                    'is_published',
                )
            },
        ),
        ('Russian', {'fields': ('title_ru', 'text_ru')}),
        ('English', {'fields': ('title_en', 'text_en')}),
        ('Kyrgyz', {'fields': ('title_kg', 'text_kg')}),
    )
