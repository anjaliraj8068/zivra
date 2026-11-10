from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from .models import UserProfile
from django.http import JsonResponse
from .models import ContactMessage

from django.shortcuts import render

def custom_403(request, exception):
    return render(request, "403.html", status=403)
def register_view(request):
    if request.method == "POST":

        fullname = request.POST.get("fullname", "").strip()
        username = request.POST.get("username", "").strip()
        email = request.POST.get("email", "").strip()
        password = request.POST.get("password")
        confirm_password = request.POST.get("confirm_password")

        # Validate password
        
        if password != confirm_password:
            messages.error(request, "Passwords do not match.")
            return redirect("register")

        # Validate username (case-insensitive)
        if User.objects.filter(username__iexact=username).exists():
            messages.error(request, "Username is already taken. Please choose another.")
            return redirect("register")

        # Validate email (case-insensitive)
        if User.objects.filter(email__iexact=email).exists():
            messages.error(request, "Email is already registered.")
            return redirect("register")

        # Create user
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )

        user.first_name = fullname
        user.save()

        messages.success(request, "Registration successful! Please login.")
        return redirect("login")

    return render(request, "register.html")


def login_view(request):

    if request.method == "POST":

        email = request.POST.get("email", "").strip()
        password = request.POST.get("password")

        try:
            user_obj = User.objects.get(email__iexact=email)

            user = authenticate(
                request,
                username=user_obj.username,
                password=password
            )

            if user is not None:
                login(request, user)
                return redirect("home")
            else:
                messages.error(request, "Incorrect password.")

        except User.DoesNotExist:
            messages.error(request, "Email not registered.")

    return render(request, "login.html")


def logout_view(request):
    from django.contrib.auth import logout
    logout(request)
    return redirect("login")

@login_required
def profile(request):

    profile, created = UserProfile.objects.get_or_create(
        user=request.user
    )

    if request.method == "POST":

        request.user.first_name = request.POST.get("fullname")

        request.user.save()

        profile.phone = request.POST.get("phone")

        profile.dob = request.POST.get("dob")

        profile.gender = request.POST.get("gender")

        profile.height = request.POST.get("height")

        profile.city = request.POST.get("city")

        profile.country = request.POST.get("country")

        if request.FILES.get("profile_picture"):

            profile.profile_picture = request.FILES["profile_picture"]

        profile.save()

        messages.success(request, "Profile updated successfully.")

        return redirect("profile")

    context = {

        "profile": profile

    }

    return render(request, "profile.html", context)

def contact(request):
    return render(request, "contact.html")
from django.shortcuts import redirect
from .models import ContactMessage


def submit_contact(request):
    if request.method != 'POST':
        return redirect('contact')

    name = request.POST.get('name', '').strip()
    email = request.POST.get('email', '').strip()
    purpose = request.POST.get('purpose', '').strip()
    subject = request.POST.get('subject', '').strip()
    description = request.POST.get('description', '').strip()

    # Basic server-side validation
    if not name:
        return redirect('contact')

    if not email:
        return redirect('contact')

    if not purpose:
        return redirect('contact')

    if len(description) < 20:
        return redirect('contact')

    # Save to database
    ContactMessage.objects.create(
        name=name,
        email=email,
        purpose=purpose,
        subject=subject,
        description=description
    )

    # Return to the contact page
    return redirect('contact')