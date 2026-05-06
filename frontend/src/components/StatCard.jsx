export default function StatCard({ title, value, caption, tone = "purple", icon: Icon }) {
  const tones = {
    purple: "border-guard-purple/40 bg-guard-purple/20 text-purple-200",
    red: "border-red-400/40 bg-red-500/20 text-red-200",
    green: "border-emerald-400/40 bg-emerald-500/20 text-emerald-200",
    amber: "border-amber-400/40 bg-amber-500/20 text-amber-200",
    slate: "border-white/20 bg-white/10 text-white"
  };
  return (
    <div className={`rounded-2xl border p-5 ${tones[tone]}`}>
      <div className="mb-2 flex items-center gap-2 text-sm font-bold text-white/80">
        {Icon && <Icon size={17} />}
        {title}
      </div>
      <div className="text-3xl font-black tracking-tight">{value}</div>
      <p className="mt-1 text-xs text-white/60">{caption}</p>
    </div>
  );
}
