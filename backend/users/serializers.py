from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.utils import timezone
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken

from orders.serializers import OrderSerializer

from .models import ContactMessage, User
from .services import send_email_verification_code


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(read_only=True)
    personal_discount_percent = serializers.DecimalField(max_digits=5, decimal_places=2, read_only=True)
    email_verified = serializers.BooleanField(read_only=True)
    two_factor_enabled = serializers.BooleanField(read_only=True)
    pending_two_factor_enabled = serializers.BooleanField(read_only=True)

    class Meta:
        model = User
        fields = (
            'id',
            'email',
            'first_name',
            'last_name',
            'full_name',
            'phone',
            'city',
            'address',
            'personal_discount_percent',
            'email_verified',
            'two_factor_enabled',
            'pending_two_factor_enabled',
            'date_joined',
        )
        read_only_fields = ('id', 'full_name', 'date_joined')


class ProfileSerializer(UserSerializer):
    orders = OrderSerializer(many=True, read_only=True)

    class Meta(UserSerializer.Meta):
        fields = UserSerializer.Meta.fields + ('orders',)
        read_only_fields = fields


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    password_confirm = serializers.CharField(write_only=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = (
            'email',
            'first_name',
            'last_name',
            'phone',
            'password',
            'password_confirm',
        )

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({'password_confirm': 'Passwords do not match.'})

        user = User(
            email=attrs['email'],
            first_name=attrs['first_name'],
            last_name=attrs.get('last_name', ''),
            phone=attrs.get('phone', ''),
        )
        validate_password(attrs['password'], user)
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        return User.objects.create_user(password=password, **validated_data)


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    def validate(self, attrs):
        email = attrs.get('email', '').strip().lower()
        password = attrs.get('password')

        user = authenticate(
            request=self.context.get('request'),
            email=email,
            password=password,
        )

        if not user:
            raise AuthenticationFailed('Invalid email or password.')
        if not user.is_active:
            raise AuthenticationFailed('User account is disabled.')

        attrs['user'] = user
        return attrs


class AuthResponseSerializer(serializers.Serializer):
    access = serializers.CharField(read_only=True)
    refresh = serializers.CharField(read_only=True)
    user = UserSerializer(read_only=True)

    @staticmethod
    def build(user):
        refresh = RefreshToken.for_user(user)
        return {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data,
        }


class ProfileUpdateSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(read_only=True)

    class Meta:
        model = User
        fields = (
            'email',
            'first_name',
            'last_name',
            'phone',
            'city',
            'address',
            'two_factor_enabled',
        )

    def update(self, instance, validated_data):
        requested_two_factor = validated_data.pop('two_factor_enabled', instance.two_factor_enabled)

        for field, value in validated_data.items():
            setattr(instance, field, value)

        if requested_two_factor:
            if instance.email_verified:
                instance.two_factor_enabled = True
                instance.pending_two_factor_enabled = False
            else:
                instance.two_factor_enabled = False
                instance.pending_two_factor_enabled = True
                send_email_verification_code(instance)
        else:
            instance.two_factor_enabled = False
            instance.pending_two_factor_enabled = False
            instance.email_verification_code = ''
            instance.email_verification_expires_at = None

        instance.save()
        return instance


class EmailVerificationRequestSerializer(serializers.Serializer):
    def save(self, **kwargs):
        user = self.context['request'].user
        send_email_verification_code(user)
        return user


class EmailVerificationConfirmSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=6)

    def validate_code(self, value):
        code = value.strip()
        if len(code) != 6 or not code.isdigit():
            raise serializers.ValidationError('Enter a valid 6-digit code.')
        return code

    def validate(self, attrs):
        user = self.context['request'].user
        code = attrs['code']

        if not user.email_verification_code or not user.email_verification_expires_at:
            raise serializers.ValidationError({'code': 'Verification code was not requested.'})

        if timezone.now() > user.email_verification_expires_at:
            raise serializers.ValidationError({'code': 'Verification code has expired.'})

        if user.email_verification_code != code:
            raise serializers.ValidationError({'code': 'Invalid verification code.'})

        attrs['user'] = user
        return attrs

    def save(self, **kwargs):
        user = self.validated_data['user']
        user.email_verified = True
        if user.pending_two_factor_enabled:
            user.two_factor_enabled = True
        user.pending_two_factor_enabled = False
        user.email_verification_code = ''
        user.email_verification_expires_at = None
        user.save(
            update_fields=[
                'email_verified',
                'two_factor_enabled',
                'pending_two_factor_enabled',
                'email_verification_code',
                'email_verification_expires_at',
            ]
        )
        return user


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = (
            'id',
            'name',
            'email',
            'phone',
            'message',
            'locale',
            'created_at',
        )
        read_only_fields = ('id', 'created_at')
