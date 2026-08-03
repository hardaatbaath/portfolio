/**
 * Paper-notes data layer.
 *
 * Notes are plain Markdown files in `content/notes/*.md` — a folder you can
 * open directly as an Obsidian vault. Frontmatter (YAML) carries the metadata;
 * the body is standard Markdown (math, code, tables, `[[wikilinks]]`, callouts).
 *
 * Everything here runs server-side only (uses `fs`) and is read once at build
 * time. Notes render as static pages; there is no client-side fetching.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const NOTES_DIR = path.join(process.cwd(), "content", "notes");

export type NoteStatus = "reading" | "summarized" | "revisited";

export type NoteMeta = {
  slug: string;
  title: string;
  paper?: string; // link to the arXiv / DOI / PDF
  authors?: string; // free text, e.g. "Vaswani et al."
  venue?: string; // e.g. "NeurIPS 2017"
  date: string; // ISO string
  updated?: string; // ISO string
  tags: string[];
  status: NoteStatus;
  summary?: string; // one-line teaser for cards + SEO
};

export type Note = NoteMeta & { content: string };

/** URL-safe slug from a title or filename. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function toISO(value: unknown): string {
  if (!value) return "";
  // gray-matter parses YAML dates into Date objects; strings pass through.
  if (value instanceof Date) return value.toISOString();
  const d = new Date(String(value));
  return isNaN(d.getTime()) ? "" : d.toISOString();
}

function normalizeStatus(value: unknown): NoteStatus {
  const s = String(value ?? "").toLowerCase();
  if (s === "reading" || s === "summarized" || s === "revisited") return s;
  return "summarized";
}

function readFilenames(): string[] {
  try {
    return fs.readdirSync(NOTES_DIR).filter((f) => f.endsWith(".md"));
  } catch {
    return []; // no folder yet → empty list, pages render a graceful fallback
  }
}

function parseFile(filename: string): Note {
  const raw = fs.readFileSync(path.join(NOTES_DIR, filename), "utf8");
  const { data, content } = matter(raw);
  const base = filename.replace(/\.md$/, "");
  const slug = data.slug ? slugify(String(data.slug)) : slugify(base);

  const tags = Array.isArray(data.tags)
    ? data.tags.map((t: unknown) => String(t))
    : typeof data.tags === "string"
      ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

  return {
    slug,
    title: String(data.title ?? base),
    paper: data.paper ? String(data.paper) : undefined,
    authors: data.authors ? String(data.authors) : undefined,
    venue: data.venue ? String(data.venue) : undefined,
    date: toISO(data.date),
    updated: data.updated ? toISO(data.updated) : undefined,
    tags,
    status: normalizeStatus(data.status),
    summary: data.summary ? String(data.summary) : undefined,
    content,
  };
}

// Parse every note once per build/server process.
let _cache: Note[] | null = null;
function allNotesRaw(): Note[] {
  if (_cache) return _cache;
  _cache = readFilenames()
    .map(parseFile)
    // Newest first, using the most recent of updated/date.
    .sort((a, b) => (b.updated ?? b.date).localeCompare(a.updated ?? a.date));
  return _cache;
}

/** Metadata for every note (no body), newest first. */
export function getAllNotes(): NoteMeta[] {
  return allNotesRaw().map(({ content, ...meta }) => {
    void content;
    return meta;
  });
}

/** A single note (with body) by slug, or null if it doesn't exist. */
export function getNote(slug: string): Note | null {
  return allNotesRaw().find((n) => n.slug === slug) ?? null;
}

/** All slugs — for `generateStaticParams`. */
export function getAllSlugs(): string[] {
  return allNotesRaw().map((n) => n.slug);
}

/** Unique tags with counts, most-used first. */
export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const n of allNotesRaw()) {
    for (const t of n.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

// ---- Wikilinks + backlinks ---------------------------------------------------

const WIKILINK_RE = /\[\[([^\]]+)\]\]/g;

/** Raw wikilink targets in a note body (before the `|alias` and `#anchor`). */
export function extractWikilinkTargets(content: string): string[] {
  const targets: string[] = [];
  let m: RegExpExecArray | null;
  WIKILINK_RE.lastIndex = 0;
  while ((m = WIKILINK_RE.exec(content))) {
    const target = m[1].split("|")[0].split("#")[0].trim();
    if (target) targets.push(target);
  }
  return targets;
}

export type ResolvedLink = { href: string; title: string; exists: boolean };

/**
 * Build a resolver mapping a wikilink target (slug or title, case-insensitive)
 * to a `/notes/<slug>` href. Unresolved targets are flagged so the renderer can
 * style them as "missing" links.
 */
export function buildResolver(): (target: string) => ResolvedLink {
  const notes = allNotesRaw();
  const bySlug = new Map(notes.map((n) => [n.slug, n]));
  const byTitle = new Map(notes.map((n) => [n.title.toLowerCase(), n]));

  return (target: string): ResolvedLink => {
    const anchor = target.includes("#") ? `#${slugify(target.split("#")[1])}` : "";
    const key = target.split("#")[0].trim();
    const hit = bySlug.get(slugify(key)) ?? byTitle.get(key.toLowerCase());
    if (hit) {
      return { href: `/notes/${hit.slug}${anchor}`, title: hit.title, exists: true };
    }
    return { href: `/notes/${slugify(key)}${anchor}`, title: key, exists: false };
  };
}

/** Notes that link (via `[[wikilink]]`) to the given slug, newest first. */
export function getBacklinks(slug: string): NoteMeta[] {
  const notes = allNotesRaw();
  const resolve = buildResolver();
  const out: NoteMeta[] = [];
  for (const n of notes) {
    if (n.slug === slug) continue;
    const targets = extractWikilinkTargets(n.content);
    const linksHere = targets.some((t) => {
      const r = resolve(t);
      return r.exists && r.href.replace(/#.*$/, "") === `/notes/${slug}`;
    });
    if (linksHere) {
      const { content, ...meta } = n;
      void content;
      out.push(meta);
    }
  }
  return out;
}
