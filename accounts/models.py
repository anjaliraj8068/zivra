from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver



class UserProfile(models.Model):
    GENDER_CHOICES = [
        ("male", "male"),
        ("female", "female"),
        ("other", "other"),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)

    profile_picture = models.ImageField(
        upload_to="profile_pictures/",
        blank=True,
        null=True
    )

    phone = models.CharField(max_length=15, blank=True)

    dob = models.DateField(blank=True, null=True)

    gender = models.CharField(
        max_length=10,
        choices=GENDER_CHOICES,
        blank=True
    )

    height = models.DecimalField(
        max_digits=4,
        decimal_places=1,
        blank=True,
        null=True
    )

    city = models.CharField(max_length=100, blank=True)

    country = models.CharField(max_length=100, blank=True)

    bio = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.username
    


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    if hasattr(instance, "userprofile"):
        instance.userprofile.save()


class ContactMessage(models.Model):
    PURPOSE_CHOICES = [
        ('general', 'General Question'),
        ('feedback', 'Feedback'),
        ('bug', 'Report a Problem'),
        ('feature', 'Feature Suggestion'),
        ('account', 'Account Issue'),
        ('shopping', 'Shopping / Product Question'),
        ('community', 'Community Issue'),
        ('ai', 'AI Review Issue'),
        ('other', 'Other'),
    ]

    name = models.CharField(max_length=150)
    email = models.EmailField()
    purpose = models.CharField(max_length=30, choices=PURPOSE_CHOICES)
    subject = models.CharField(max_length=255, blank=True)
    description = models.TextField(max_length=1000)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.subject or self.purpose}"