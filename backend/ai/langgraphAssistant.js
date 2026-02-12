import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";

const llm = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  model: "gpt-4o-mini",
  temperature: 0,
});

export async function parseFiltersFromChat(message) {
  const prompt = `
Convert the user message into filters.

Rules:
- If user wants React jobs → { "role": "react" }
- If user wants Python jobs → { "role": "python" }
- If user says clear filters → { "clear": true }
- If message doesn't map to filters → return {}

Return ONLY JSON.

User: "${message}"
`;

  const res = await llm.invoke([new HumanMessage(prompt)]);
  try {
    return JSON.parse(res.content);
  } catch {
    return {};
  }
}
