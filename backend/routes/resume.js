let resumeText = "";

export default async function resumeRoutes(fastify) {
  fastify.post("/resume", async (req) => {
    const file = await req.file();
    const buffer = await file.toBuffer();
    resumeText = buffer.toString("utf-8");

    return { success: true, message: "Resume uploaded successfully" };
  });

  fastify.get("/resume", async () => {
    return { hasResume: !!resumeText };
  });
}

export { resumeText };
