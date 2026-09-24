"use client";
import { useTheme } from "next-themes";

import { MoonIcon, SunIcon } from "lucide-react";
import { cn } from "@/libs/utils";

export const ModeToggle = ({ className }: { className?: string }) => {
  const { resolvedTheme, setTheme } = useTheme();
  const SWITCH = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");

  return (
    <button
      onClick={SWITCH}
      className={cn(
        "relative flex size-6 items-center justify-center rounded-md border border-neutral-200",
        className,
      )}
    >
      <SunIcon
        size={15}
        className="absolute inset-0 m-auto scale-100 rotate-0 transition-all duration-300 dark:scale-0 dark:rotate-90 text-neutral-800"
      />
      <MoonIcon
        size={15}
        className="absolute inset-0 m-auto scale-0 rotate-90 transition-all duration-300 dark:scale-100 dark:rotate-0 dark:text-neutral-800"
      />
    </button>
  );
};
