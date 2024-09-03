import os
from .settings import *
from .settings import BASE_DIR

ALLOWED_HOSTS = [os.environ['WEBSITE_HOSTNAME'], 'vendtuneapp.azurewebsites.net']
CSRF_TRUSTED_ORIGINS = ['https://'+os.environ['WEBSITE_HOSTNAME'], 'https://vendtuneapp.azurewebsites.net']
DEBUG = False
SECRET_KEY = os.environ['DJANGO_KEY']

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    'whitenoise.middleware.WhiteNoiseMiddleware',
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedStaticFilesStorage",
    },
}

CONNECTION = os.environ['AZURE_POSTGRESQL_CONNECTIONSTRING']
CONNECTION_STR = {pair.split('=')[0]:pair.split('=')[1] for pair in CONNECTION.split(' ')}

DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': CONNECTION_STR['database'],
        'USER': CONNECTION_STR['user'],
        'PASSWORD': CONNECTION_STR['password'],
        'PORT': CONNECTION_STR['port'],
        'HOST': CONNECTION_STR['host'],
        'OPTIONS': {
            'sslmode': 'require',
            'options': '-c search_path=vendtune'
        }
    }
}

STATIC_ROOT = BASE_DIR/'staticfiles'
