import { Jobs } from "@/components/jobs";

const mockJobs = [
  {
    role: "Frontend Developer",
    company: "TechCorp",
  },
  {
    role: "Backend Engineer",
    company: "Innovatech",
  },
  {
    role: "Full Stack Developer",
    company: "WebSolutions",
  },
];

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto">
      <Jobs />
    </div>
  );
}
