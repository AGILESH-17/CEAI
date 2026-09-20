const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const res = await fetch(`${API}${path}`, options);
  if (!res.ok) {
    let message = "Request failed";
    try { message = (await res.json()).detail || message; } catch {}
    throw new Error(message);
  }
  return res.json();
}

export async function analyzeImage(file) {
  const form = new FormData();
  form.append("file", file);
  return request("/api/analyze", { method: "POST", body: form });
}
export async function getReports() { return request("/api/reports"); }
export async function getStats() { return request("/api/statistics"); }
export async function createReport(payload) {
  return request("/api/reports", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(payload) });
}
export async function updateStatus(id, status) {
  return request(`/api/reports/${id}/status`, { method: "PATCH", headers: {"Content-Type":"application/json"}, body: JSON.stringify({status}) });
}
export async function deleteReport(id) { return request(`/api/reports/${id}`, {method:"DELETE"}); }
export async function seedDemo() { return request("/api/demo/seed", {method:"POST"}); }
export async function resetDemo() { return request("/api/demo/reset", {method:"DELETE"}); }
export { API };
