const API_BASE = "https://ai-job-tracker-2-elbs.onrender.com/jobs";

export const fetchJobs = async (query = "") => {
  const res = await fetch(`${API_BASE}/jobs?q=${query}`);
  if (!res.ok) throw new Error("Failed to fetch jobs");
  return res.json();
};

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/resume`, {
    method: "POST",
    body: formData
  });

  if (!res.ok) throw new Error("Failed to upload resume");
  return res.json();
};

export const askAI = async (message) => {
  const res = await fetch(`${API_BASE}/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });

  if (!res.ok) throw new Error("AI failed");
  return res.json();
};
