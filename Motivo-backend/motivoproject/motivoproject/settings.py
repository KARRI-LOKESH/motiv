from pathlib import Path
from datetime import timedelta
import uuid
import stripe
import os

# ----------------------
# Base Directory
# ----------------------
BASE_DIR = Path(__file__).resolve().parent.parent

# ----------------------
# Security
# ----------------------
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "replace_me_your_secret_key_here")
DEBUG = False   # ✅ Disable in production
# ALLOWED_HOSTS = ["motiv-x199.onrender.com", "localhost", "127.0.0.1"]
ALLOWED_HOSTS = ["motiv-x199.onrender.com", "localhost", "127.0.0.1"]
  # Change in production
# ----------------------
# Installed Apps
# ----------------------
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",
    "motivoapp",
    "sellers",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",  # For blacklist support
]

# ----------------------
# Middleware
# ----------------------
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",  # MUST be first
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",  # ✅ whitenoise right after security
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# ----------------------
# URLs & Templates
# ----------------------
ROOT_URLCONF = "motivoproject.urls"
TEMPLATES = [{
    "BACKEND": "django.template.backends.django.DjangoTemplates",
    "DIRS": [],
    "APP_DIRS": True,
    "OPTIONS": {
        "context_processors": [
            "django.template.context_processors.debug",
            "django.template.context_processors.request",
            "django.contrib.auth.context_processors.auth",
            "django.contrib.messages.context_processors.messages",
        ]
    },
}]
WSGI_APPLICATION = "motivoproject.wsgi.application"

# ----------------------
# Database
# ----------------------
DB_ENGINE = "sqlite"
if DB_ENGINE == "postgres":
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": os.environ.get("DB_NAME", "motivo"),
            "USER": os.environ.get("DB_USER", "motivo"),
            "PASSWORD": os.environ.get("DB_PASSWORD", "motivo"),
            "HOST": os.environ.get("DB_HOST", "localhost"),
            "PORT": os.environ.get("DB_PORT", "5432"),
        }
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

# ----------------------
# Email Settings
# ----------------------
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = "karrilokesh108@gmail.com"
EMAIL_HOST_PASSWORD = "lydh rmgr gxzf pomi"

# ----------------------
# CORS
# ----------------------
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",                 # Local frontend
    "https://motivo-sepia.vercel.app",       # ✅ Vercel frontend
]
CORS_ALLOW_CREDENTIALS = True

# ----------------------
# DRF + JWT
# ----------------------
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticatedOrReadOnly",
    ),
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=4),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=90),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "AUTH_HEADER_TYPES": ("Bearer",),
    "AUTH_COOKIE": "refresh_token",
    "AUTH_COOKIE_SECURE": True,   # ✅ secure cookies in production
    "AUTH_COOKIE_HTTP_ONLY": True,
    "AUTH_COOKIE_PATH": "/",
    "AUTH_COOKIE_SAMESITE": "Lax",
}

# ----------------------
# Static & Media
# ----------------------
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
CSRF_TRUSTED_ORIGINS = ["https://motiv-x199.onrender.com"]
# ----------------------
# Localization
# ----------------------
LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Kolkata"
USE_I18N = True
USE_TZ = True















































# from pathlib import Path
# from datetime import timedelta
# import uuid
# import stripe

# # ----------------------
# # Base Directory
# # ----------------------
# BASE_DIR = Path(__file__).resolve().parent.parent

# # ----------------------
# # Security
# # ----------------------
# SECRET_KEY = "replace_me_your_secret_key_here"
# DEBUG = True
# ALLOWED_HOSTS = ["*"]  # Change in production

# # ----------------------
# # Installed Apps
# # ----------------------
# INSTALLED_APPS = [
#     "django.contrib.admin",
#     "django.contrib.auth",
#     "django.contrib.contenttypes",
#     "django.contrib.sessions",
#     "django.contrib.messages",
#     "django.contrib.staticfiles",
#     "rest_framework",
#     "corsheaders",
#     "motivoapp",
#     "sellers",
#     "rest_framework_simplejwt",
#     "rest_framework_simplejwt.token_blacklist",  # For blacklist support
# ]

