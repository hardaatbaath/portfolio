"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { NoteMeta, NoteStatus } from "@/lib/notes";
import { Reveal } from "../ui/reveal";
import { NoteCard } from "./note-card";

type StatusFilter = "all" | NoteStatus;

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "reading", label: "Reading" },
  { value: "summarized", label: "Summarized" },
  { value: "revisited", label: "Revisited" },
];

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3 py-1 font-mono text-xs transition-colors",
        active
          ? "border-accent/40 bg-accent/10 text-accent"
          : "border-border text-muted hover:border-accent/30 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

/** Client-side filterable grid of note cards (by status + tag). */
export function NotesIndex({
  notes,
  tags,
}: {
  notes: NoteMeta[];
  tags: { tag: string; count: number }[];
}) {
  const [status, setStatus] = useState<StatusFilter>("all");
  const [tag, setTag] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      notes.filter(
        (n) =>
          (status === "all" || n.status === status) &&
          (tag === null || n.tags.includes(tag)),
      ),
    [notes, status, tag],
  );

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-border pb-6">
        <div className="flex flex-wrap items-center gap-2">
          {STATUS_FILTERS.map((f) => (
            <Chip
              key={f.value}
              active={status === f.value}
              onClick={() => setStatus(f.value)}
            >
              {f.label}
            </Chip>
          ))}
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <Chip active={tag === null} onClick={() => setTag(null)}>
              # all tags
            </Chip>
            {tags.map(({ tag: t, count }) => (
              <Chip key={t} active={tag === t} onClick={() => setTag(t === tag ? null : t)}>
                #{t}
                <span className="ml-1 opacity-60">{count}</span>
              </Chip>
            ))}
          </div>
        )}
      </div>

      {filtered.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
          {filtered.map((note, i) => (
            <Reveal key={note.slug} delay={(i % 2) * 0.05}>
              <NoteCard note={note} />
            </Reveal>
          ))}
        </div>
      ) : (
        <p className="mt-12 text-center font-mono text-sm text-muted">
          No notes match that filter yet.
        </p>
      )}
    </div>
  );
}
