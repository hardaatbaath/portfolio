import { cn } from "@/lib/utils";
import type { ProjectStatus } from "@/site.config";

/** Muted, color-coded status badge. */
export function StatusBadge({ status }: { status: ProjectStatus }) {
  const styles: Record<ProjectStatus, string> = {
    Planning: "text-muted border-border",
    Building: "text-accent border-accent/30 bg-accent/10",
    Testing: "text-accent border-accent/30 bg-accent/10",
    Research: "text-success border-[color:var(--success)]/30 bg-[color:var(--success)]/10",
    Released: "text-success border-[color:var(--success)]/30 bg-[color:var(--success)]/10",
    Archived: "text-muted border-border opacity-70",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px] tracking-wide",
        styles[status],
      )}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {status}
    </span>
  );
}

/** Small tag / skill pill. */
export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-background/50 px-2.5 py-0.5 font-mono text-xs text-muted">
      {children}
    </span>
  );
}
