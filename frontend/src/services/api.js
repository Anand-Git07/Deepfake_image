import axios from "axios";

export const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 120000
});

export async function detectFiles(files) {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  formData.append("batch_id", `batch-${Date.now().toString().slice(-5)}`);
  const { data } = await api.post("/detect/", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
}

export async function getHistory(params = {}) {
  const { data } = await api.get("/history/", { params });
  return data;
}

export async function getScan(id) {
  const { data } = await api.get(`/scan/${id}/`);
  return data;
}

export async function getStats() {
  const { data } = await api.get("/stats/");
  return data;
}

export function reportUrl(id) {
  return `${API_BASE}/api/scan/${id}/report/`;
}
