import { DevtoIcon } from "../ui/brand-icons";
import { socials } from "@/site.config";
import { getDevtoPosts } from "@/lib/posts";
import { Section, SectionHeader } from "../ui/section";
import { Reveal } from "../ui/reveal";
import { PostCard } from "../post-card";
import { EmptyFeed } from "../empty-feed";
import { buttonVariants } from "../ui/button";

export async function Writing() {
  const posts = await getDevtoPosts();

  return (
    <Section id="writing">
      <SectionHeader
        label="Blogs"
        title="Blogs"
        description="Write-ups from building things — distributed systems, ML, and the low-level details worth remembering. Latest from dev.to."
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
              More on dev.to
            </a>
          </Reveal>
        </>
      ) : (
        <EmptyFeed
          source="dev.to"
          href={socials.devtoUrl}
          icon={<DevtoIcon className="h-5 w-5" aria-hidden />}
        />
      )}
    </Section>
  );
}
