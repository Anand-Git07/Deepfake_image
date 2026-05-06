export function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export function verdictColor(verdict) {
  if (verdict === "Deepfake") return "red";
  if (verdict === "Authentic") return "green";
  return "amber";
}

export function normalizeResults(payload) {
  if (!payload) return [];
  if (payload.results) return payload.results;
  return [payload];
}
