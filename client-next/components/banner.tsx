import { Heading } from "./heading";
import { SectionHeading } from "./section-heading";
import { ModeToggle } from "./toggle-mode";

export const Banner = () => {
  return (
    <div className="flex items-center justify-between">
      <Heading>2026 HN Job Board</Heading>
      <div className="flex flex-col justify-center items-end gap-2">
        <ModeToggle className="top-8 right-9" />
        <SectionHeading delay={0.2}>September Edition</SectionHeading>
      </div>
    </div>
  );
};
