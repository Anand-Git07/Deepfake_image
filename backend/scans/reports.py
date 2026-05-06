from pathlib import Path

from django.conf import settings


def build_pdf_report(scan):
    reports_dir = Path(settings.MEDIA_ROOT) / "reports"
    reports_dir.mkdir(parents=True, exist_ok=True)
    pdf_path = reports_dir / f"deepguard_scan_{scan.id}.pdf"

    try:
        from reportlab.lib import colors
        from reportlab.lib.pagesizes import letter
        from reportlab.lib.styles import getSampleStyleSheet
        from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

        doc = SimpleDocTemplate(str(pdf_path), pagesize=letter)
        styles = getSampleStyleSheet()
        rows = [
            ["Filename", scan.original_filename],
            ["Verdict", scan.verdict],
            ["Confidence", f"{scan.confidence:.1f}%"],
            ["Facial consistency", f"{scan.facial_score:.1f}%"],
            ["Pixel integrity", f"{scan.pixel_score:.1f}%"],
            ["Compression artifacts", f"{scan.artifact_score:.1f}%"],
            ["Synthetic patterns", f"{scan.synthetic_score:.1f}%"],
            ["Resolution", f"{scan.width}x{scan.height}"],
            ["Processing time", f"{scan.processing_time_ms}ms"],
            ["Model", scan.model_version],
        ]
        table = Table(rows, hAlign="LEFT", colWidths=[160, 300])
        table.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#2f255f")),
                    ("TEXTCOLOR", (0, 0), (-1, -1), colors.white),
                    ("BACKGROUND", (0, 1), (-1, -1), colors.HexColor("#17151f")),
                    ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#6d5dfc")),
                    ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
                    ("PADDING", (0, 0), (-1, -1), 8),
                ]
            )
        )
        story = [
            Paragraph("DeepGuard AI Deepfake Detection Report", styles["Title"]),
            Spacer(1, 12),
            Paragraph(scan.explanation, styles["BodyText"]),
            Spacer(1, 18),
            table,
        ]
        doc.build(story)
    except Exception:
        pdf_path.write_text(
            "\n".join(
                [
                    "DeepGuard AI Deepfake Detection Report",
                    f"Filename: {scan.original_filename}",
                    f"Verdict: {scan.verdict}",
                    f"Confidence: {scan.confidence:.1f}%",
                    f"Explanation: {scan.explanation}",
                ]
            )
        )
    return pdf_path
