from django.db import models


class Scan(models.Model):
    class Verdict(models.TextChoices):
        DEEPFAKE = "Deepfake", "Deepfake"
        AUTHENTIC = "Authentic", "Authentic"
        UNCERTAIN = "Uncertain", "Uncertain"

    file = models.FileField(upload_to="scans/")
    original_filename = models.CharField(max_length=255)
    file_type = models.CharField(max_length=32, default="image")
    verdict = models.CharField(max_length=16, choices=Verdict.choices)
    confidence = models.FloatField()
    facial_score = models.FloatField()
    pixel_score = models.FloatField()
    artifact_score = models.FloatField()
    synthetic_score = models.FloatField()
    face_box = models.JSONField(default=dict, blank=True)
    width = models.PositiveIntegerField(default=0)
    height = models.PositiveIntegerField(default=0)
    file_size = models.PositiveIntegerField(default=0)
    batch_id = models.CharField(max_length=64, blank=True)
    model_version = models.CharField(max_length=64, default="deepguard-cnn-v2.4.1")
    explanation = models.TextField(blank=True)
    raw_output = models.JSONField(default=dict, blank=True)
    processing_time_ms = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.original_filename} - {self.verdict} ({self.confidence:.1f}%)"
