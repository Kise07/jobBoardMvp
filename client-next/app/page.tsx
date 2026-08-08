import { Jobs } from "@/components/jobs";

const mockJobs = [
  {
    title: "Frontend Developer",
    company: "TechCorp",
  },
  {
    title: "Backend Engineer",
    company: "Innovatech",
  },
  {
    title: "Full Stack Developer",
    company: "WebSolutions",
  },
];

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto">
      <Jobs jobs={mockJobs} />
    </div>
  );
}
