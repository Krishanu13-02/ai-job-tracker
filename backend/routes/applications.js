let applications = [];

export default async function applicationsRoutes(fastify) {
  fastify.post("/applications", async (req) => {
    const { job, status } = req.body;

    const existing = applications.find((a) => a.id === job.id);

    if (existing) {
      existing.status = status;
      existing.updatedAt = new Date().toISOString();
    } else {
      applications.push({
        ...job,
        status,
        timeline: [
          { status, at: new Date().toISOString() }
        ],
      });
    }

    return { success: true };
  });

  fastify.get("/applications", async () => {
    return applications;
  });
}
