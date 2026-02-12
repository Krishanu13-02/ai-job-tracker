import { useState } from "react";

const API_BASE = "https://ai-job-tracker-2-elbs.onrender.com/jobs"; // 🔴 CHANGE THIS

export default function ChatAssistant({ onFilters }) {
  const [msg, setMsg] = useState("");

  const send = async () => {
    const text = msg.toLowerCase();

    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg }),
    });

    const data = await res.json();
    let filters = data.filters || {};

    // Fallback if AI returns empty
    if (!filters.role) {
      if (text.includes("react")) filters.role = "react";
      else if (text.includes("python")) filters.role = "python";
      else if (text.includes("java")) filters.role = "java";
      else if (text.includes("sql")) filters.role = "sql";
    }

    if (filters.clear) onFilters({ clear: true });
    else onFilters(filters);

    setMsg("");
  };

  return (
    <div style={{ margin: "12px 0" }}>
      <input
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        placeholder="Ask AI to filter jobs..."
      />
      <button onClick={send}>Send</button>
    </div>
  );
}