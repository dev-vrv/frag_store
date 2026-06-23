import random
from datetime import timedelta

from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone


def generate_email_verification_code():
    return f'{random.randint(0, 999999):06d}'


def send_email_verification_code(user):
    code = generate_email_verification_code()
    user.email_verification_code = code
    user.email_verification_expires_at = timezone.now() + timedelta(minutes=10)
    user.save(update_fields=['email_verification_code', 'email_verification_expires_at'])

    send_mail(
        subject='Frag Store email verification',
        message=(
            'Use this code to confirm email verification in Frag Store: '
            f'{code}. The code is valid for 10 minutes.'
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=False,
    )
