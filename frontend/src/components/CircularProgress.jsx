export default function CircularProgress({ value = 0, verdict = "Deepfake", size = "lg" }) {
  const color = verdict === "Deepfake" ? "#ff4d4d" : verdict === "Authentic" ? "#33e09b" : "#ffb020";
  const dimension = size === "sm" ? "h-20 w-20" : "h-36 w-36";
  return (
    <div
      className={`${dimension} confidence-ring relative grid place-items-center rounded-full shadow-redglow`}
      style={{ "--score": value, "--ring-color": color }}
    >
      <div className="absolute inset-3 rounded-full bg-[#15131d]" />
      <div className="relative text-center">
        <p className="text-3xl font-black" style={{ color }}>
          {Number(value).toFixed(1)}%
        </p>
        <p className="mt-1 text-[10px] font-semibold text-white/40">model confidence</p>
      </div>
    </div>
  );
}
