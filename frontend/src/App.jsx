import { useEffect, useState } from "react";
import JobCard from "./components/JobCard";
import Filters from "./components/Filters";
import ChatAssistant from "./components/ChatAssistant";
import "./App.css";

const API_BASE = "https://ai-job-tracker-2-elbs.onrender.com/jobs"; // 🔴 CHANGE THIS

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [role, setRole] = useState("Any");
  const [error, setError] = useState("");
  const [Resume, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load jobs from backend
  useEffect(() => {
    fetch(`${API_BASE}/jobs`)
      .then((res) => res.json())
      .then((data) => {
        setJobs(data);
        setFilteredJobs(data);
      })
      .catch(() => {
        setError("Failed to load jobs from backend.");
      });
  }, []);

  // Role filter
  useEffect(() => {
    if (role === "Any") {
      setFilteredJobs(jobs);
    } else {
      setFilteredJobs(
        jobs.filter((job) =>
          job.title.toLowerCase().includes(role.toLowerCase())
        )
      );
    }
  }, [role, jobs]);

  // Resume upload
  const uploadResume = async (e) => {
    const file = e.target.files[0];
    setResumeFile(file);

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/resume`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      console.log("Resume parsed:", data);
    } catch (err) {
      console.error(err);
      alert("Resume upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>AI Job Tracker</h1>

      <label>
        Upload Resume:
        <input type="file" accept=".txt,.pdf" onChange={uploadResume} />
      </label>

      <Filters role={role} setRole={setRole} />

      <ChatAssistant setFilteredJobs={setFilteredJobs} />

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Uploading resume...</p>}

      <h2>All Jobs</h2>

      {filteredJobs.length === 0 && <p>No jobs found.</p>}

      {filteredJobs.map((job, idx) => (
        <JobCard key={idx} job={job} />
      ))}
    </div>
  );
}
