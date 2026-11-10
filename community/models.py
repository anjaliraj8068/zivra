from django.db import models
from django.contrib.auth.models import User

class Post(models.Model):

    POST_TYPES = [
        ('image', 'Image'),
        ('question', 'Question'),
        ('poll', 'Poll'),
    ]

    VISIBILITY = [
        ('public', 'Public'),
        ('friends', 'Friends'),
        ('private', 'Private'),
    ]

    user = models.ForeignKey(
    User,
    on_delete=models.CASCADE,
    related_name="community_posts"
)

    post_type = models.CharField(max_length=20, choices=POST_TYPES)

    caption = models.TextField(blank=True)

    occasion = models.CharField(max_length=100, blank=True)
    style = models.CharField(max_length=100, blank=True)
    location = models.CharField(max_length=100, blank=True)
    hashtags = models.ManyToManyField('Hashtag', blank=True)

    visibility = models.CharField(
        max_length=20,
        choices=VISIBILITY,
        default='public'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.post_type}"
    
class ImagePost(models.Model):

    post = models.OneToOneField(
        Post,
        on_delete=models.CASCADE
    )

    image = models.ImageField(
        upload_to='community_images/'
    )

    def __str__(self):
        return f"Image Post {self.post.id}"
    
class QuestionPost(models.Model):

    post = models.OneToOneField(
        Post,
        on_delete=models.CASCADE
    )

    question = models.TextField()

    def __str__(self):
        return self.question[:40]
    
class PollPost(models.Model):

    post = models.OneToOneField(
        Post,
        on_delete=models.CASCADE
    )

    image = models.ImageField(
        upload_to='poll_images/',
        blank=True,
        null=True
    )

    def __str__(self):
        return f"Poll {self.post.id}"
    
class PollOption(models.Model):

    poll = models.ForeignKey(
        PollPost,
        on_delete=models.CASCADE,
        related_name='options'
    )

    option_text = models.CharField(max_length=200)

    votes = models.IntegerField(default=0)

    def __str__(self):
        return self.option_text
    
class Hashtag(models.Model):

    name = models.CharField(
        max_length=50,
        unique=True
    )

    def __str__(self):
        return self.name
    
class Like(models.Model):

    user = models.ForeignKey(
    User,
    on_delete=models.CASCADE,
    related_name="liked_posts"
)

    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} liked Post {self.post.id}"
    
class Comment(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="comments"
    )

    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name="comments"
    )

    comment = models.TextField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.user.username}: {self.comment[:30]}"

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="comments"
    )

    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name="comments"
    )

    comment = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}: {self.comment[:30]}"  
class PollVote(models.Model):

    user = models.ForeignKey(
    User,
    on_delete=models.CASCADE,
    related_name="poll_votes"
)

    option = models.ForeignKey(
        PollOption,
        on_delete=models.CASCADE
    )

    voted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} voted for {self.option.option_text}"
    
    # like
class Like(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="likes"
    )

    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name="likes"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "post")