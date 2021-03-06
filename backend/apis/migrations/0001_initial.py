# Generated by Django 3.2.6 on 2021-08-09 17:28

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Beneficiary',
            fields=[
                ('id', models.PositiveBigIntegerField(primary_key=True, serialize=False)),
                ('phone_number', models.PositiveBigIntegerField(db_index=True)),
                ('name', models.CharField(max_length=50)),
                ('birth_year', models.IntegerField()),
                ('gender', models.CharField(choices=[['male', 'Male'], ['female', 'Female']], max_length=6)),
                ('photo_id_type', models.CharField(max_length=25)),
                ('photo_id_number', models.CharField(max_length=25)),
                ('comorbidity_ind', models.CharField(max_length=4)),
                ('vaccination_status', models.CharField(max_length=15)),
                ('vaccine', models.CharField(blank=True, max_length=25)),
                ('dose1_date', models.DateField(blank=True)),
                ('dose2_date', models.DateField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Slot',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('vaccine', models.CharField(choices=[['COVISHIELD', 'COVISHIELD'], ['COVAXIN', 'COVAXIN']], max_length=15)),
                ('date', models.DateField()),
                ('slot', models.CharField(choices=[['morning', 'Morning'], ['afternoon', 'Afternoon']], max_length=10)),
                ('availability', models.IntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'unique_together': {('vaccine', 'date', 'slot')},
            },
        ),
        migrations.CreateModel(
            name='Token',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('token_number', models.IntegerField()),
                ('date', models.DateField(editable=False)),
                ('dose', models.CharField(choices=[['dose1', 'Dose 1'], ['dose2', 'Dose 2']], max_length=10)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('beneficiary', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='apis.beneficiary')),
            ],
            options={
                'unique_together': {('token_number', 'date')},
            },
        ),
    ]
