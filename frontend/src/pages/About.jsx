import { Info, ShieldCheck } from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";

export default function About() {
  return (
    <div>
      <PageHeader icon={Info} title="About DeepGuard" subtitle="Production-style AI deepfake detection dashboard for portfolio and resume demonstrations" />
      <div className="glass max-w-4xl rounded-3xl p-8">
        <ShieldCheck className="mb-5 text-guard-green" size={42} />
        <h3 className="mb-4 text-2xl font-black">DeepGuard combines frontend polish with backend ML engineering.</h3>
        <p className="leading-8 text-white/70">
          Users can upload images or videos, run CNN-based deepfake analysis, inspect confidence and artifact signals, track scan history, open forensic detail pages, and export PDF reports. The included backend is ready for a trained PyTorch model while still providing deterministic demo inference without external weights.
        </p>
      </div>
    </div>
  );
}
