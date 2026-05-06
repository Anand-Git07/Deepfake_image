from django.urls import path
from .views import detect, export_report, history, scan_detail, stats

urlpatterns = [
    path("detect/", detect, name="detect"),
    path("history/", history, name="history"),
    path("scan/<int:scan_id>/", scan_detail, name="scan-detail"),
    path("scan/<int:scan_id>/report/", export_report, name="scan-report"),
    path("stats/", stats, name="stats"),
]
