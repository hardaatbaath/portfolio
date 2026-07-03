import { FileText, GraduationCap, Mail } from "lucide-react";
import { identity, socials } from "@/site.config";
import { GithubIcon, LinkedinIcon } from "../ui/brand-icons";
import { Section, SectionHeader } from "../ui/section";
import { Reveal } from "../ui/reveal";
import { Card } from "../ui/card";
import { ContactForm } from "../contact-form";

export function Contact() {
  const links = [
    { href: `mailto:${identity.email}`, label: "Email", Icon: Mail, external: false },
    { href: socials.github, label: "GitHub", Icon: GithubIcon, external: true },
    { href: socials.linkedin, label: "LinkedIn", Icon: LinkedinIcon, external: true },
    { href: socials.scholar, label: "Google Scholar", Icon: GraduationCap, external: true },
    { href: identity.resumeUrl, label: "Résumé", Icon: FileText, external: true },
  ];

  return (
    <Section id="contact">
      <SectionHeader
        label="Contact"
        title="Let's connect"
        description="Building something interesting, or want to talk systems and AI? Drop a line."
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-5">
        <Reveal className="md:col-span-3">
          <Card>
            <ContactForm />
          </Card>
        </Reveal>

        <Reveal delay={0.05} className="md:col-span-2">
          <Card className="h-full">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
              Elsewhere
            </p>
            <ul className="mt-4 space-y-1">
              {links.map(({ href, label, Icon, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-muted transition-colors hover:bg-elevated hover:text-foreground"
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </Card>
        </Reveal>
      </div>
    </Section>
  );
}
