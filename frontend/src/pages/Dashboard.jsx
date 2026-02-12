import { useEffect, useState } from "react";

export default function Dashboard() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/applications")
      .then((res) => res.json())
      .then(setApps);
  }, []);

  return (
    <div style={{ padding: "16px" }}>
      <h2>My Applications</h2>

      {apps.map((job) => (
        <div key={job.id} style={{ border: "1px solid #333", padding: "12px", marginBottom: "12px" }}>
          <h4>{job.title}</h4>
          <p>{job.company} • {job.location}</p>
          <p>Status: <b>{job.status}</b></p>

          <div>
            <small>Timeline:</small>
            <ul>
              {job.timeline.map((t, i) => (
                <li key={i}>{t.status} — {new Date(t.at).toLocaleString()}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
