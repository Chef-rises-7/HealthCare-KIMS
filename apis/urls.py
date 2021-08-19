from django.urls import path, include
from .views import *


urlpatterns = [
    path('generateToken/', generateToken),
    path('getSlots/', getSlots),
    path('addSlots/',addSlots),
    path('getTokens/',getTokens)
]
