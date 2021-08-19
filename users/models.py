from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    staffID = models.CharField(max_length=250,unique=True)
    password = models.CharField(max_length=250)
    username = None

    USERNAME_FIELD = 'staffID'
    REQUIRED_FIELDS = []