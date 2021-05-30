from .views import SequenceViewSet
from rest_framework import routers
from django.urls import path, include

app_name = 'api-sequences'

router = routers.DefaultRouter()
router.register(r'sequences', SequenceViewSet)

urlpatterns = [
    path('', include(router.urls))
]