# # ----------------------
# # Middleware
# # ----------------------
# MIDDLEWARE = [
#     "corsheaders.middleware.CorsMiddleware",  # MUST be first
#     "django.middleware.security.SecurityMiddleware",
#     "django.contrib.sessions.middleware.SessionMiddleware",
#     "django.middleware.common.CommonMiddleware",
#     "django.middleware.csrf.CsrfViewMiddleware",
#     "django.contrib.auth.middleware.AuthenticationMiddleware",
#     "django.contrib.messages.middleware.MessageMiddleware",
#     "django.middleware.clickjacking.XFrameOptionsMiddleware",
#     "whitenoise.middleware.WhiteNoiseMiddleware",
# ]

# # AUTH_USER_MODEL = 'sellers.Seller'

# # ----------------------
# # URLs & Templates
# # ----------------------
# ROOT_URLCONF = "motivoproject.urls"
# TEMPLATES = [{
#     "BACKEND": "django.template.backends.django.DjangoTemplates",
#     "DIRS": [],
#     "APP_DIRS": True,
#     "OPTIONS": {
#         "context_processors": [
#             "django.template.context_processors.debug",
#             "django.template.context_processors.request",
#             "django.contrib.auth.context_processors.auth",
#             "django.contrib.messages.context_processors.messages",
#         ]
#     },
# }]
# WSGI_APPLICATION = "motivoproject.wsgi.application"

# # ----------------------
# # Database
# # ----------------------
# DB_ENGINE = "sqlite"
# if DB_ENGINE == "postgres":
#     DATABASES = {
#         "default": {
#             "ENGINE": "django.db.backends.postgresql",
#             "NAME": "motivo",
#             "USER": "motivo",
#             "PASSWORD": "motivo",
#             "HOST": "localhost",
#             "PORT": "5432",
#         }
#     }
# else:
#     DATABASES = {
#         "default": {
#             "ENGINE": "django.db.backends.sqlite3",
#             "NAME": BASE_DIR / "db.sqlite3",
#         }
#     }

# # ----------------------
# # Email Settings
# # ----------------------
# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
# EMAIL_HOST = 'smtp.gmail.com'
# EMAIL_PORT = 587
# EMAIL_USE_TLS = True
# EMAIL_HOST_USER = "karrilokesh108@gmail.com"
# EMAIL_HOST_PASSWORD = "lydh rmgr gxzf pomi"

# # ----------------------
# # CORS
# # ----------------------
# CORS_ALLOWED_ORIGINS = [
#     "http://localhost:5173",
# ]
# CORS_ALLOW_CREDENTIALS = True  # Important for cookies

# # ----------------------
# # DRF + JWT
# # ----------------------
# REST_FRAMEWORK = {
#     "DEFAULT_AUTHENTICATION_CLASSES": (
#         "rest_framework_simplejwt.authentication.JWTAuthentication",
#     ),
#     "DEFAULT_PERMISSION_CLASSES": (
#         "rest_framework.permissions.IsAuthenticatedOrReadOnly",
#     ),
# }

# SIMPLE_JWT = {
#     "ACCESS_TOKEN_LIFETIME": timedelta(hours=4),
#     "REFRESH_TOKEN_LIFETIME": timedelta(days=90),    # Persistent login
#     "ROTATE_REFRESH_TOKENS": True,
#     "BLACKLIST_AFTER_ROTATION": True,
#     "AUTH_HEADER_TYPES": ("Bearer",),
#     "AUTH_COOKIE": "refresh_token",                     # Refresh token cookie
#     "AUTH_COOKIE_SECURE": False,                        # True in production (HTTPS)
#     "AUTH_COOKIE_HTTP_ONLY": True,                      # Prevent JS access
#     "AUTH_COOKIE_PATH": "/",
#     "AUTH_COOKIE_SAMESITE": "Lax",
# }

# # ----------------------
# # Static & Media
# # ----------------------
# STATIC_URL = "/static/"
# STATIC_ROOT = BASE_DIR / "staticfiles"
# STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
# MEDIA_URL = "/media/"
# MEDIA_ROOT = BASE_DIR / "media"
# DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# # ----------------------
# # Localization
# # ----------------------
# LANGUAGE_CODE = "en-us"
# TIME_ZONE = "Asia/Kolkata"
# USE_I18N = True
# USE_TZ = True
