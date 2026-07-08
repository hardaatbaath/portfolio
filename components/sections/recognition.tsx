import { recognition } from "@/site.config";
import { Section, SectionHeader } from "../ui/section";
import { Reveal } from "../ui/reveal";
import { Card } from "../ui/card";

export function Recognition() {
  return (
    <Section id="recognition">
      <SectionHeader
        label="Milestones"
        title="Accomplishments"
        description="A few milestones I'm proud of."
      />

      <Reveal>
        {/* Full-bleed 2-row horizontal scroller: fills two rows, then grows to
            the right. Scroll sideways to see more — never grows down. */}
        <div className="relative -mx-6 md:-mx-10">
          <ul className="no-scrollbar grid grid-flow-col grid-rows-2 gap-4 overflow-x-auto px-6 py-3 [grid-auto-columns:minmax(280px,22rem)] md:px-10">
            {recognition.map((award) => (
              <li key={award.title} className="snap-start">
                <Card interactive className="h-full">
                  <p className="font-mono text-xs text-accent">{award.year}</p>
                  <h3 className="mt-2 font-display text-base font-semibold leading-snug text-foreground">
                    {award.title}
                  </h3>
                  {award.detail && (
                    <p className="mt-2 text-sm leading-relaxed text-muted">{award.detail}</p>
                  )}
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}
