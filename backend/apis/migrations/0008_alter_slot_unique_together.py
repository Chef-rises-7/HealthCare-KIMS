# Generated by Django 3.2.6 on 2021-08-29 15:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('apis', '0007_auto_20210829_1955'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='slot',
            unique_together={('vaccine', 'date', 'age_group', 'dose_choice')},
        ),
    ]
