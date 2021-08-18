from django.contrib import admin
from django.contrib.admin.templatetags.admin_urls import admin_urlname
from django.shortcuts import resolve_url
from django.utils.html import format_html
from django.utils.safestring import SafeText
from .models import *

admin.site.site_header = "Euprime Admin Dashboard"


def model_admin_url(obj, name=None) -> str:
    url = resolve_url(admin_urlname(obj._meta, SafeText("change")), obj.pk)
    return format_html('<a href="{}">{}</a>', url, name or str(obj))
@admin.register(Beneficiary)
class Beneficiary(admin.ModelAdmin):
    list_display = ("name", "gender", "vaccine", "vaccination_status")
    search_fields = ("name", "id")
    ordering = ("name", "id")
    list_filter = ("gender", "vaccine", "vaccination_status")

@admin.register(Slot)
class Slot(admin.ModelAdmin):
    list_display = ("date", "slot", "age_group", "vaccine", "availability", "booked")
    search_fields = ("date", "slot")
    ordering = ("date", "id")
    list_filter = ("slot", "age_group", "vaccine")

@admin.register(Token)
class Token(admin.ModelAdmin):
    list_display = ("registration_id", "Beneficiary", "Slot", "dose", "token_number")
    search_fields = ("registration_id", "token_number")
    ordering = ("registration_id", "token_number")
    list_filter = ("dose",)

    def Slot(self, obj):
        return model_admin_url(obj.slot)

    def Beneficiary(self, obj):
        return model_admin_url(obj.beneficiary)