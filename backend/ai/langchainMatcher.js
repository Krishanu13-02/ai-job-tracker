export async function matchJob(resumeText, job) {
  // Fallback keyword matcher (no API calls)
  const resume = resumeText.toLowerCase();
  const desc = job.description.toLowerCase();

  const skills = ["react", "javascript", "node", "python", "java", "sql", "mongodb"];
  let score = 0;
  const matched = [];

  skills.forEach((skill) => {
    if (resume.includes(skill) && desc.includes(skill)) {
      score += 15;
      matched.push(skill);
    }
  });

  score = Math.min(score, 100);

  return {
    score,
    reason: matched.length
      ? `Matched skills: ${matched.join(", ")}`
      : "No strong skill match found",
  };
}
