# transcription/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('rahi', views.index, name='index'),
]