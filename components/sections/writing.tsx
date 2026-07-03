import { socials } from "@/site.config";
import { getDevtoPosts } from "@/lib/posts";
import { Section, SectionHeader } from "../ui/section";
import { Reveal } from "../ui/reveal";
import { Card } from "../ui/card";
import { PostCard } from "../post-card";
import { ExternalLink } from "../ui/external-link";
import { buttonVariants } from "../ui/button";

export async function Writing() {
  const posts = await getDevtoPosts();

  return (
    <Section id="writing">
      <SectionHeader
        label="Writing"
        title="Technical writing"
        description="Notes from building things — distributed systems, ML, and low-level programming. Latest from dev.to."
      />

      {posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <Reveal key={post.url} delay={(i % 3) * 0.05}>
                <PostCard post={post} />
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8">
            <a
              href={socials.devtoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "secondary" })}
            >
              View all articles
            </a>
          </Reveal>
        </>
      ) : (
        <Reveal>
          <Card className="text-sm text-muted">
            Articles will appear here automatically once your dev.to feed is
            available. In the meantime, read them on{" "}
            <ExternalLink href={socials.devtoUrl}>dev.to</ExternalLink>.
          </Card>
        </Reveal>
      )}
    </Section>
  );
}
