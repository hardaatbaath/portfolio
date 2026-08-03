import Link from "next/link";
import { ArrowRight, NotebookPen } from "lucide-react";
import { getAllNotes } from "@/lib/notes";
import { Section, SectionHeader } from "../ui/section";
import { Reveal } from "../ui/reveal";
import { NoteCard } from "../notes/note-card";
import { buttonVariants } from "../ui/button";

/** Homepage teaser: the latest few paper notes + a link to the full index. */
export function Notes() {
  const notes = getAllNotes().slice(0, 3);

  return (
    <Section id="notes">
      <SectionHeader
        label="Notes"
        title="Paper notes"
        description="Summaries of papers I'm reading — mostly ML, retrieval, and systems. A living, cross-linked second brain, written to be re-read."
      />

      {notes.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((note, i) => (
              <Reveal key={note.slug} delay={(i % 3) * 0.05}>
                <NoteCard note={note} />
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8">
            <Link href="/notes" className={buttonVariants({ variant: "secondary" })}>
              All notes
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Reveal>
        </>
      ) : (
        <Reveal>
          <div className="card flex flex-col items-center gap-3 p-10 text-center">
            <NotebookPen className="h-6 w-6 text-muted" aria-hidden />
            <p className="text-sm text-muted">
              First paper summaries coming soon.
            </p>
          </div>
        </Reveal>
      )}
    </Section>
  );
}
