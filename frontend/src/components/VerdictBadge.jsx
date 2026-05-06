import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { verdictColor } from "../utils/format.js";

export default function VerdictBadge({ verdict }) {
  const color = verdictColor(verdict);
  const Icon = verdict === "Deepfake" ? XCircle : verdict === "Authentic" ? CheckCircle2 : AlertTriangle;
  const classes = {
    red: "border-red-400/50 bg-red-500/20 text-red-300",
    green: "border-emerald-400/50 bg-emerald-500/20 text-emerald-300",
    amber: "border-amber-400/50 bg-amber-500/20 text-amber-300"
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-black ${classes[color]}`}>
      <Icon size={14} />
      {verdict}
    </span>
  );
}
