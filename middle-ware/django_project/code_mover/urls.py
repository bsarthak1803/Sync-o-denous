from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'code_mover/?$',views.code_mover)
]