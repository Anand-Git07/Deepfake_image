# DeepGuard

DeepGuard is a full-stack AI-powered deepfake detection system with a Django REST backend, PyTorch CNN inference pipeline, and React + Tailwind dashboard matching the provided dark neon UI.

## Features

- Upload single or batch image/video files.
- Detect deepfakes through `/api/detect/`.
- View confidence, verdict, face-region overlay, signal breakdown, and metadata.
- Filter detection history by verdict, confidence, date, and search text.
- Export individual PDF scan reports.
- Train and plug in a real `.pth` CNN model.
- Demo-safe fallback inference if no model file is present.

## Project Structure

```text
backend/
  deepguard/          Django project settings and routes
  scans/              DRF APIs, Scan model, serializers, reports
  ml/                 CNN architecture, inference, training stub
frontend/
  src/components/     Shared UI pieces
  src/pages/          Image Analysis, History, Detail, Model Info, About
  src/services/       API client
```

## Backend Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Backend runs at `http://127.0.0.1:8000`.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://127.0.0.1:5173`.

## API Endpoints

- `POST /api/detect/` — multipart upload key `files`; accepts one or many images/videos.
- `GET /api/history/` — optional filters: `verdict`, `confidence_min`, `confidence_max`, `date_from`, `date_to`, `search`.
- `GET /api/scan/<id>/` — full scan detail.
- `GET /api/scan/<id>/report/` — PDF report download.
- `GET /api/stats/` — dashboard summary cards.

## ML Model

To use real trained weights:

1. Prepare DFDC face crops in `backend/ml/data/dfdc_faces/real` and `backend/ml/data/dfdc_faces/fake`.
2. Run `cd backend/ml && python train.py`.
3. Save/copy weights to `backend/ml/models/deepguard_cnn.pth`.

Verdict thresholds:

- `Deepfake`: fake probability above 70%.
- `Authentic`: fake probability below 40%.
- `Uncertain`: 40–70%.

## Notes

This project is production-style and resume-friendly, but the bundled CNN weights are intentionally not included. Without weights, DeepGuard uses deterministic visual heuristics so uploads, history, reports, and UI flows still work end-to-end.
