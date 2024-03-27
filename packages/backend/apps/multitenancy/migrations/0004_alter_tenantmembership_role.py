# Generated by Django 4.2 on 2024-03-27 12:34

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('multitenancy', '0003_alter_tenantmembership_unique_together_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tenantmembership',
            name='role',
            field=models.CharField(
                choices=[('OWNER', 'Owner'), ('ADMIN', 'Administrator'), ('MEMBER', 'Member')], default='OWNER'
            ),
        ),
    ]