# Generated by Django 3.2.6 on 2021-08-29 14:25

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('apis', '0006_auto_20210819_1739'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='slot',
            unique_together={('vaccine', 'date', 'age_group')},
        ),
        migrations.RemoveField(
            model_name='slot',
            name='slot',
        ),
    ]
