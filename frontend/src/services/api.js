const API_BASE = "https://ai-job-tracker-2-elbs.onrender.com"; //  Render backend

export async function fetchJobs(query = "") {
  const url = query
    ? `${API_BASE}/jobs?q=${encodeURIComponent(query)}`
    : `${API_BASE}/jobs`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch jobs");
  return res.json();
}

export async function uploadResume(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/resume`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to upload resume");
  return res.json();
}

export async function askAI(message) {
  const res = await fetch(`${API_BASE}/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error("AI request failed");
  return res.json();
}
