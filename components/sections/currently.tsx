import { currently } from "@/site.config";
import { Section, SectionHeader } from "../ui/section";
import { Reveal } from "../ui/reveal";
import { Card } from "../ui/card";
import { StatusBadge, Tag } from "../ui/badge";

export function Currently() {
  return (
    <Section id="building">
      <SectionHeader
        label="Currently"
        title="What I'm working on"
        description="The active workbench — what's being built, learned, and read right now."
      />

      {/* Building */}
      <Reveal>
        <p className="mb-4 font-mono text-sm text-muted">
          <span className="text-accent">{">"}</span> Building
        </p>
      </Reveal>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {currently.building.map((item, i) => (
          <Reveal key={item.name} delay={i * 0.04}>
            <Card interactive className="h-full">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-base font-semibold text-foreground">
                  {item.name}
                </h3>
                <StatusBadge status={item.status} />
              </div>
              <p className="mt-2 text-sm text-muted">{item.detail}</p>
            </Card>
          </Reveal>
        ))}
      </div>

      {/* Learning */}
      <Reveal className="mt-12">
        <p className="mb-4 font-mono text-sm text-muted">
          <span className="text-accent">{">"}</span> Learning
        </p>
        <div className="flex flex-wrap gap-2">
          {currently.learning.map((skill) => (
            <Tag key={skill}>{skill}</Tag>
          ))}
        </div>
      </Reveal>

      {/* Reading */}
      <Reveal className="mt-10">
        <p className="mb-4 font-mono text-sm text-muted">
          <span className="text-accent">{">"}</span> Reading
        </p>
        <div className="flex flex-wrap gap-2">
          {currently.reading.map((book) => (
            <Tag key={book}>{book}</Tag>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
