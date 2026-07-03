import { socials } from "@/site.config";
import { getSubstackPosts } from "@/lib/posts";
import { Section, SectionHeader } from "../ui/section";
import { Reveal } from "../ui/reveal";
import { PostCard } from "../post-card";
import { EmptyFeed } from "../empty-feed";
import { buttonVariants } from "../ui/button";
import { PenLine } from "lucide-react";

export async function Reflections() {
  const posts = await getSubstackPosts();

  return (
    <Section id="thinking">
      <SectionHeader
        label="Beyond Code"
        title="Things that moved me"
        description="Essays and half-formed thoughts — on learning, discipline, music, and the things I sit with away from the screen. Latest from Substack."
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
              More on Substack
            </a>
          </Reveal>
        </>
      ) : (
        <EmptyFeed
          source="Substack"
          href={socials.substackUrl}
          icon={<PenLine className="h-5 w-5" aria-hidden />}
        />
      )}
    </Section>
  );
}
