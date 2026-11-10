from django.urls import path
from . import views

urlpatterns = [
    # Main AI Review page
    path("", views.ai_review, name="ai_review"),

    # Outfit analysis
    path("analyze/", views.analyze_outfit_view, name="analyze"),

    # AI Chat
    path("chat/", views.ai_chat_stylist, name="ai_chat_stylist"),

    # Save & Share Review
    path("save/", views.save_review_view, name="save_review"),
    path("share/<int:review_id>/", views.share_review_detail, name="share_review_detail"),

    # Chat Session APIs
    path("new/", views.new_chat, name="new_chat"),
    path("send/", views.send_message, name="send_message"),
    path("history/", views.chat_history, name="chat_history"),
    path("session/<int:id>/", views.load_session, name="load_session"),
    path("delete/<int:id>/", views.delete_chat, name="delete_chat"),
    path("latest/", views.latest_chat, name="latest_chat"),
]