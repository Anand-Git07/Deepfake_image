from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Scan",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("file", models.FileField(upload_to="scans/")),
                ("original_filename", models.CharField(max_length=255)),
                ("file_type", models.CharField(default="image", max_length=32)),
                ("verdict", models.CharField(choices=[("Deepfake", "Deepfake"), ("Authentic", "Authentic"), ("Uncertain", "Uncertain")], max_length=16)),
                ("confidence", models.FloatField()),
                ("facial_score", models.FloatField()),
                ("pixel_score", models.FloatField()),
                ("artifact_score", models.FloatField()),
                ("synthetic_score", models.FloatField()),
                ("face_box", models.JSONField(blank=True, default=dict)),
                ("width", models.PositiveIntegerField(default=0)),
                ("height", models.PositiveIntegerField(default=0)),
                ("file_size", models.PositiveIntegerField(default=0)),
                ("batch_id", models.CharField(blank=True, max_length=64)),
                ("model_version", models.CharField(default="deepguard-cnn-v2.4.1", max_length=64)),
                ("explanation", models.TextField(blank=True)),
                ("raw_output", models.JSONField(blank=True, default=dict)),
                ("processing_time_ms", models.PositiveIntegerField(default=0)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={"ordering": ["-created_at"]},
        ),
    ]
