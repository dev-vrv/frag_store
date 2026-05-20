from rest_framework import viewsets

from .models import BlogPost
from .serializers import BlogPostSerializer


class BlogPostViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = BlogPostSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        return BlogPost.objects.filter(is_published=True).order_by('-created_at')
