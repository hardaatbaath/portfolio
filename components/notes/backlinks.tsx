import Link from "next/link";
import { Link2 } from "lucide-react";
import type { NoteMeta } from "@/lib/notes";

/** "Referenced by" panel — notes that `[[wikilink]]` to this one. */
export function Backlinks({ notes }: { notes: NoteMeta[] }) {
  if (notes.length === 0) return null;
  return (
    <aside className="mt-16 border-t border-border pt-8">
      <h2 className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-accent">
        <Link2 className="h-4 w-4" aria-hidden />
        Referenced by
      </h2>
      <ul className="mt-4 space-y-2">
        {notes.map((n) => (
          <li key={n.slug}>
            <Link
              href={`/notes/${n.slug}`}
              className="group inline-flex items-baseline gap-2 text-sm text-foreground transition-colors hover:text-accent"
            >
              <span className="font-medium">{n.title}</span>
              {n.summary && (
                <span className="text-muted group-hover:text-accent/70">
                  — {n.summary}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
