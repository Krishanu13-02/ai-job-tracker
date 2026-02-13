import { useEffect, useState } from "react";
import "./App.css";
import JobCard from "./components/JobCard";
import { fetchJobs, uploadResume, askAI } from "./services/api";

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs(query = "") {
    try {
      setLoading(true);
      setError("");
      const data = await fetchJobs(query);
      const list = Array.isArray(data) ? data : [];
      setJobs(list);
      setFilteredJobs(list);
    } catch (e) {
      console.error(e);
      setError("Failed to load jobs from backend.");
      setJobs([]);
      setFilteredJobs([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleResumeUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await uploadResume(file);
      alert("Resume uploaded");
    } catch (err) {
      alert("Resume upload failed");
    }
  }

  async function handleAskAI() {
    if (!msg.trim()) return;
    try {
      const res = await askAI(msg);
      const filters = res?.filters || {};
      if (filters.role) {
        const q = filters.role;
        loadJobs(q);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setMsg("");
    }
  }

  return (
    <div className="app">
      <h1>AI Job Tracker</h1>

      {loading && <p>Loading jobs…</p>}


      <div style={{ marginBottom: 12 }}>
        <input type="file" accept=".txt,.pdf" onChange={handleResumeUpload} />
      </div>

      <div style={{ marginBottom: 12 }}>
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Ask AI to filter jobs (e.g., show react jobs)"
        />
        <button onClick={handleAskAI}>Send</button>
      </div>

      {loading && <p>Loading jobs…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="jobs-container">
        {filteredJobs.length === 0 && !loading ? (
          <p>No jobs available</p>
        ) : (
          filteredJobs.map((job, i) => (
            <JobCard key={job.id || i} job={job} />
          ))
        )}
      </div>
    </div>
  );
}
