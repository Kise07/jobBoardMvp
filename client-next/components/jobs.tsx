"use client";
import { useEffect, useState } from "react";
import { Job } from "./job";

const API_URL = "https://jobboardmvp.onrender.com/jobs";

export const fetchJobs = async () => {
  const res = await fetch(API_URL);
  const json = await res.json();

  // console.log({ json });
  return json;
};

export const Jobs = ({
  jobs,
}: {
  jobs: { title: string; company: string }[];
}) => {
  const [jobList, setJobList] = useState<{ role: string; company: string }[]>(
    [],
  );

  useEffect(() => {
    fetchJobs().then((data) => setJobList(data));
  }, []);
  return (
    <div>
      <div className="text-2xl m-10">2026 HN Job Board</div>
      <div>
        {jobList.map((job, i) => (
          <Job key={i} job={job} />
        ))}
      </div>
    </div>
  );
};
