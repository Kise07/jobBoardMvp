import Job from "./job";

export default function Jobs({ job }) {
  return (
    <>
      <div className="jobs bg-sky-900 text-white text-2xl p-4 shadow-md">
        Jobs Hiring Board
      </div>
      <div>
        {
          job.map(
            (job, i) => <Job key={i} job={job} />
          )
        }
      </div>
    </>
  )
}
