from rest_framework import serializers

from .models import Scan


class ScanSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    signals = serializers.SerializerMethodField()
    processing_time = serializers.SerializerMethodField()
    size_label = serializers.SerializerMethodField()
    resolution = serializers.SerializerMethodField()
    visual_steps = serializers.SerializerMethodField()
    frame_timeline = serializers.SerializerMethodField()
    result = serializers.SerializerMethodField()

    class Meta:
        model = Scan
        fields = [
            "id",
            "file",
            "file_url",
            "original_filename",
            "file_type",
            "verdict",
            "result",
            "confidence",
            "signals",
            "facial_score",
            "pixel_score",
            "artifact_score",
            "synthetic_score",
            "face_box",
            "width",
            "height",
            "resolution",
            "file_size",
            "size_label",
            "batch_id",
            "model_version",
            "explanation",
            "raw_output",
            "visual_steps",
            "frame_timeline",
            "processing_time",
            "processing_time_ms",
            "created_at",
        ]

    def get_file_url(self, obj):
        request = self.context.get("request")
        if not obj.file:
            return ""
        url = obj.file.url
        return request.build_absolute_uri(url) if request else url

    def get_signals(self, obj):
        return {
            "facial": round(obj.facial_score, 1),
            "pixel": round(obj.pixel_score, 1),
            "artifacts": round(obj.artifact_score, 1),
            "synthetic": round(obj.synthetic_score, 1),
        }

    def get_processing_time(self, obj):
        return f"{obj.processing_time_ms}ms"

    def get_size_label(self, obj):
        size = obj.file_size
        if size >= 1024 * 1024:
            return f"{size / (1024 * 1024):.1f} MB"
        return f"{size / 1024:.1f} KB"

    def get_resolution(self, obj):
        return f"{obj.width}x{obj.height}" if obj.width and obj.height else "Unknown"

    def get_result(self, obj):
        if obj.verdict == "Deepfake":
            return "Fake"
        if obj.verdict == "Authentic":
            return "Real"
        return "Uncertain"

    def get_visual_steps(self, obj):
        return self._absolute_media(obj.raw_output.get("visual_steps", []))

    def get_frame_timeline(self, obj):
        return self._absolute_media(obj.raw_output.get("frame_timeline", []))

    def _absolute_media(self, value):
        request = self.context.get("request")
        if isinstance(value, str):
            if request and value.startswith("/media/"):
                return request.build_absolute_uri(value)
            return value
        if isinstance(value, list):
            return [self._absolute_media(item) for item in value]
        if isinstance(value, dict):
            return {key: self._absolute_media(item) for key, item in value.items()}
        return value
