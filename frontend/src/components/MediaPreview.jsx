export default function MediaPreview({ scan, localUrl, overlay = true }) {
  const box = scan?.face_box || { x: 0.28, y: 0.16, width: 0.44, height: 0.52, label: "face_region_0" };
  const src = localUrl || scan?.file_url;
  const isVideo = scan?.file_type === "video" || scan?.original_filename?.match(/\.(mp4|mov|avi|mkv|webm)$/i);

  return (
    <div className="glass overflow-hidden rounded-3xl border-red-400/40">
      <div className="relative aspect-[4/3] bg-black/40">
        {src ? (
          isVideo ? (
            <video src={src} className="h-full w-full object-cover" controls />
          ) : (
            <img src={src} alt={scan?.original_filename || "upload preview"} className="h-full w-full object-cover" />
          )
        ) : (
          <div className="grid h-full place-items-center text-white/30">No media selected</div>
        )}
        {overlay && src && (
          <>
            <div
              className="absolute rounded-lg border-2 border-guard-purple/80 bg-guard-purple/10 shadow-glow"
              style={{
                left: `${box.x * 100}%`,
                top: `${box.y * 100}%`,
                width: `${box.width * 100}%`,
                height: `${box.height * 100}%`
              }}
            >
              <span className="absolute -top-7 left-2 rounded bg-guard-purple px-2 py-1 text-xs font-black text-white">{box.label}</span>
            </div>
            {scan?.verdict && (
              <span className="absolute left-5 top-5 rounded-full bg-red-500/90 px-4 py-1 text-xs font-black text-white">{scan.verdict}</span>
            )}
            {scan?.confidence && (
              <div className="absolute bottom-5 right-5 rounded-2xl bg-[#11131c]/95 px-5 py-4 text-center shadow-xl">
                <p className="text-xs font-bold text-white/70">Confidence</p>
                <p className="text-3xl font-black">{Number(scan.confidence).toFixed(1)}%</p>
              </div>
            )}
          </>
        )}
      </div>
      <div className="flex items-center justify-between border-t border-white/10 px-5 py-4 text-sm font-bold text-white/60">
        <span>{scan?.resolution || "Preview ready"}</span>
        <span>{scan?.size_label || "JPEG · PNG · WebP · MP4"}</span>
      </div>
    </div>
  );
}
