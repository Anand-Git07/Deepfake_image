import { useEffect, useMemo, useRef } from "react";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function drawOriginal(ctx, image, width, height) {
  ctx.drawImage(image, 0, 0, width, height);
}

function drawFaceCrop(ctx, image, width, height, faceBox) {
  const box = faceBox || { x: 0.28, y: 0.16, width: 0.44, height: 0.52 };
  const sx = clamp(box.x * image.naturalWidth, 0, image.naturalWidth - 1);
  const sy = clamp(box.y * image.naturalHeight, 0, image.naturalHeight - 1);
  const sw = clamp(box.width * image.naturalWidth, 1, image.naturalWidth - sx);
  const sh = clamp(box.height * image.naturalHeight, 1, image.naturalHeight - sy);
  ctx.drawImage(image, sx, sy, sw, sh, 0, 0, width, height);
}

function drawGradCam(ctx, image, width, height) {
  ctx.drawImage(image, 0, 0, width, height);
  const frame = ctx.getImageData(0, 0, width, height);
  const output = ctx.createImageData(width, height);

  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const i = (y * width + x) * 4;
      const left = i - 4;
      const right = i + 4;
      const up = i - width * 4;
      const down = i + width * 4;
      const contrast =
        Math.abs(frame.data[left] - frame.data[right]) +
        Math.abs(frame.data[up] - frame.data[down]) +
        Math.abs(frame.data[left + 1] - frame.data[right + 1]) +
        Math.abs(frame.data[up + 1] - frame.data[down + 1]);
      const heat = clamp(contrast * 1.2, 0, 255);
      output.data[i] = 255;
      output.data[i + 1] = clamp(190 - heat * 0.55, 0, 255);
      output.data[i + 2] = clamp(40 + heat * 0.15, 0, 255);
      output.data[i + 3] = clamp(45 + heat * 0.58, 35, 210);
    }
  }

  ctx.globalAlpha = 0.82;
  ctx.putImageData(output, 0, 0);
  ctx.globalAlpha = 1;
}

function drawFrequencyMap(ctx, image, width, height) {
  ctx.drawImage(image, 0, 0, width, height);
  const frame = ctx.getImageData(0, 0, width, height);
  const output = ctx.createImageData(width, height);
  const block = 8;
  const cosines = Array.from({ length: block }, (_, u) =>
    Array.from({ length: block }, (_, x) => Math.cos(((2 * x + 1) * u * Math.PI) / 16))
  );

  for (let y = 0; y < height; y += block) {
    for (let x = 0; x < width; x += block) {
      const values = [];
      for (let yy = 0; yy < block; yy += 1) {
        for (let xx = 0; xx < block; xx += 1) {
          const px = clamp(x + xx, 0, width - 1);
          const py = clamp(y + yy, 0, height - 1);
          const i = (py * width + px) * 4;
          const gray = frame.data[i] * 0.299 + frame.data[i + 1] * 0.587 + frame.data[i + 2] * 0.114;
          values.push(gray - 128);
        }
      }

      let highFrequencyEnergy = 0;
      for (let u = 0; u < block; u += 1) {
        for (let v = 0; v < block; v += 1) {
          if (u + v < 6) continue;
          let coefficient = 0;
          for (let yy = 0; yy < block; yy += 1) {
            for (let xx = 0; xx < block; xx += 1) {
              coefficient += values[yy * block + xx] * cosines[u][xx] * cosines[v][yy];
            }
          }
          highFrequencyEnergy += Math.abs(coefficient) / 64;
        }
      }

      const residue = clamp(highFrequencyEnergy * 0.42, 0, 255);
      for (let yy = y; yy < Math.min(y + block, height); yy += 1) {
        for (let xx = x; xx < Math.min(x + block, width); xx += 1) {
          const i = (yy * width + xx) * 4;
          output.data[i] = clamp(residue * 0.35, 0, 255);
          output.data[i + 1] = clamp(90 + residue * 0.35, 0, 255);
          output.data[i + 2] = clamp(190 + residue * 0.25, 0, 255);
          output.data[i + 3] = 255;
        }
      }
    }
  }

  ctx.putImageData(output, 0, 0);
}

