from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.db.models import Q

from .models import Comment

from .models import (
    Post,
    ImagePost,
    Hashtag,
    Like,
)

@login_required
def community(request):

    posts = (
        Post.objects
        .select_related("user")
        .prefetch_related("hashtags", "imagepost")
        .order_by("-created_at")
    )

    search = request.GET.get("search")

    if search:
        posts = posts.filter(
            Q(caption__icontains=search) |
            Q(location__icontains=search) |
            Q(user__username__icontains=search)
        )

    if request.GET.get("mine") == "1":
        posts = posts.filter(user=request.user)

    return render(
        request,
        "community.html",
        {
            "posts": posts,
            "search": search,
        },
    )

@login_required
def create_post(request):

    if request.method == "POST":

        post_type = request.POST.get("post_type")

        caption = request.POST.get("caption")
        occasion = request.POST.get("occasion")
        style = request.POST.get("style") or ""
        location = request.POST.get("location")
        visibility = request.POST.get("visibility")

        post = Post.objects.create(
            user=request.user,
            post_type=post_type,
            caption=caption,
            occasion=occasion,
            style=style,
            location=location,
            visibility=visibility,
        )

        hashtags = request.POST.get("hashtags")

        if hashtags:

            for tag in hashtags.split():

                tag = tag.replace("#", "")

                hashtag, _ = Hashtag.objects.get_or_create(
                    name=tag
                )

                post.hashtags.add(hashtag)

        if post_type == "image":

            if request.FILES.get("image"):

                ImagePost.objects.create(
                    post=post,
                    image=request.FILES["image"]
                )

        return redirect("community")

    return redirect("community")

@login_required
def like_post(request, post_id):

    post = get_object_or_404(Post, id=post_id)

    like, created = Like.objects.get_or_create(
        user=request.user,
        post=post
    )

    if created:
        liked = True
    else:
        like.delete()
        liked = False

    likes_count = Like.objects.filter(post=post).count()

    return JsonResponse({
        "liked": liked,
        "likes": likes_count,
    })


@login_required
def add_comment(request, post_id):

    if request.method != "POST":
        return JsonResponse({"success": False})

    post = Post.objects.get(id=post_id)

    text = request.POST.get("comment")

    if not text:
        return JsonResponse({"success": False})

    comment = Comment.objects.create(
        user=request.user,
        post=post,
        comment=text
    )

    return JsonResponse({
        "success": True,
        "comment": {
            "id": comment.id,
            "user": request.user.get_full_name() or request.user.username,
            "avatar": request.user.userprofile.profile_picture.url if request.user.userprofile.profile_picture else "/static/images/default-profile.png",
            "text": comment.comment,
            "time": "Just now",
            "likes": 0
        }
    })

    if request.method == "POST":

        post = Post.objects.get(id=post_id)

        comment_text = request.POST.get("comment")

        if comment_text:

            comment = Comment.objects.create(
                post=post,
                user=request.user,
                comment=comment_text
            )

            return JsonResponse({
                "success": True,
                "comment": {
                    "user": request.user.username,
                    "comment": comment.comment
                },
                "count": post.comments.count()
            })

    return JsonResponse({"success": False})