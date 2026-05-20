from rest_framework import mixins, viewsets
from rest_framework.permissions import AllowAny

from .models import BlogPost, ContactInfo
from .serializers import BlogPostSerializer, ContactInfoSerializer


class ContactInfoViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    serializer_class = ContactInfoSerializer
    permission_classes = (AllowAny,)

    def get_queryset(self):
        queryset = ContactInfo.objects.filter(is_active=True)
        locale = self.request.query_params.get('locale')

        if locale in ContactInfo.Locale.values:
            return queryset.filter(locale=locale)

        return queryset


class BlogPostViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = BlogPostSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        return BlogPost.objects.filter(is_published=True).order_by('-created_at')
