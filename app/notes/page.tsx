import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAllNotes, getAllTags } from "@/lib/notes";
import { identity } from "@/site.config";
import { NotesIndex } from "@/components/notes/notes-index";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Notes",
  description:
    "Paper summaries and reading notes — mostly ML, systems, and the papers behind the work. A living, interlinked second brain.",
  alternates: { canonical: "/notes" },
  openGraph: {
    title: `Notes · ${identity.name}`,
    description:
      "Paper summaries and reading notes — mostly ML, systems, and the papers behind the work.",
    url: `${identity.siteUrl}/notes`,
    type: "website",
  },
};

export default function NotesPage() {
  const notes = getAllNotes();
  const tags = getAllTags();

  return (
    <div className="py-16 md:py-24">
      <Reveal>
        <Link
          href="/#thinking"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          Back to site
        </Link>

        <p className="mb-3 mt-8 flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.2em] text-accent">
          <span className="h-px w-6 bg-accent/60" aria-hidden />
          Notes
        </p>
        <h1 className="text-2xl font-semibold text-foreground md:text-3xl">
          Paper notes &amp; summaries
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
          Summaries of papers I&apos;m reading — mostly ML, retrieval, and
          systems. Written to be re-read, cross-linked as a second brain, and
          refined over time. Follow the <span className="text-foreground">[[links]]</span> between notes.
        </p>
      </Reveal>

      <div className="mt-10">
        {notes.length > 0 ? (
          <NotesIndex notes={notes} tags={tags} />
        ) : (
          <p className="font-mono text-sm text-muted">
            No notes published yet — first summaries coming soon.
          </p>
        )}
      </div>
    </div>
  );
}
