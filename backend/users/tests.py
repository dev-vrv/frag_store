from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from .models import Notification


class NotificationApiTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(email='owner@example.com', password='strong-test-password', first_name='Owner')
        other_user = get_user_model().objects.create_user(email='other@example.com', password='strong-test-password', first_name='Other')
        self.notification = Notification.objects.create(user=self.user, title='Required title', text='Required notification text')
        Notification.objects.create(user=other_user, title='Private', text='Private text')
        self.client = APIClient()
        self.client.force_authenticate(self.user)

    def test_list_is_scoped_to_current_user(self):
        response = self.client.get('/api/users/notifications/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], self.notification.id)

    def test_mark_read_updates_status_and_counter(self):
        response = self.client.post(f'/api/users/notifications/{self.notification.id}/mark-read/')
        self.assertEqual(response.status_code, 200)
        self.notification.refresh_from_db()
        self.assertEqual(self.notification.status, Notification.Status.READ)
        self.assertIsNotNone(self.notification.read_at)
        self.assertEqual(self.client.get('/api/users/notifications/unread-count/').data['count'], 0)
