import { useEffect, useState } from "react";
import JobCard from "./components/JobCard";
import Filters from "./components/Filters";
import ChatAssistant from "./components/ChatAssistant";

const API =
  import.meta.env.VITE_API_BASE_URL ||
  "https://ai-job-tracker-1-n6hb.onrender.com";

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({});
  const [popupJob, setPopupJob] = useState(null);
  const [loading, setLoading] = useState(false); // ✅ define loading state
  const [error, setError] = useState(null);       // ✅ define error state

  useEffect(() => {
    const q = filters.role || "developer";
    setLoading(true);
    setError(null);

    fetch(`${API}/jobs?q=${encodeURIComponent(q)}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setJobs(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Jobs fetch failed:", err);
        setError("Failed to load jobs from backend.");
        setJobs([]);
      })
      .finally(() => setLoading(false));
  }, [filters.role]);

  const uploadResume = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    fetch(`${API}/resume`, {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Upload failed");
        return res.json();
      })
      .then((data) => alert(data.message || "Resume uploaded"))
      .catch((err) => {
        console.error(err);
        alert("Resume upload failed");
      });
  };

  const onApply = (job) => {
    if (job?.redirect_url) window.open(job.redirect_url, "_blank");
    setTimeout(() => setPopupJob(job), 800);
  };

  const saveApplication = (job, status) => {
    fetch(`${API}/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ job, status }),
    }).finally(() => setPopupJob(null));
  };

  const bestMatches = [...jobs]
    .filter((j) => typeof j.matchScore === "number")
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 6);

  const otherJobs = jobs.filter(
    (j) => !bestMatches.find((b) => b.id === j.id)
  );

  return (
    <div style={{ padding: "16px" }}>
      <h2>AI Job Tracker</h2>

      <div style={{ marginBottom: "12px" }}>
        <label style={{ marginRight: "8px" }}>Upload Resume:</label>
        <input type="file" accept=".pdf,.txt" onChange={uploadResume} />
      </div>

      <Filters filters={filters} setFilters={setFilters} />

      <ChatAssistant
        onFilters={(aiFilters) => {
          if (!aiFilters) return;
          if (aiFilters.clear === true) {
            setFilters({});
            return;
          }
          const hasAny =
            aiFilters.role || aiFilters.location || aiFilters.minScore;
          if (hasAny) setFilters((f) => ({ ...f, ...aiFilters }));
        }}
      />

      {loading && <p>Loading jobs…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {bestMatches.length > 0 && !loading && (
        <>
          <h3>🔥 Best Matches</h3>
          {bestMatches.map((job) => (
            <JobCard key={job.id} job={job} onApply={onApply} />
          ))}
          <hr />
        </>
      )}

      {!loading && <h3>All Jobs</h3>}
      {!loading &&
        otherJobs.map((job) => (
          <JobCard key={job.id} job={job} onApply={onApply} />
        ))}

      {popupJob && (
        <div className="popup">
          <p>
            Did you apply to <b>{popupJob.title}</b> at{" "}
            <b>{popupJob.company}</b>?
          </p>

          <button onClick={() => saveApplication(popupJob, "Applied")}>
            Yes, Applied
          </button>

          <button onClick={() => setPopupJob(null)}>No, just browsing</button>

          <button onClick={() => saveApplication(popupJob, "Applied Earlier")}>
            Applied Earlier
          </button>
        </div>
      )}
    </div>
  );
}
