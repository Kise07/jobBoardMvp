"use client";
import { useEffect, useState } from "react";
import { Job } from "./job";
import { isLocation, parseRoleFromRaw } from "@/libs/parse-job";
import { Heading } from "./heading";
import { SectionHeading } from "./section-heading";
import { Container } from "./container";
import { Banner } from "./banner";

const API_URL = "https://jobboardmvp.onrender.com/jobs";

export const fetchJobs = async () => {
  const res = await fetch(API_URL);
  const json = await res.json();
  return json;
};

type JobType = {
  company: string;
  role: string;
  raw: string;
  tags: string[];
  url: string;
  className?: string;
};

export const Jobs = () => {
  const [jobList, setJobList] = useState<JobType[]>([]);

  useEffect(() => {
    fetchJobs().then((data) => setJobList(data));
  }, []);
  return (
    <Container>
      <Banner />
      <div>
        {jobList.map((job, i) => {
          const resolvedJob = {
            ...job,
            role: isLocation(job.role) ? parseRoleFromRaw(job.raw) : job.role,
          };
          return <Job key={i} job={resolvedJob} />;
        })}
      </div>
    </Container>
  );
};
