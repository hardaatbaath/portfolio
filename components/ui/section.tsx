import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

/**
 * A page section. `id` is the scroll anchor + URL hash target used by the
 * sidebar. Generous vertical rhythm (spec: ~120–160px between sections).
 */
export function Section({
  id,
  children,
  className,
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      // scroll-mt keeps the section clear of the top when navigated to
      className={cn("scroll-mt-8 py-16 md:py-24", className)}
    >
      {children}
    </section>
  );
}

/** Small mono label + large heading + one-line description. */
export function SectionHeader({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <Reveal className="mb-10 md:mb-12">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">
        {label}
      </p>
      <h2 className="text-2xl font-semibold text-foreground md:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
