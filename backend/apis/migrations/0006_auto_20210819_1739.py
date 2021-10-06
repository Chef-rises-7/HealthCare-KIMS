# Generated by Django 3.2.6 on 2021-08-19 12:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apis', '0005_token_verified'),
    ]

    operations = [
        migrations.AddField(
            model_name='slot',
            name='dose_choice',
            field=models.CharField(choices=[['dose1', 'Dose 1'], ['dose2', 'Dose 2']], default=None, max_length=25, null=True),
        ),
        migrations.AlterField(
            model_name='beneficiary',
            name='vaccine',
            field=models.CharField(blank=True, choices=[['covishield', 'Covishield'], ['covaxin', 'Covaxin']], max_length=25),
        ),
        migrations.AlterField(
            model_name='slot',
            name='vaccine',
            field=models.CharField(choices=[['covishield', 'Covishield'], ['covaxin', 'Covaxin']], max_length=15),
        ),
    ]