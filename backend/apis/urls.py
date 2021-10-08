from django.urls import path, include
from .views import *


#URL's mapped with the corresponding API function.
urlpatterns = [
    path('generateToken/', generateToken),
    path('getSlots/', getSlots),
    path('addAndUpdateSlots/',addAndUpdateSlots),
    path('getTokens/',getTokens),
    path('getActiveSlots/',getActiveSlots)
]
