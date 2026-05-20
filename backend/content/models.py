from django.db import models
from django.utils.text import slugify


class BlogPost(models.Model):
    image = models.ImageField(upload_to='blog/images/')
    video = models.FileField(upload_to='blog/videos/', blank=True, null=True)
    slug = models.SlugField(max_length=180, unique=True, blank=True)

    title_ru = models.CharField(max_length=255)
    title_en = models.CharField(max_length=255)
    title_kg = models.CharField(max_length=255)

    text_ru = models.TextField()
    text_en = models.TextField()
    text_kg = models.TextField()

    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'blog post'
        verbose_name_plural = 'blog posts'

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
