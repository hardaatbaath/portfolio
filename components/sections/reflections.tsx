import { socials } from "@/site.config";
import { getSubstackPosts } from "@/lib/posts";
import { Section, SectionHeader } from "../ui/section";
import { Reveal } from "../ui/reveal";
import { Card } from "../ui/card";
import { PostCard } from "../post-card";
import { ExternalLink } from "../ui/external-link";
import { buttonVariants } from "../ui/button";

export async function Reflections() {
  const posts = await getSubstackPosts();

  return (
    <Section id="thinking">
      <SectionHeader
        label="Thinking"
        title="Reflections"
        description="Less technical, more human — on learning, discipline, and the things I think about away from code. Latest from Substack."
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
              href={socials.substackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "secondary" })}
            >
              View all on Substack
            </a>
          </Reveal>
        </>
      ) : (
        <Reveal>
          <Card className="text-sm text-muted">
            Reflections will appear here automatically once your Substack feed is
            available. In the meantime, read them on{" "}
            <ExternalLink href={socials.substackUrl}>Substack</ExternalLink>.
          </Card>
        </Reveal>
      )}
    </Section>
  );
}
