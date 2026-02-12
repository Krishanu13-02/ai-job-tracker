import { parseFiltersFromChat } from "../ai/langgraphAssistant.js";

export default async function aiRoutes(fastify) {
  fastify.post("/ai/chat", async (req) => {
    const { message } = req.body;
    const text = (message || "").toLowerCase();

    // Fallback rules (no OpenAI call)
    let filters = {};

    if (text.includes("react")) filters.role = "react";
    else if (text.includes("python")) filters.role = "python";
    else if (text.includes("java")) filters.role = "java";
    else if (text.includes("sql")) filters.role = "sql";
    else if (text.includes("clear")) filters.clear = true;

    // Try AI (but don't fail if rate-limited)
    try {
      const aiFilters = await parseFiltersFromChat(message);
      filters = { ...filters, ...aiFilters };
    } catch (e) {
      console.log("⚠️ AI rate-limited, using fallback filters");
    }

    return { filters };
  });
}
