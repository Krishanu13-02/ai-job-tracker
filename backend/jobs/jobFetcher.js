import fetch from "node-fetch";

export async function fetchJobs(query = "developer") {
  const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${process.env.ADZUNA_APP_ID}&app_key=${process.env.ADZUNA_APP_KEY}&results_per_page=20&what=${query}`;

  const res = await fetch(url);
  const data = await res.json();

  return data.results.map(job => ({
    id: job.id,
    title: job.title,
    company: job.company.display_name,
    location: job.location.display_name,
    description: job.description,
    type: job.contract_time || "N/A",
    redirect_url: job.redirect_url,
    created: job.created
  }));
}
