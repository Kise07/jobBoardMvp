"use client";
import { cn } from "@/libs/utils";
import { motion } from "motion/react";

export const SectionHeading = ({
  children,
  delay = 0,
  className,
}: {
  children: string;
  delay: number;
  className?: string;
}) => {
  return (
    <h2
      className={cn(
        "relative m-10 p-2 text-neutral-600 w-fit max-w-lg text-sm font-normal md:text-sm",
        className,
      )}
    >
      <Background />
      {children.split(" ").map((word, idx) => (
        <motion.span
          initial={{
            opacity: 0,
            y: 5,
            filter: "blur(2px)",
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          }}
          transition={{
            delay: delay + idx * 0.05,
            duration: 0.3,
            ease: "easeInOut",
          }}
          key={word + idx}
          viewport={{ once: true }}
          className="inline-block"
        >
          {word}&nbsp;
        </motion.span>
      ))}
    </h2>
  );
};

const Background = () => {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
        delay: 1,
      }}
      className="absolute inset-0 h-full w-full scale-[1.04] bg-neutral-200/50 dark:bg-neutral-100"
    >
      <div className="absolute -top-px -left-px h-1 w-1 animate-pulse rounded-full bg-neutral-400"></div>
      <div className="absolute -top-px -right-px h-1 w-1 animate-pulse rounded-full bg-neutral-400"></div>
      <div className="animate-pulse absolute -bottom-px -left-px h-1 w-1 rounded-full bg-neutral-400"></div>
      <div className="absolute -right-px -bottom-px h-1 w-1 animate-pulse rounded-full bg-neutral-400"></div>
    </motion.div>
  );
};
