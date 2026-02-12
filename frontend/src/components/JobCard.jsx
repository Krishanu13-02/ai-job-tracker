export default function JobCard({ job, onApply }) {
  const score = job.matchScore;

  let badgeColor = "#888"; // gray
  if (score >= 70) badgeColor = "#16a34a";     // green
  else if (score >= 40) badgeColor = "#f59e0b"; // yellow

  return (
    <div
      style={{
        border: "1px solid #1f2933",
        background: "#020617",
        padding: "14px",
        marginBottom: "14px",
        borderRadius: "10px",
      }}
    >
      <h3 style={{ margin: "0 0 6px 0" }}>{job.title}</h3>
      <p style={{ color: "#9ca3af", margin: "0 0 8px 0" }}>
        {job.company} • {job.location}
      </p>

      {typeof score === "number" && (
        <span
          style={{
            padding: "4px 8px",
            borderRadius: "999px",
            background: badgeColor,
            color: "#020617",
            fontSize: "12px",
            fontWeight: 600,
            marginRight: "8px",
          }}
        >
          {score}% Match
        </span>
      )}

      {job.matchReason && (
        <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "8px" }}>
          {job.matchReason}
        </p>
      )}

      <div style={{ marginTop: "10px" }}>
        <button onClick={() => onApply(job)}>Apply</button>
      </div>
    </div>
  );
}
