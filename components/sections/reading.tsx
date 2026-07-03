import { reading } from "@/site.config";
import { Section, SectionHeader } from "../ui/section";
import { Reveal } from "../ui/reveal";
import { Card } from "../ui/card";

function Shelf({ title, books }: { title: string; books: string[] }) {
  return (
    <Card>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
        {title}
      </p>
      <ul className="mt-4 space-y-3">
        {books.map((book) => (
          <li key={book} className="flex gap-3 text-sm leading-relaxed text-foreground">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted" aria-hidden />
            <span>{book}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function Reading() {
  return (
    <Section id="reading">
      <SectionHeader
        label="Reading"
        title="On the shelf"
        description="What I'm reading across the two halves of the brain — no ratings, no reviews."
      />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Reveal>
          <Shelf title="Technical" books={reading.technical} />
        </Reveal>
        <Reveal delay={0.05}>
          <Shelf title="Beyond Tech" books={reading.humanities} />
        </Reveal>
      </div>
    </Section>
  );
}
