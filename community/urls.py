from django.urls import path
from . import views

urlpatterns = [
    path("", views.community, name="community"),
    path("create-post/", views.create_post, name="create_post"),

    path(
        "like/<int:post_id>/",
        views.like_post,
        name="like_post",
    ),
    path(
    "comment/<int:post_id>/",
    views.add_comment,
    name="add_comment",
),
]