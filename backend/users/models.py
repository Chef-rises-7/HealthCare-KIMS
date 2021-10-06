from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    password = models.CharField(max_length=250)
    username = models.CharField(max_length=250,unique=True)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []