from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("grooming/", views.grooming, name="grooming"),
    path("wardrobe/", views.wardrobe, name="wardrobe"),
]