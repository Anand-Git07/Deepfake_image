# DeepGuard ML Pipeline

This folder contains the CNN architecture, training stub, and Django inference utilities.

## Dataset flow

1. Download the DeepFake Detection Challenge dataset.
2. Extract video frames with OpenCV.
3. Detect/crop faces using Haar cascades or a stronger detector such as RetinaFace.
4. Save folders as:
   - `data/dfdc_faces/real/...`
   - `data/dfdc_faces/fake/...`
5. Train:

```bash
cd backend/ml
python train.py
```

6. Copy the trained weights to `backend/ml/models/deepguard_cnn.pth`.

If no `.pth` file is present, the app still runs with deterministic visual heuristics so the full-stack demo remains usable.
