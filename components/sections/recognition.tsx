import { recognition } from "@/site.config";
import { Section, SectionHeader } from "../ui/section";
import { Reveal } from "../ui/reveal";
import { Card } from "../ui/card";

export function Recognition() {
  return (
    <Section id="recognition">
      <SectionHeader
        label="Milestones"
        title="Milestones I'm proud of"
        description="Competitions, research, and honours along the way."
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {recognition.map((award, i) => (
          <Reveal key={award.title} delay={(i % 2) * 0.05}>
            <Card interactive className="h-full">
              <p className="font-mono text-xs text-accent">{award.year}</p>
              <h3 className="mt-2 font-display text-base font-semibold text-foreground">
                {award.title}
              </h3>
              {award.detail && (
                <p className="mt-2 text-sm leading-relaxed text-muted">{award.detail}</p>
              )}
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
