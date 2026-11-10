from django.shortcuts import render
from django.contrib.auth.decorators import login_required

@login_required(login_url='login')
def home(request):
    user = request.user
    return render(request, "home.html", {
        "user": user
    })


def wardrobe(request):
    return render(request, "wardrobe.html")

def grooming(request):
    return render(request, "grooming.html")