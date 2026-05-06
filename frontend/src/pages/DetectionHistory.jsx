import { Download, Filter, History, Layers, Search, ShieldAlert, ShieldCheck, SlidersHorizontal, Timer, TriangleAlert } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import StatCard from "../components/StatCard.jsx";
import VerdictBadge from "../components/VerdictBadge.jsx";
import { getHistory, getStats } from "../services/api.js";
import { formatDate } from "../utils/format.js";
import { mockScans, mockStats } from "../utils/mockData.js";

const verdicts = ["All", "Deepfake", "Authentic", "Uncertain"];

export default function DetectionHistory() {
  const navigate = useNavigate();
  const [scans, setScans] = useState([]);
  const [stats, setStats] = useState(mockStats);
  const [filters, setFilters] = useState({ verdict: "All", confidence_min: "0", confidence_max: "100", date_from: "", date_to: "", search: "" });

  useEffect(() => {
    load();
  }, []);

  async function load(nextFilters = filters) {
    try {
      const [historyData, statsData] = await Promise.all([getHistory(nextFilters), getStats()]);
      setScans(historyData.length ? historyData : mockScans);
      setStats(statsData.total_scans ? statsData : mockStats);
    } catch {
      setScans(mockScans);
      setStats(mockStats);
    }
  }

  function updateFilter(key, value) {
    const next = { ...filters, [key]: value };
    setFilters(next);
    load(next);
  }

  const donut = useMemo(() => {
    const total = Math.max(stats.total_scans || 1, 1);
    return {
      deepfake: ((stats.deepfakes || 0) / total) * 100,
      authentic: ((stats.authentic || 0) / total) * 100,
      uncertain: ((stats.uncertain || 0) / total) * 100
    };
  }, [stats]);

  return (
    <div>
      <PageHeader
        icon={History}
        title="Detection History"
        subtitle={`${stats.total_scans || scans.length} scans stored · last updated ${formatDate(new Date())}`}
        action={
          <button className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-black text-white hover:bg-white/20">
            <Download size={17} />
            Export all
          </button>
        }
      />

      <div className="mb-8 grid gap-4 xl:grid-cols-[repeat(6,minmax(0,1fr))_300px]">
        <StatCard title="Total Scans" value={stats.total_scans} caption="all time" tone="purple" icon={Layers} />
        <StatCard title="Deepfakes" value={stats.deepfakes} caption={`${Math.round(((stats.deepfakes || 0) / Math.max(stats.total_scans || 1, 1)) * 100)}% of total`} tone="red" icon={ShieldAlert} />
        <StatCard title="Authentic" value={stats.authentic} caption={`${Math.round(((stats.authentic || 0) / Math.max(stats.total_scans || 1, 1)) * 100)}% of total`} tone="green" icon={ShieldCheck} />
        <StatCard title="Uncertain" value={stats.uncertain} caption="needs manual review" tone="amber" icon={TriangleAlert} />
        <StatCard title="Avg Confidence" value={`${stats.avg_confidence}%`} caption="across all scans" tone="slate" icon={Layers} />
        <StatCard title="Avg Process Time" value={`${stats.avg_processing_time}ms`} caption="per image" tone="slate" icon={Timer} />
        <div className="glass rounded-3xl p-5">
          <h3 className="mb-4 text-sm font-black uppercase">Verdict Distribution</h3>
          <div className="flex items-center gap-5">
            <div
              className="h-28 w-28 rounded-full"
              style={{
                background: `conic-gradient(#ff4d4d 0 ${donut.deepfake}%, #33e09b ${donut.deepfake}% ${donut.deepfake + donut.authentic}%, #ffb020 ${donut.deepfake + donut.authentic}% 100%)`
              }}
            >
              <div className="m-[18px] h-[76px] w-[76px] rounded-full bg-[#171721]" />
            </div>
            <div className="space-y-2 text-sm font-bold">
              <p><span className="mr-2 inline-block h-2 w-2 rounded-full bg-guard-red" />Deepfake <b className="ml-5">{stats.deepfakes}</b></p>
              <p><span className="mr-2 inline-block h-2 w-2 rounded-full bg-guard-green" />Authentic <b className="ml-4">{stats.authentic}</b></p>
              <p><span className="mr-2 inline-block h-2 w-2 rounded-full bg-guard-amber" />Uncertain <b className="ml-4">{stats.uncertain}</b></p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 grid gap-3 xl:grid-cols-[1fr_auto]">
        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <Search size={19} className="text-white/40" />
          <input
            value={filters.search}
            onChange={(event) => updateFilter("search", event.target.value)}
            placeholder="Search by filename, ID, or batch..."
            className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-white/30"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {verdicts.map((verdict) => (
            <button
              key={verdict}
              onClick={() => updateFilter("verdict", verdict)}
              className={`rounded-xl border px-4 py-3 text-sm font-black ${
                filters.verdict === verdict ? "border-guard-purple bg-guard-purple/30" : "border-white/10 bg-white/5"
              }`}
            >
              {verdict}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4 text-sm font-bold">
        <SlidersHorizontal size={18} className="text-white/50" />
        <span>Confidence:</span>
        <input value={filters.confidence_min} onChange={(event) => updateFilter("confidence_min", event.target.value)} className="w-20 rounded-lg border border-white/10 bg-white/5 px-3 py-2" />
        <span>–</span>
        <input value={filters.confidence_max} onChange={(event) => updateFilter("confidence_max", event.target.value)} className="w-20 rounded-lg border border-white/10 bg-white/5 px-3 py-2" />
        <span>%</span>
        <Filter size={18} className="ml-2 text-white/50" />
        <span>Date:</span>
        <input type="date" value={filters.date_from} onChange={(event) => updateFilter("date_from", event.target.value)} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2" />
        <span>to</span>
        <input type="date" value={filters.date_to} onChange={(event) => updateFilter("date_to", event.target.value)} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2" />
      </div>

      <div className="glass overflow-x-auto rounded-3xl">
        <table className="history-table w-full min-w-[1100px] text-left text-sm">
          <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-white/50">
            <tr>
              <th className="p-5">Image</th>
              <th className="p-5">Verdict</th>
              <th className="p-5">Confidence</th>
              <th className="p-5">Facial</th>
              <th className="p-5">Pixel</th>
              <th className="p-5">Artifacts</th>
              <th className="p-5">Size</th>
              <th className="p-5">Scanned</th>
              <th className="p-5">Batch</th>
              <th className="p-5">Action</th>
            </tr>
          </thead>
          <tbody>
            {scans.map((scan) => (
              <tr key={scan.id} className="border-b border-white/10 transition hover:bg-white/[0.04]">
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <img src={scan.file_url} className="h-12 w-12 rounded-xl object-cover" alt="" />
                    <div>
                      <p className="max-w-[260px] truncate font-black">{scan.original_filename}</p>
                      <p className="text-xs text-white/40">scan-{String(scan.id).padStart(3, "0")}</p>
                    </div>
                  </div>
                </td>
                <td className="p-5"><VerdictBadge verdict={scan.verdict} /></td>
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-14 rounded-full bg-white/10"><div className="h-full rounded-full bg-guard-red" style={{ width: `${scan.confidence}%` }} /></div>
                    <b>{Number(scan.confidence).toFixed(1)}%</b>
                  </div>
                </td>
                <td className="p-5 font-black text-red-300">{Number(scan.facial_score ?? scan.signals?.facial).toFixed(0)}%</td>
                <td className="p-5 font-black text-emerald-300">{Number(scan.pixel_score ?? scan.signals?.pixel).toFixed(0)}%</td>
                <td className="p-5 font-black text-red-300">{Number(scan.artifact_score ?? scan.signals?.artifacts).toFixed(0)}%</td>
                <td className="p-5 font-bold">{scan.size_label}</td>
                <td className="p-5 text-white/70">{formatDate(scan.created_at)}</td>
                <td className="p-5"><span className="rounded bg-white/10 px-2 py-1 text-xs font-bold">{scan.batch_id || "—"}</span></td>
                <td className="p-5">
                  <button onClick={() => navigate(`/scan-detail/${scan.id}`)} className="rounded-lg bg-guard-purple/25 px-3 py-2 font-black text-purple-200 hover:bg-guard-purple/40">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
