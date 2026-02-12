import { useEffect, useState } from "react";
import JobCard from "./components/JobCard";
import Filters from "./components/Filters";
import ChatAssistant from "./components/ChatAssistant";

const API_BASE = "https://ai-job-tracker-1-n6hb.onrender.com";

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({});
  const [popupJob, setPopupJob] = useState(null);

  useEffect(() => {
    const q = filters.role || "developer";

    fetch(`${API_BASE}/jobs?q=${encodeURIComponent(q)}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setJobs(data);
        else setJobs([]);
      })
      .catch(() => setJobs([]));
  }, [filters.role]);

  const uploadResume = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    fetch(`${API_BASE}/resume`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => alert(data.message))
      .catch(console.error);
  };

  const onApply = (job) => {
    window.open(job.redirect_url, "_blank");
    setTimeout(() => setPopupJob(job), 1200);
  };

  const saveApplication = (job, status) => {
    fetch(`${API_BASE}/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ job, status }),
    }).then(() => setPopupJob(null));
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

      {/* Resume Upload */}
      <div style={{ marginBottom: "12px" }}>
        <label style={{ marginRight: "8px" }}>Upload Resume:</label>
        <input type="file" accept=".pdf,.txt" onChange={uploadResume} />
      </div>

      <Filters filters={filters} setFilters={setFilters} />

      {/* AI Chat controls filters */}
      <ChatAssistant
        onFilters={(aiFilters) => {
          if (!aiFilters) return;

          if (aiFilters.clear === true) {
            setFilters({});
            return;
          }

          const hasAny =
            aiFilters.role || aiFilters.location || aiFilters.minScore;

          if (hasAny) {
            setFilters((f) => ({ ...f, ...aiFilters }));
          }
        }}
      />

      {bestMatches.length > 0 && (
        <>
          <h3>🔥 Best Matches</h3>
          {bestMatches.map((job) => (
            <JobCard key={job.id} job={job} onApply={onApply} />
          ))}
          <hr />
        </>
      )}

      <h3>All Jobs</h3>
      {otherJobs.map((job) => (
        <JobCard key={job.id} job={job} onApply={onApply} />
      ))}

      {/* Apply Popup */}
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
