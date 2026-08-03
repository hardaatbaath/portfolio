import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatMonthYear } from "@/lib/utils";
import type { NoteMeta } from "@/lib/notes";
import { Card } from "../ui/card";
import { Tag } from "../ui/badge";
import { NoteStatusBadge } from "./note-status";

/** A single paper-note preview card, linking to its reader page. */
export function NoteCard({ note }: { note: NoteMeta }) {
  const date = formatMonthYear(note.updated ?? note.date);
  return (
    <Link
      href={`/notes/${note.slug}`}
      className="group block h-full rounded-[var(--radius-card)] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <Card interactive className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-3">
          <NoteStatusBadge status={note.status} />
          {date && <span className="font-mono text-xs text-muted">{date}</span>}
        </div>

        <h3 className="mt-4 font-display text-lg font-semibold leading-snug text-foreground">
          {note.title}
        </h3>

        {(note.authors || note.venue) && (
          <p className="mt-1 font-mono text-xs text-muted">
            {[note.authors, note.venue].filter(Boolean).join(" · ")}
          </p>
        )}

        {note.summary && (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">
            {note.summary}
          </p>
        )}

        {note.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {note.tags.slice(0, 4).map((t) => (
              <Tag key={t}>#{t}</Tag>
            ))}
          </div>
        )}

        <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-medium text-accent">
          Read note
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden
          />
        </span>
      </Card>
    </Link>
  );
}
