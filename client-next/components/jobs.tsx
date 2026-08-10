"use client";
import { isLocation, parseRoleFromRaw } from "@/libs/parse-job";
import { Banner } from "./banner";
import { Container } from "./container";
import { Job } from "./job";

type JobType = {
  company: string;
  role: string;
  raw: string;
  tags: string[];
  url: string;
  className?: string;
};

export const Jobs = ({ initialJobs }: { initialJobs: JobType[] }) => {
  return (
    <Container>
      <Banner />
      <div>
        {initialJobs.map((job, i) => {
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
