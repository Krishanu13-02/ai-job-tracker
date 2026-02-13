export default function JobCard({ job, onApply }) {
  if (!job) return null;

  return (
    <div className="job-card">
      <h3>{job.title || "Untitled Role"}</h3>
      <p><b>Company:</b> {job.company || "N/A"}</p>
      <p><b>Location:</b> {job.location || "Remote"}</p>
      {typeof job.matchScore === "number" && (
        <p><b>Match:</b> {job.matchScore}%</p>
      )}
      {job.redirect_url && (
        <button onClick={() => onApply?.(job)}>Apply</button>
      )}
    </div>
  );
}
