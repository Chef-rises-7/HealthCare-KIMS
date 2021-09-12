from django.db import models
from .constants import *


class Beneficiary(models.Model):
    id = models.CharField(primary_key=True, blank=False, max_length=15)
    phone_number = models.PositiveBigIntegerField(db_index=True, blank=False)
    name = models.CharField(blank=False, max_length=50)
    birth_year = models.IntegerField(blank=False)
    gender = models.CharField(choices=GENDER_CHOICES, max_length=6)
    photo_id_type = models.CharField(blank=False, max_length=25)
    photo_id_number = models.CharField(blank=False, max_length=25)
    comorbidity_ind = models.CharField(blank=False, max_length=4)
    vaccination_status = models.CharField(blank=False, max_length=15)
    vaccine = models.CharField(blank=True, max_length=25, choices=VACCINE_CHOICES)
    dose1_date = models.DateField(blank=True, default=None, null=True)
    dose2_date = models.DateField(blank=True, default=None, null=True)
    # created_at = models.DateTimeField(auto_now_add=True)
    date = models.DateField(blank=False,default=None)

    class Meta:
        verbose_name_plural = "Beneficiaries"

    def __str__(self):
        return "{name} ({id})".format(name=self.name, id=self.id)


class Slot(models.Model):
    id = models.AutoField(primary_key=True)
    vaccine = models.CharField(blank=False, choices=VACCINE_CHOICES, max_length=15)
    date = models.DateField(blank=False)
    # slot = models.CharField(blank=False, choices=SLOT_CHOICES, max_length=10)
    dose_choice = models.CharField(blank=False,choices=DOSE_CHOICES,max_length=25,default=None,null=True)
    age_group = models.CharField(blank=False, choices=AGE_GROUPS, max_length=10, default=None, null=True)
    availability = models.IntegerField(blank=False)
    booked = models.IntegerField(blank=False, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("vaccine", "date", 'age_group','dose_choice')

    def __str__(self):
        return "{date} ".format(date=self.date)


class Token(models.Model):
    id = models.AutoField(primary_key=True)
    registration_id = models.CharField(max_length=15, blank=False, default=None, null=True)
    token_number = models.IntegerField(blank=False)
    beneficiary = models.ForeignKey(Beneficiary, on_delete=models.CASCADE, blank=False)
    slot = models.ForeignKey(Slot, on_delete=models.CASCADE, blank=False, default=None, null=True)
    dose = models.CharField(blank=False, max_length=10, choices=DOSE_CHOICES)
    verified = models.BooleanField(blank=False, default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    date = models.DateField(blank=False,default=None)
    checked = models.IntegerField(blank=False, choices=CHECKED_CHOICES,default=0)
    name = models.CharField(blank=False, max_length=50,default=None)
    age = models.IntegerField(blank=False,default=0)
    vaccine = models.CharField(blank=False, choices=VACCINE_CHOICES, max_length=15,default='covishield')
    booked = models.IntegerField(blank=False, default=0)
    created_by = models.CharField(max_length=15, blank=False, default=None)