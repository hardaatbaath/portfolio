import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./ui/reveal";

/**
 * Compact "nothing published here yet" state. Deliberately slim so an empty
 * feed reads as intentional rather than as a big hole in the page. Posts
 * replace it automatically once the feed has content.
 */
export function EmptyFeed({
  source,
  href,
  icon,
}: {
  source: string;
  href: string;
  icon: ReactNode;
}) {
  return (
    <Reveal>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-between gap-4 rounded-2xl border border-dashed border-border bg-surface/40 px-5 py-4 transition-colors hover:border-accent/40"
      >
        <span className="flex items-center gap-3 text-sm text-muted">
          <span className="text-muted transition-colors group-hover:text-accent">{icon}</span>
          New writing lands here automatically — for now, read along on {source}.
        </span>
        <span className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-accent">
          Follow
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
        </span>
      </a>
    </Reveal>
  );
}
