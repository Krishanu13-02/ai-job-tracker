import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import dotenv from "dotenv";

import jobsRoutes from "./routes/jobs.js";
import resumeRoutes from "./routes/resume.js";
import aiRoutes from "./routes/ai.js";
import applicationsRoutes from "./routes/applications.js";

dotenv.config();

const fastify = Fastify({ logger: true });

await fastify.register(cors, { origin: true });
await fastify.register(multipart);

await fastify.register(jobsRoutes);
await fastify.register(resumeRoutes);
await fastify.register(aiRoutes);
await fastify.register(applicationsRoutes);

fastify.get("/", async () => {
  return { status: "Backend running" };
});

fastify.listen({ port: 5000 }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log("🚀 Backend running on http://localhost:5000");
});
