from django.db import models
from .constants import *


class Beneficiary(models.Model):   #Beneficiary model consisiting of following attributes. Each user will have one instance of this model for a particular day. 
    id = models.CharField(primary_key=True, blank=False, max_length=15)
    phone_number = models.PositiveBigIntegerField(db_index=True, blank=True,null=True)
    name = models.CharField(blank=True, max_length=50,null=True)
    birth_year = models.IntegerField(blank=True,null=True)
    gender = models.CharField(choices=GENDER_CHOICES, max_length=6,null=True)
    photo_id_type = models.CharField(blank=True, max_length=25,null=True,default=None)
    photo_id_number = models.CharField(blank=True, max_length=25,null=True,default=None)
    comorbidity_ind = models.CharField(blank=True, max_length=4,null=True,default=None)
    vaccination_status = models.CharField(blank=True, max_length=15,null=True,default=None)
    vaccine = models.CharField(blank=True, max_length=25, choices=VACCINE_CHOICES,null=True)
    dose1_date = models.DateField(blank=True, default=None, null=True)
    dose2_date = models.DateField(blank=True, default=None, null=True)
    # created_at = models.DateTimeField(auto_now_add=True)
    date = models.DateField(blank=True,default=None,null=True)

    class Meta:
        verbose_name_plural = "Beneficiaries"

    def __str__(self):
        return "{name} ({id})".format(name=self.name, id=self.id)


class Slot(models.Model):  #Slot model consisting of following attributes. There are 8 instances of this model for a particular day.
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


class Token(models.Model):  #Token model consisting of following attributes. Each booked user will a instance of this model associated with them for a particular day.
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