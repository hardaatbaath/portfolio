/**
 * Blog feed fetchers.
 *
 * Both run at build time and revalidate hourly via ISR (`next.revalidate`),
 * so fresh posts appear without any manual update or client-side JS. Every
 * fetch fails soft: a network error or missing handle returns an empty list
 * and the section renders a graceful fallback instead of crashing the page.
 */
import { XMLParser } from "fast-xml-parser";
import { socials, feeds } from "@/site.config";

export type Post = {
  title: string;
  url: string;
  description: string;
  date: string; // ISO string, may be ""
  tags: string[];
  readingTime?: string;
  source: "dev.to" | "Substack";
};

const REVALIDATE = 3600; // 1 hour

// --- dev.to (public REST API) -----------------------------------------------
type DevToArticle = {
  title: string;
  description: string;
  url: string;
  published_at: string;
  tag_list: string[];
  reading_time_minutes?: number;
};

export async function getDevtoPosts(): Promise<Post[]> {
  const username = socials.devtoUsername;
  if (!username || username.startsWith("your-")) return [];

  try {
    const res = await fetch(
      `https://dev.to/api/articles?username=${encodeURIComponent(username)}&per_page=${feeds.devtoCount}`,
      { next: { revalidate: REVALIDATE }, headers: { Accept: "application/json" } },
    );
    if (!res.ok) return [];
    const data = (await res.json()) as DevToArticle[];
    return data.slice(0, feeds.devtoCount).map((a) => ({
      title: a.title,
      url: a.url,
      description: a.description ?? "",
      date: a.published_at ?? "",
      tags: Array.isArray(a.tag_list) ? a.tag_list : [],
      readingTime: a.reading_time_minutes ? `${a.reading_time_minutes} min read` : undefined,
      source: "dev.to",
    }));
  } catch {
    return [];
  }
}

// --- Substack (public RSS feed) ---------------------------------------------
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export async function getSubstackPosts(): Promise<Post[]> {
  const base = socials.substackUrl?.replace(/\/$/, "");
  if (!base || base.includes("your-name")) return [];

  try {
    const res = await fetch(`${base}/feed`, {
      next: { revalidate: REVALIDATE },
      headers: { Accept: "application/rss+xml, application/xml, text/xml" },
    });
    if (!res.ok) return [];
    const xml = await res.text();

    const parser = new XMLParser({ ignoreAttributes: false, trimValues: true });
    const parsed = parser.parse(xml);
    const rawItems = parsed?.rss?.channel?.item;
    if (!rawItems) return [];
    const items = Array.isArray(rawItems) ? rawItems : [rawItems];

    return items.slice(0, feeds.substackCount).map((item): Post => {
      const raw = String(item.description ?? item["content:encoded"] ?? "");
      const description = stripHtml(raw).slice(0, 180);
      return {
        title: String(item.title ?? "Untitled"),
        url: String(item.link ?? base),
        description: description ? `${description}…` : "",
        date: item.pubDate ? String(item.pubDate) : "",
        tags: [],
        source: "Substack",
      };
    });
  } catch {
    return [];
  }
}
