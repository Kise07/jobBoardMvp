export const Jobs = ({
  jobs,
}: {
  jobs: { title: string; company: string }[];
}) => {
  return (
    <>
      <div className="text-2xl m-10">2026 HN Job Board</div>
      <div className="flex flex-col gap-3 mx-auto">
        {jobs.map((job, i) => (
          <div
            key={i}
            className="py-0.5 px-2 m-auto border-b border-neutral-100"
          >
            {job.title} - {job.company}
          </div>
        ))}
      </div>
    </>
  );
};