function drawEdgeMap(ctx, image, width, height) {
  ctx.drawImage(image, 0, 0, width, height);
  const frame = ctx.getImageData(0, 0, width, height);
  const output = ctx.createImageData(width, height);

  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const i = (y * width + x) * 4;
      const gray = (idx) => frame.data[idx] * 0.299 + frame.data[idx + 1] * 0.587 + frame.data[idx + 2] * 0.114;
      const gx = gray(i + 4) - gray(i - 4);
      const gy = gray(i + width * 4) - gray(i - width * 4);
      const edge = clamp(Math.sqrt(gx * gx + gy * gy) * 2.4, 0, 255);
      output.data[i] = edge;
      output.data[i + 1] = clamp(edge * 0.85 + 30, 0, 255);
      output.data[i + 2] = clamp(255 - edge * 0.4, 0, 255);
      output.data[i + 3] = 255;
    }
  }

  ctx.putImageData(output, 0, 0);
}

function ForensicCanvas({ src, mode, faceBox }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!src) return undefined;
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = src;
    image.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);
      if (mode === "crop") drawFaceCrop(ctx, image, width, height, faceBox);
      if (mode === "heatmap") drawGradCam(ctx, image, width, height);
      if (mode === "frequency") drawFrequencyMap(ctx, image, width, height);
      if (mode === "edge") drawEdgeMap(ctx, image, width, height);
    };
    return undefined;
  }, [faceBox, mode, src]);

  return <canvas ref={canvasRef} width="420" height="260" className="h-full w-full object-cover" />;
}

export default function ForensicPanels({ scan }) {
  const src = scan?.file_url;
  const watermark = scan?.raw_output?.watermark;
  const serverSteps = scan?.visual_steps || [];
  const panels = useMemo(
    () => [
      { title: "Original Image", mode: "original", text: "Source media used for classification." },
      { title: "Face Crop", mode: "crop", text: "Detected primary face region passed into analysis." },
      { title: "Grad-CAM Heatmap", mode: "heatmap", text: "Image-derived activation proxy showing high-contrast regions." },
      { title: "DCT Frequency Map", mode: "frequency", text: "Block-level frequency residue and compression patterns." },
      { title: "Edge / Texture Map", mode: "edge", text: "Local edge strength, skin texture, and blend boundaries." },
    ],
    []
  );

  if (!src && !serverSteps.length) return null;

  if (serverSteps.length) {
    return (
      <div className="mt-8">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-sm font-black uppercase tracking-wider">Visual Analysis</h3>
          {watermark?.detected && (
            <span className="rounded-full border border-red-300/40 bg-red-500/15 px-4 py-2 text-xs font-black text-red-200">
              Watermark detected: auto fake policy
            </span>
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {serverSteps.map((panel) => (
            <div key={`${panel.step}-${panel.image}`} className="overflow-hidden rounded-2xl border border-white/10 bg-black/25">
              <div className="aspect-[16/10] bg-black/40">
                <img src={panel.image} alt={panel.step} className="h-full w-full object-cover" />
              </div>
              <div className="border-t border-white/10 p-4">
                <p className="font-black">{panel.step}</p>
                {panel.description && <p className="mt-1 text-xs leading-5 text-white/55">{panel.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-sm font-black uppercase tracking-wider">Visual Analysis</h3>
        {watermark?.detected && (
          <span className="rounded-full border border-red-300/40 bg-red-500/15 px-4 py-2 text-xs font-black text-red-200">
            Watermark detected: auto fake policy
          </span>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {panels.map((panel) => (
          <div key={panel.title} className="overflow-hidden rounded-2xl border border-white/10 bg-black/25">
            <div className="aspect-[16/10] bg-black/40">
              {panel.mode === "original" ? (
                <img src={src} alt={scan.original_filename} className="h-full w-full object-cover" />
              ) : (
                <ForensicCanvas src={src} mode={panel.mode} faceBox={scan.face_box} />
              )}
            </div>
            <div className="border-t border-white/10 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-black">{panel.title}</p>
                  <p className="mt-1 text-xs leading-5 text-white/55">{panel.text}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
