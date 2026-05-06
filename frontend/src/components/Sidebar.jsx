import { Activity, CircleDot, FileImage, FileText, History, Info, Shield, Zap } from "lucide-react";
import { NavLink } from "react-router-dom";

const detection = [
  { to: "/image-analysis", label: "Image Analysis", icon: FileImage },
  { to: "/detection-history", label: "Detection History", icon: History },
  { to: "/scan-detail", label: "Scan Detail", icon: FileText }
];

const system = [
  { to: "/model-info", label: "Model Info", icon: Zap },
  { to: "/about", label: "About", icon: Info }
];

function LinkItem({ item }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        `group mb-2 flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition ${
          isActive ? "active-nav text-white" : "border-transparent text-white/70 hover:border-white/10 hover:bg-white/5 hover:text-white"
        }`
      }
    >
      <span className="flex items-center gap-3">
        <Icon size={19} />
        {item.label}
      </span>
      <CircleDot size={9} className="opacity-60" />
    </NavLink>
  );
}

export default function Sidebar() {
  return (
    <aside className="hidden w-[310px] shrink-0 border-r border-white/10 bg-[#151720]/95 p-5 lg:flex lg:flex-col">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-guard-purple via-fuchsia-500 to-guard-green shadow-glow">
          <Shield size={20} />
        </div>
        <div>
          <h1 className="text-lg font-extrabold tracking-tight">DeepGuard</h1>
          <p className="text-xs text-white/40">AI forensic scanner</p>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-guard-green/30 bg-guard-green/20 px-4 py-3 text-sm font-bold text-guard-green">
        <span className="mr-2 inline-block h-2 w-2 rounded-full bg-guard-green shadow-[0_0_12px_#33e09b]" />
        AI Model Online
      </div>

      <p className="mb-3 px-2 text-xs font-black uppercase tracking-[0.18em] text-white/40">Detection</p>
      {detection.map((item) => (
        <LinkItem item={item} key={item.to} />
      ))}

      <p className="mb-3 mt-6 px-2 text-xs font-black uppercase tracking-[0.18em] text-white/40">System</p>
      {system.map((item) => (
        <LinkItem item={item} key={item.to} />
      ))}

      <div className="mt-auto rounded-2xl border border-white/10 bg-black/20 p-4">
        <div className="mb-3 flex items-center gap-2 text-xs text-white/60">
          <Activity size={15} />
          CNN v2.4.1 · Binary Classification
        </div>
        <div className="flex items-center gap-2 text-xs text-white/50">
          <div className="grid h-8 w-8 place-items-center rounded-full border border-amber-300/40 bg-amber-300/10 text-amber-200">
            <Zap size={17} />
          </div>
          Resume-ready full stack build
        </div>
      </div>
    </aside>
  );
}
