from django.contrib import admin

from .models import Scan


@admin.register(Scan)
class ScanAdmin(admin.ModelAdmin):
    list_display = ("id", "original_filename", "verdict", "confidence", "processing_time_ms", "created_at")
    list_filter = ("verdict", "created_at")
    search_fields = ("original_filename", "batch_id")
