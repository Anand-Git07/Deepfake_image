import { Download, FileText, Layers, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CircularProgress from "../components/CircularProgress.jsx";
import ForensicPanels from "../components/ForensicPanels.jsx";
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
  const resultLabel = scan.verdict === "Deepfake" ? "Fake" : scan.verdict === "Authentic" ? "Real" : "Uncertain";
  const watermark = scan.raw_output?.watermark;
  const evidence = scan.raw_output?.evidence || [];
  const frameTimeline = scan.frame_timeline || [];
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
                <div className="mb-3 flex flex-wrap items-center gap-4">
                  <ShieldAlert className={danger ? "text-red-300" : "text-emerald-300"} />
                  <h3 className={`text-xl font-black ${danger ? "text-red-300" : "text-emerald-300"}`}>
                    Result: {resultLabel}
                  </h3>
                  <VerdictBadge verdict={scan.verdict} />
                  {watermark?.detected && (
                    <span className="rounded-full border border-red-300/50 bg-red-500/20 px-3 py-1 text-xs font-black text-red-200">
                      Watermark Detected
                    </span>
                  )}
                </div>
                <div className="mb-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-white/45">Result</p>
                    <p className="mt-1 text-2xl font-black">{resultLabel}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-white/45">Confidence</p>
                    <p className="mt-1 text-2xl font-black">{Number(scan.confidence).toFixed(1)}%</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-white/45">Risk Level</p>
                    <p className={`mt-1 text-2xl font-black ${danger ? "text-red-200" : scan.verdict === "Authentic" ? "text-emerald-200" : "text-amber-200"}`}>
                      {danger ? "High" : scan.verdict === "Authentic" ? "Low" : "Review"}
                    </p>
                  </div>
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
                <ForensicPanels scan={scan} />
              </div>

              {evidence.length > 0 && (
                <div className="mt-8">
                  <h3 className="mb-5 text-sm font-black uppercase tracking-wider">Evidence Summary</h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    {evidence.map((item) => (
                      <div key={`${item.label}-${item.value}`} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-black">{item.label}</p>
                          <span className={`rounded-full px-3 py-1 text-xs font-black ${
                            item.severity === "high" ? "bg-red-500/20 text-red-200" : item.severity === "medium" ? "bg-amber-500/20 text-amber-200" : "bg-emerald-500/20 text-emerald-200"
                          }`}>
                            {item.value}
                          </span>
                        </div>
                        {item.detail && <p className="mt-2 text-sm leading-6 text-white/55">{item.detail}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {frameTimeline.length > 0 && (
                <div className="mt-8">
                  <h3 className="mb-5 text-sm font-black uppercase tracking-wider">Frame Timeline</h3>
                  <div className="grid gap-4">
                    {frameTimeline.map((frame) => {
                      const preview = frame.images?.["Grad-CAM"] || frame.images?.["DCT Analysis"] || frame.images?.Original;
                      return (
                        <div key={frame.frame} className={`grid gap-4 rounded-2xl border p-4 md:grid-cols-[180px_1fr] ${
                          frame.suspicious ? "border-red-400/40 bg-red-500/10" : "border-white/10 bg-white/[0.04]"
                        }`}>
                          {preview && <img src={preview} alt={`Frame ${frame.frame}`} className="aspect-video w-full rounded-xl object-cover" />}
                          <div>
                            <div className="mb-3 flex flex-wrap items-center gap-3">
                              <p className="font-black">Frame {frame.frame}</p>
                              <span className="rounded-full bg-black/30 px-3 py-1 text-xs font-black text-white/70">{frame.timecode}</span>
                              {frame.suspicious && <span className="rounded-full bg-red-500/25 px-3 py-1 text-xs font-black text-red-200">Most suspicious</span>}
                            </div>
                            <div className="mb-3 flex items-center gap-3">
                              <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                                <div className="h-full rounded-full bg-red-400" style={{ width: `${frame.fake_probability}%` }} />
                              </div>
                              <b>{Number(frame.fake_probability).toFixed(1)}%</b>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(frame.images || {}).map(([label, image]) => (
                                <a key={label} href={image} target="_blank" rel="noreferrer" className="rounded-lg border border-white/10 px-3 py-2 text-xs font-black text-white/65 hover:border-guard-purple">
                                  {label}
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

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
