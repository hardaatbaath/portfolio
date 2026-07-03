import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The one card style used everywhere: 16px radius, thin border, soft shadow.
 * `interactive` adds the subtle hover lift (translateY(-3px) + deeper shadow).
 */
export function Card({
  children,
  className,
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={cn(
        "card p-6 transition-all duration-200 ease-in-out md:p-7",
        interactive &&
          "hover:-translate-y-[3px] hover:shadow-[var(--shadow-card-hover)] hover:border-accent/40",
        className,
      )}
    >
      {children}
    </div>
  );
}
