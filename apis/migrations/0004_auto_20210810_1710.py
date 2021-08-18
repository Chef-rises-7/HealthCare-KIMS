# Generated by Django 3.2.6 on 2021-08-10 11:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apis', '0003_auto_20210810_1652'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='beneficiary',
            options={'verbose_name_plural': 'Beneficiaries'},
        ),
        migrations.AlterField(
            model_name='beneficiary',
            name='gender',
            field=models.CharField(choices=[['Male', 'Male'], ['Female', 'Female']], max_length=6),
        ),
        migrations.AlterField(
            model_name='beneficiary',
            name='vaccine',
            field=models.CharField(blank=True, choices=[['COVISHIELD', 'COVISHIELD'], ['COVAXIN', 'COVAXIN']], max_length=25),
        ),
        migrations.AlterField(
            model_name='slot',
            name='age_group',
            field=models.CharField(choices=[['18to45', '18 To 45'], ['45plus', '45 +']], default=None, max_length=10, null=True),
        ),
    ]
