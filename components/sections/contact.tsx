import { Section, SectionHeader } from "../ui/section";
import { Reveal } from "../ui/reveal";
import { Card } from "../ui/card";
import { ContactForm } from "../contact-form";

export function Contact() {
  return (
    <Section id="contact">
      <SectionHeader
        label="Contact"
        title="Let's connect"
        description="Building something interesting, or want to talk systems and AI? Drop a line — or find me via the links in the sidebar."
      />

      <Reveal>
        <Card className="max-w-2xl">
          <ContactForm />
        </Card>
      </Reveal>
    </Section>
  );
}
