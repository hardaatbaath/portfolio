import { cn } from "@/lib/utils";
import type { NoteStatus } from "@/lib/notes";

const STATUS: Record<NoteStatus, { label: string; className: string }> = {
  reading: {
    label: "Reading",
    className: "text-accent border-accent/30 bg-accent/10",
  },
  summarized: {
    label: "Summarized",
    className:
      "text-success border-[color:var(--success)]/30 bg-[color:var(--success)]/10",
  },
  revisited: {
    label: "Revisited",
    className: "text-muted border-border",
  },
};

/** Color-coded reading-status pill, matching the project StatusBadge style. */
export function NoteStatusBadge({
  status,
  className,
}: {
  status: NoteStatus;
  className?: string;
}) {
  const s = STATUS[status] ?? STATUS.summarized;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px] tracking-wide",
        s.className,
        className,
      )}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {s.label}
    </span>
  );
}
