import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink as ExternalLinkIcon } from "lucide-react";
import "katex/dist/katex.min.css";
import { getAllSlugs, getNote, getBacklinks } from "@/lib/notes";
import { renderMarkdown } from "@/lib/markdown";
import { formatMonthYear } from "@/lib/utils";
import { identity } from "@/site.config";
import { NoteStatusBadge } from "@/components/notes/note-status";
import { Mermaid } from "@/components/notes/mermaid";
import { Backlinks } from "@/components/notes/backlinks";
import { Tag } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) return {};
  const description = note.summary ?? `Notes on ${note.title}.`;
  return {
    title: note.title,
    description,
    keywords: note.tags,
    alternates: { canonical: `/notes/${note.slug}` },
    openGraph: {
      title: `${note.title} · Notes`,
      description,
      url: `${identity.siteUrl}/notes/${note.slug}`,
      type: "article",
      publishedTime: note.date || undefined,
      modifiedTime: note.updated || undefined,
      tags: note.tags,
    },
  };
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) notFound();

  const html = await renderMarkdown(note.content);
  const backlinks = getBacklinks(note.slug);
  const date = formatMonthYear(note.date);
  const updated = note.updated ? formatMonthYear(note.updated) : "";

  return (
    <article className="py-16 md:py-24">
      <Reveal>
        <Link
          href="/notes"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          All notes
        </Link>

        <header className="mt-8 border-b border-border pb-8">
          <div className="flex flex-wrap items-center gap-3">
            <NoteStatusBadge status={note.status} />
            {date && (
              <span className="font-mono text-xs text-muted">
                {date}
                {updated && updated !== date ? ` · updated ${updated}` : ""}
              </span>
            )}
          </div>

          <h1 className="mt-4 text-3xl font-semibold leading-tight text-foreground md:text-4xl">
            {note.title}
          </h1>

          {(note.authors || note.venue) && (
            <p className="mt-2 font-mono text-sm text-muted">
              {[note.authors, note.venue].filter(Boolean).join(" · ")}
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
            {note.paper && (
              <a
                href={note.paper}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:brightness-110"
              >
                Read the paper
                <ExternalLinkIcon className="h-3.5 w-3.5" aria-hidden />
              </a>
            )}
            {note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {note.tags.map((t) => (
                  <Tag key={t}>#{t}</Tag>
                ))}
              </div>
            )}
          </div>
        </header>
      </Reveal>

      <Reveal>
        <div
          className="note-prose mt-10"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </Reveal>
      <Mermaid />

      <Backlinks notes={backlinks} />
    </article>
  );
}
