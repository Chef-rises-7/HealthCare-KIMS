# Generated by Django 3.2.6 on 2021-08-29 08:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='user',
            old_name='staffID',
            new_name='username',
        ),
    ]
