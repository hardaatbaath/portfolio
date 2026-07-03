import { formatMonthYear } from "@/lib/utils";
import type { Post } from "@/lib/posts";
import { Card } from "./ui/card";
import { ExternalLink } from "./ui/external-link";
import { Tag } from "./ui/badge";

/** One card style shared by Technical Writing and Reflections. */
export function PostCard({ post }: { post: Post }) {
  const date = formatMonthYear(post.date);
  return (
    <Card interactive className="flex h-full flex-col">
      <div className="flex items-center gap-2 font-mono text-xs text-muted">
        <span className="text-accent">{post.source}</span>
        {date && (
          <>
            <span aria-hidden>·</span>
            <span>{date}</span>
          </>
        )}
        {post.readingTime && (
          <>
            <span aria-hidden>·</span>
            <span>{post.readingTime}</span>
          </>
        )}
      </div>

      <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-foreground">
        {post.title}
      </h3>

      {post.description && (
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
          {post.description}
        </p>
      )}

      {post.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {post.tags.slice(0, 3).map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
      )}

      <div className="mt-auto pt-5">
        <ExternalLink href={post.url} className="text-sm font-medium">
          Read
        </ExternalLink>
      </div>
    </Card>
  );
}
