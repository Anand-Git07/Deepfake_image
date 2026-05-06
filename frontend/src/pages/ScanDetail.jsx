import { Download, FileText, Layers, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CircularProgress from "../components/CircularProgress.jsx";
import MediaPreview from "../components/MediaPreview.jsx";
import PageHeader from "../components/PageHeader.jsx";
import SignalBar from "../components/SignalBar.jsx";
import VerdictBadge from "../components/VerdictBadge.jsx";
import { getHistory, getScan, reportUrl } from "../services/api.js";
import { formatDate } from "../utils/format.js";
import { mockScans } from "../utils/mockData.js";

export default function ScanDetail() {
  const { id } = useParams();
  const [scan, setScan] = useState(null);
  const [tab, setTab] = useState("Overview");

  useEffect(() => {
    load();
  }, [id]);

  async function load() {
    try {
      if (id) {
        setScan(await getScan(id));
      } else {
        const history = await getHistory();
        setScan(history[0] || mockScans[0]);
      }
    } catch {
      setScan(mockScans.find((item) => String(item.id) === String(id)) || mockScans[0]);
    }
  }

  if (!scan) return <div className="text-white/60">Loading scan detail...</div>;

  const danger = scan.verdict === "Deepfake";
  const signals = scan.signals || {
    facial: scan.facial_score,
    pixel: scan.pixel_score,
    artifacts: scan.artifact_score,
    synthetic: scan.synthetic_score
  };

  return (
    <div>
      <PageHeader
        icon={FileText}
        title={scan.original_filename}
        subtitle={`scan-${String(scan.id).padStart(3, "0")} · ${formatDate(scan.created_at)} · ${scan.size_label} · ${scan.resolution} · ${scan.batch_id || "single"}`}
        action={
          <a href={reportUrl(scan.id)} className="inline-flex items-center gap-2 rounded-xl bg-guard-purple px-5 py-3 text-sm font-black text-white shadow-glow">
            <Download size={17} />
            Download Full Report
          </a>
        }
      />

      <div className="grid gap-8 xl:grid-cols-[560px_1fr]">
        <section className="space-y-6">
          <MediaPreview scan={scan} overlay />
          <div className="glass rounded-3xl p-6">
            <h3 className="mb-5 text-sm font-black uppercase tracking-wider">File Metadata</h3>
            {[
              ["Filename", scan.original_filename],
              ["Dimensions", scan.resolution],
              ["File size", scan.size_label],
              ["Process time", scan.processing_time],
              ["Model", scan.model_version],
              ["Batch", scan.batch_id || "—"]
            ].map(([key, value]) => (
              <div key={key} className="mb-4 flex justify-between gap-8 text-sm">
                <span className="text-white/40">{key}</span>
                <span className="font-black">{value}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="glass rounded-3xl">
          <div className="flex gap-8 border-b border-white/10 px-7 pt-6">
            {["Overview", "Signal Breakdown", "Model Info", "Raw Output"].map((item) => (
              <button
                key={item}
                onClick={() => setTab(item)}
                className={`border-b-2 pb-5 text-sm font-black ${tab === item ? "border-guard-purple text-white" : "border-transparent text-white/60"}`}
              >
                {item}
              </button>
            ))}
          </div>

          {tab === "Overview" && (
            <div className="p-7">
              <div className={`mb-8 rounded-3xl border p-6 ${danger ? "border-red-400/50 bg-red-500/20" : "border-emerald-400/50 bg-emerald-500/10"}`}>
                <div className="mb-3 flex items-center gap-4">
                  <ShieldAlert className={danger ? "text-red-300" : "text-emerald-300"} />
                  <h3 className={`text-xl font-black ${danger ? "text-red-300" : "text-emerald-300"}`}>
                    {scan.verdict === "Deepfake" ? "Deepfake Detected" : scan.verdict === "Authentic" ? "Authentic Media" : "Manual Review Recommended"}
                  </h3>
                  <VerdictBadge verdict={scan.verdict} />
                </div>
                <p className="max-w-3xl leading-7 text-white/80">{scan.explanation}</p>
              </div>

              <div className="grid gap-10 lg:grid-cols-[310px_1fr]">
                <div>
                  <h3 className="mb-6 text-sm font-black uppercase tracking-wider">Confidence Score</h3>
                  <CircularProgress value={scan.confidence} verdict={scan.verdict} />
                  <div className="mt-8">
                    <div className="mb-1 flex justify-between text-xs font-bold text-white/60">
                      <span>0%</span><span className="text-guard-amber">65% threshold</span><span>100%</span>
                    </div>
                    <div className="relative h-2 rounded-full bg-gradient-to-r from-guard-green via-guard-amber to-guard-red">
                      <span className="absolute left-[65%] top-[-7px] h-5 w-0.5 bg-guard-amber" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-6 text-sm font-black uppercase tracking-wider">Key Signals</h3>
                  <div className="space-y-6">
                    <SignalBar label="Facial Consistency" value={signals.facial} danger={danger} />
                    <SignalBar label="Pixel Integrity" value={signals.pixel} danger={danger} />
                    <SignalBar label="Compression Artifacts" value={signals.artifacts} danger={danger} />
                    <SignalBar label="Synthetic Patterns" value={signals.synthetic} danger={danger} />
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="mb-5 text-sm font-black uppercase tracking-wider">Processing Timeline</h3>
                {[
                  ["Image received", "0ms"],
                  ["Face detection (OpenCV)", "~80ms"],
                  ["Feature extraction (Conv layers)", "~340ms"],
                  ["Signal aggregation", "~720ms"],
                  ["Report generated", scan.processing_time]
                ].map(([label, time]) => (
                  <div key={label} className="mb-4 flex items-center justify-between border-l-2 border-guard-purple/70 pl-5">
                    <span className="font-semibold text-white/80">{label}</span>
                    <span className="text-sm text-white/40">{time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "Signal Breakdown" && (
            <div className="grid gap-5 p-7 md:grid-cols-2">
              {[
                ["Facial consistency", signals.facial, "Checks landmark symmetry, face region stability, and geometry continuity."],
                ["Pixel integrity", signals.pixel, "Measures local texture noise, blended edges, and pixel neighborhood coherence."],
                ["Compression artifacts", signals.artifacts, "Detects abnormal JPEG blocks and frequency-domain residue patterns."],
                ["Synthetic patterns", signals.synthetic, "Finds GAN-like smoothness, repeated textures, and generated skin signatures."]
              ].map(([title, value, text]) => (
                <div key={title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-black">{title}</h3>
                    <span className="text-2xl font-black">{Number(value).toFixed(1)}%</span>
                  </div>
                  <SignalBar label="Score" value={value} danger={danger} />
                  <p className="mt-4 text-sm leading-6 text-white/60">{text}</p>
                </div>
              ))}
            </div>
          )}

          {tab === "Model Info" && (
            <div className="p-7">
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                <h3 className="mb-4 flex items-center gap-3 text-xl font-black"><Layers /> DeepGuard CNN v2.4.1</h3>
                <p className="leading-7 text-white/70">
                  Binary real-vs-fake classifier using 224×224 normalized face crops. Video inference samples frames, predicts each frame, and aggregates by average probability plus majority vote.
                </p>
              </div>
            </div>
          )}

          {tab === "Raw Output" && (
            <pre className="m-7 overflow-x-auto rounded-3xl border border-white/10 bg-black/40 p-6 text-sm text-purple-100">
              {JSON.stringify({ verdict: scan.verdict, confidence: scan.confidence, signals, raw_output: scan.raw_output }, null, 2)}
            </pre>
          )}
        </section>
      </div>
    </div>
  );
}
