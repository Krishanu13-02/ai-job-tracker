import Fastify from "fastify";
import cors from "@fastify/cors";
import cors from "cors";
import multipart from "@fastify/multipart";
import dotenv from "dotenv";

import jobsRoutes from "./routes/jobs.js";
import resumeRoutes from "./routes/resume.js";
import applicationsRoutes from "./routes/applications.js";
import aiRoutes from "./routes/ai.js";

app.use(cors({
  origin: "*"
}));


dotenv.config();

const fastify = Fastify({ logger: true });

await fastify.register(cors, { origin: true });
await fastify.register(multipart);

fastify.get("/", async () => {
  return { status: "Backend is running" };
});

fastify.register(jobsRoutes);
fastify.register(resumeRoutes);
fastify.register(applicationsRoutes);
fastify.register(aiRoutes);


const PORT = process.env.PORT || 5000;

fastify.listen({ port: PORT, host: "0.0.0.0" }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`🚀 Backend running on port ${PORT}`);
});
