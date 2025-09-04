from django.apps import AppConfig


class MotivoappConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'motivoapp'
    
    def ready(self):
        import motivoapp.signals 