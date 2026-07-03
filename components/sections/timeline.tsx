import { timeline } from "@/site.config";
import { Section, SectionHeader } from "../ui/section";
import { Reveal } from "../ui/reveal";
import { Card } from "../ui/card";

export function Timeline() {
  return (
    <Section id="timeline">
      <SectionHeader
        label="Timeline"
        title="The path so far"
        description="The moments make the milestones, and the journey makes the maker."
      />

      <Reveal>
        {/* Full-bleed horizontal scroller so it reads like a track, not a grid */}
        <div className="relative -mx-6 md:-mx-10">
          <ol className="no-scrollbar flex snap-x snap-mandatory items-start gap-4 overflow-x-auto px-6 py-4 md:px-10">
            {timeline.map((node) => (
              <li key={node.period + node.title} className="w-[270px] shrink-0 snap-start">
                {/* dot + rail */}
                <div className="mb-4 flex items-center gap-3">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full border-2 border-accent bg-background" aria-hidden />
                  <span className="h-px flex-1 bg-border" aria-hidden />
                </div>
                <Card className="min-h-[190px] p-5">
                  <p className="font-mono text-xs text-accent">{node.period}</p>
                  <h3 className="mt-2 font-display text-base font-semibold leading-snug text-foreground">
                    {node.title}
                  </h3>
                  <p className="mt-0.5 text-sm text-muted">{node.org}</p>
                  {node.detail && (
                    <p className="mt-3 text-sm leading-relaxed text-muted">{node.detail}</p>
                  )}
                </Card>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>
    </Section>
  );
}
