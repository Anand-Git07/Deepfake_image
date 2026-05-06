import { verdictColor } from "../utils/format.js";

export default function SignalBar({ label, value, danger = false }) {
  const color = danger ? "bg-guard-red" : value > 70 ? "bg-guard-green" : value > 40 ? "bg-guard-amber" : "bg-guard-red";
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm font-bold">
        <span className="text-white/70">{label}</span>
        <span className={danger ? "text-red-300" : "text-white"}>{Number(value || 0).toFixed(1)}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/10">
        <div className={`h-full rounded-full ${color} shadow-[0_0_16px_currentColor]`} style={{ width: `${Math.min(value || 0, 100)}%` }} />
      </div>
    </div>
  );
}
