from django.contrib import admin
from .models import (
    Post,
    ImagePost,
    QuestionPost,
    PollPost,
    PollOption,
    Like, 
    Comment,
    PollVote
)

admin.site.register(Post)
admin.site.register(ImagePost)
admin.site.register(QuestionPost)
admin.site.register(PollPost)
admin.site.register(PollOption)
admin.site.register(Like)
admin.site.register(Comment)
admin.site.register(PollVote)