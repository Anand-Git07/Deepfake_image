from django.db.models import Avg, Count
from django.http import FileResponse, Http404
from django.utils.dateparse import parse_date
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework import status

from ml.inference import DeepfakeDetector

from .models import Scan
from .reports import build_pdf_report
from .serializers import ScanSerializer

detector = DeepfakeDetector()


@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def detect(request):
    files = request.FILES.getlist("files") or request.FILES.getlist("file")
    if not files and request.FILES.get("image"):
        files = [request.FILES["image"]]
    if not files:
        return Response({"detail": "Upload at least one image or video."}, status=status.HTTP_400_BAD_REQUEST)

    batch_id = request.data.get("batch_id", "")
    scans = []
    for uploaded_file in files:
        result = detector.analyze(uploaded_file)
        scan = Scan.objects.create(
            file=uploaded_file,
            original_filename=uploaded_file.name,
            file_type=result["file_type"],
            verdict=result["verdict"],
            confidence=result["confidence"],
            facial_score=result["signals"]["facial"],
            pixel_score=result["signals"]["pixel"],
            artifact_score=result["signals"]["artifacts"],
            synthetic_score=result["signals"]["synthetic"],
            face_box=result["face_box"],
            width=result["width"],
            height=result["height"],
            file_size=uploaded_file.size,
            batch_id=batch_id or result["batch_id"],
            explanation=result["explanation"],
            raw_output=result["raw_output"],
            processing_time_ms=result["processing_time_ms"],
        )
        scans.append(scan)

    serializer = ScanSerializer(scans, many=True, context={"request": request})
    payload = serializer.data
    if len(payload) == 1:
        single = dict(payload[0])
        single["processing_time"] = f"{scans[0].processing_time_ms}ms"
        return Response(single, status=status.HTTP_201_CREATED)
    return Response({"batch_id": scans[0].batch_id, "count": len(scans), "results": payload}, status=status.HTTP_201_CREATED)


@api_view(["GET"])
def history(request):
    queryset = Scan.objects.all()
    verdict = request.query_params.get("verdict")
    confidence_min = request.query_params.get("confidence_min")
    confidence_max = request.query_params.get("confidence_max")
    date_from = request.query_params.get("date_from")
    date_to = request.query_params.get("date_to")
    search = request.query_params.get("search")

    if verdict and verdict != "All":
        queryset = queryset.filter(verdict__iexact=verdict)
    if confidence_min:
        queryset = queryset.filter(confidence__gte=float(confidence_min))
    if confidence_max:
        queryset = queryset.filter(confidence__lte=float(confidence_max))
    if date_from:
        queryset = queryset.filter(created_at__date__gte=parse_date(date_from))
    if date_to:
        queryset = queryset.filter(created_at__date__lte=parse_date(date_to))
    if search:
        queryset = queryset.filter(original_filename__icontains=search) | queryset.filter(batch_id__icontains=search)

    serializer = ScanSerializer(queryset, many=True, context={"request": request})
    return Response(serializer.data)


@api_view(["GET"])
def scan_detail(request, scan_id):
    try:
        scan = Scan.objects.get(pk=scan_id)
    except Scan.DoesNotExist as exc:
        raise Http404 from exc
    return Response(ScanSerializer(scan, context={"request": request}).data)


@api_view(["GET"])
def stats(request):
    total = Scan.objects.count()
    counts = dict(Scan.objects.values_list("verdict").annotate(total=Count("id")))
    aggregates = Scan.objects.aggregate(avg_confidence=Avg("confidence"), avg_processing=Avg("processing_time_ms"))
    return Response(
        {
            "total_scans": total,
            "deepfakes": counts.get("Deepfake", 0),
            "authentic": counts.get("Authentic", 0),
            "uncertain": counts.get("Uncertain", 0),
            "avg_confidence": round(aggregates["avg_confidence"] or 0, 1),
            "avg_processing_time": round(aggregates["avg_processing"] or 0),
            "verdict_distribution": counts,
        }
    )


@api_view(["GET"])
def export_report(request, scan_id):
    try:
        scan = Scan.objects.get(pk=scan_id)
    except Scan.DoesNotExist as exc:
        raise Http404 from exc
    pdf_path = build_pdf_report(scan)
    return FileResponse(open(pdf_path, "rb"), as_attachment=True, filename=f"deepguard_scan_{scan.id}.pdf")
