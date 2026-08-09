export const Job = ({ job }: { job: { role: string; company: string } }) => {
  return (
    <div className="border-b flex flex-col gap-4 m-2">
      {job.role} - {job.company}
    </div>
  );
};
