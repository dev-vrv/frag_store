from rest_framework import serializers

from .models import BlogPost


class BlogPostSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    video = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = (
            'id',
            'slug',
            'image',
            'video',
            'title_ru',
            'title_en',
            'title_kg',
            'text_ru',
            'text_en',
            'text_kg',
            'created_at',
            'updated_at',
        )

    def get_image(self, obj):
        return self._absolute_media_url(obj.image)

    def get_video(self, obj):
        return self._absolute_media_url(obj.video)

    def _absolute_media_url(self, field):
        if not field:
            return None

        url = field.url
        request = self.context.get('request')

        if request:
            return request.build_absolute_uri(url)

        return url
