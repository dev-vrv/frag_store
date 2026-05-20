from django.db import models


class ContactMessage(models.Model):
    class Locale(models.TextChoices):
        RU = 'ru', 'Russian'
        EN = 'en', 'English'
        KG = 'kg', 'Kyrgyz'

    class Status(models.TextChoices):
        NEW = 'new', 'New'
        IN_PROGRESS = 'in_progress', 'In progress'
        DONE = 'done', 'Done'

    name = models.CharField(max_length=120)
    email = models.EmailField()
    phone = models.CharField(max_length=64, blank=True)
    message = models.TextField()
    locale = models.CharField(max_length=2, choices=Locale.choices, default=Locale.RU)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.NEW)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'contact message'
        verbose_name_plural = 'contact messages'

    def __str__(self):
        return f'{self.name} <{self.email}>'
