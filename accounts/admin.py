from django.contrib import admin
from .models import UserProfile
from .models import ContactMessage


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "profile_picture",
        "phone",
        "city",
        "country",
    )


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'purpose', 'subject', 'created_at')
    list_filter = ('purpose', 'created_at')
    search_fields = ('name', 'email', 'subject', 'description')
    ordering = ('-created_at',)