import { cn } from "@/libs/utils";
import { Container } from "./container";
import { motion } from "motion/react";

export const Job = ({
  job,
}: {
  job: {
    role: string;
    company: string;
    raw: string;
    tags: string[];
    className?: string;
  };
}) => {
  return (
    <Container className="mb-4">
      <Card
        company={job.company}
        role={job.role}
        raw={job.raw}
        tags={job.tags}
        className={job.className}
      />
    </Container>
  );
};

const Card = ({
  company,
  role,
  raw,
  tags,
  className,
}: {
  company: string;
  role: string;
  raw: string;
  tags: string[];
  className?: string;
}) => {
  return (
    <motion.div
      key={role}
      className="flex flex-col items-start gap-4 rounded-[16px] border border-transparent bg-white p-4 ring-1 shadow-black/10 ring-black/10"
    >
      <div className="flex items-center gap-2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn(
            "mt-1 flex size-6 shrink-0 items-center justify-center rounded-full",
            className,
          )}
        >
          {company}
        </motion.div>
        <motion.p
          initial={{ opacity: 0, filter: `blur(10px)` }}
          animate={{ opacity: 1, filter: `blur(0px)` }}
          transition={{ delay: 0.1 }}
          className="text-lg font-bold text-neutral-800"
        >
          {role}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-base text-neutral-600">Tone Guidelines</p>
        <p className="mt-2 mb-4 rounded-sm border border-dashed border-neutral-200 px-2 py-1 text-sm text-neutral-600">
          {raw}
        </p>
        <div className="mt-2 flex flex-row flex-wrap gap-2">
          {tags.map((tag, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 * idx * 0.5 }}
            >
              <Tag key={idx} text={tag} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

const Tag = ({ text }: { text: string }) => {
  return (
    <div className="flex w-fit items-center gap-1 rounded-sm border border-neutral-100 px-1 py-0.5 text-sm">
      <p className="text-xs text-neutral-500">{text}</p>
    </div>
  );
};
