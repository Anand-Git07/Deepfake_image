import { Cpu, Database, Layers, Zap } from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";

export default function ModelInfo() {
  return (
    <div>
      <PageHeader icon={Zap} title="Model Info" subtitle="CNN inference stack, thresholds, training workflow, and deployment notes" />
      <div className="grid gap-6 lg:grid-cols-2">
        {[
          ["Architecture", "Xception/EfficientNet-ready CNN pipeline with a bundled DeepGuardCNN fallback architecture.", Layers],
          ["Input Processing", "Face/frame extraction with OpenCV, resize to 224×224, ImageNet normalization, binary sigmoid output.", Cpu],
          ["Training Dataset", "Designed for DeepFake Detection Challenge data after face extraction and real/fake folder labeling.", Database],
          ["Threshold System", "Deepfake >70%, Authentic <40%, Uncertain 40–70% for manual review.", Zap]
        ].map(([title, text, Icon]) => (
          <div className="glass rounded-3xl p-7" key={title}>
            <Icon className="mb-5 text-guard-purple" size={30} />
            <h3 className="mb-3 text-xl font-black">{title}</h3>
            <p className="leading-7 text-white/60">{text}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 glass rounded-3xl p-7">
        <h3 className="mb-4 text-xl font-black">Production Upgrade Path</h3>
        <ol className="list-decimal space-y-3 pl-5 text-white/70">
          <li>Train on DFDC face crops and save weights as <code>backend/ml/models/deepguard_cnn.pth</code>.</li>
          <li>Replace Haar face detection with RetinaFace or MediaPipe for stronger localization.</li>
          <li>Add GPU workers with Celery for long videos and high-volume batch scans.</li>
          <li>Store reports in S3-compatible object storage for deployment.</li>
        </ol>
      </div>
    </div>
  );
}
