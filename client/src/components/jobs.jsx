import { useState } from "react";
import Job from "./job";

export default function Jobs({ job }) {
  const [expandedJobId, setExpandedJobId] = useState(null);
  const handleJobClick = (jobId) => {
    setExpandedJobId(prevId => prevId === jobId ? null : jobId);
  };

  return (
    <>
      <div className="jobs bg-sky-900 text-white text-2xl p-4 shadow-md justify-center flex">
        Jobs Hiring Board
      </div>
      <div>
        {
          job.map(
            (job, i) => <Job
              key={i}
              job={job}
              isExpanded={expandedJobId === job.id}
              onToggle={() => handleJobClick(job.id)}
            />
          )
        }
      </div>
    </>
  )
}
