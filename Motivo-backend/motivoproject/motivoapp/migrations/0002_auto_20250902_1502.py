from django.db import migrations
from django.utils.text import slugify
import uuid


def add_categories(apps, schema_editor):
    Category = apps.get_model("motivoapp", "Category")
    categories = [
        "Toys",
        "Kids Clothing",
        "Baby Care",
        "Sports",
        "Stationary",
        "Arts & Crafts",
    ]
    for name in categories:
        slug = slugify(name)
        # Ensure slug is unique
        while Category.objects.filter(slug=slug).exists():
            slug = f"{slug}-{uuid.uuid4().hex[:6]}"

        Category.objects.get_or_create(name=name, defaults={"slug": slug})


class Migration(migrations.Migration):

    dependencies = [
        ("motivoapp", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(add_categories),
    ]
