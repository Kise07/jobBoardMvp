import { Jobs } from "@/components/jobs";

async function getJobs() {
  const res = await fetch("https://jobboardmvp.onrender.com/jobs", {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function Page() {
  const jobs = await getJobs();
  return (
    <div className="max-w-5xl mx-auto bg-neutral-100 dark:bg-neutral-50">
      <Jobs initialJobs={jobs} />
    </div>
  );
}
