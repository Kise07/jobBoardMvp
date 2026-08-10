import { Heading } from "./heading";
import { SectionHeading } from "./section-heading";

export const Banner = () => {
  return (
    <div className="flex items-center justify-between">
      <Heading>2026 HN Job Board</Heading>
      <SectionHeading delay={0.2}>August Edition</SectionHeading>
    </div>
  );
};
