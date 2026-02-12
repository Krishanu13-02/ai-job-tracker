import { fetchJobs } from "../jobs/jobFetcher.js";
import { matchJob } from "../ai/langchainMatcher.js";
import { resumeText } from "./resume.js";

export default async function jobsRoutes(fastify) {
  fastify.get("/jobs", async (req) => {
    try {
      const q = req.query.q || "developer";
      const jobs = await fetchJobs(q);

      if (!resumeText) {
        return jobs.map((job) => ({
          ...job,
          matchScore: 0,
          matchReason: "Upload resume to see match",
        }));
      }

      const enriched = [];
      for (const job of jobs) {
        try {
          const match = await matchJob(resumeText, job);
          enriched.push({
            ...job,
            matchScore: match.score,
            matchReason: match.reason,
          });
        } catch (e) {
          console.error("❌ Match failed for job:", job.title, e.message);
          enriched.push({
            ...job,
            matchScore: 0,
            matchReason: "AI match failed",
          });
        }
      }

      return enriched;
    } catch (e) {
      console.error("❌ /jobs route failed:", e);
      return { error: "Jobs fetch failed" };
    }
  });
}
