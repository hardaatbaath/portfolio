import type { MetadataRoute } from "next";
import { identity } from "@/site.config";
import { getAllNotes } from "@/lib/notes";

export default function sitemap(): MetadataRoute.Sitemap {
  const notes = getAllNotes();
  const lastNoteUpdate = notes[0]?.updated ?? notes[0]?.date;

  return [
    {
      url: identity.siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${identity.siteUrl}/notes`,
      lastModified: lastNoteUpdate ? new Date(lastNoteUpdate) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...notes.map((n) => ({
      url: `${identity.siteUrl}/notes/${n.slug}`,
      lastModified: new Date(n.updated || n.date || Date.now()),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
