import { timeline } from "@/site.config";
import { Section, SectionHeader } from "../ui/section";
import { Reveal } from "../ui/reveal";

export function Timeline() {
  return (
    <Section id="timeline">
      <SectionHeader
        label="Timeline"
        title="How I got here"
        description="A few milestones, in order."
      />

      <Reveal>
        <ol className="relative grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-4">
          {/* Connecting line: vertical on mobile, horizontal on desktop */}
          <span
            aria-hidden
            className="absolute left-[5px] top-2 bottom-2 w-px bg-border md:inset-x-0 md:top-[5px] md:bottom-auto md:h-px md:w-auto"
          />
          {timeline.map((node) => (
            <li key={node.year} className="relative pl-8 md:pl-0 md:pt-8">
              <span
                aria-hidden
                className="absolute left-0 top-1 h-3 w-3 rounded-full border-2 border-accent bg-background md:top-0"
              />
              <p className="font-mono text-sm text-accent">{node.year}</p>
              <h3 className="mt-1 font-display text-base font-semibold text-foreground">
                {node.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{node.detail}</p>
            </li>
          ))}
        </ol>
      </Reveal>
    </Section>
  );
}
