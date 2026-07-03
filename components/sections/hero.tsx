import { identity, socials } from "@/site.config";
import { Section } from "../ui/section";
import { Reveal } from "../ui/reveal";
import { buttonVariants } from "../ui/button";
import { GithubIcon } from "../ui/brand-icons";

export function Hero() {
  return (
    <Section id="overview" className="flex min-h-[85vh] flex-col justify-center py-0">
      <Reveal>
        <p className="mb-6 font-mono text-sm text-muted">
          <span className="text-accent">$</span> whoami
        </p>
      </Reveal>

      <Reveal delay={0.05}>
        <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          {identity.name}
        </h1>
      </Reveal>

      <Reveal delay={0.1}>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted md:text-xl">
          {identity.tagline}
        </p>
      </Reveal>

      <Reveal delay={0.15}>
        <p className="mt-4 font-mono text-sm tracking-wide text-muted">
          {identity.domains}
        </p>
      </Reveal>

      <Reveal delay={0.2}>
        <div className="mt-10 flex flex-wrap gap-3">
          <a href="#projects" className={buttonVariants({ variant: "primary" })}>
            Projects
          </a>
          <a
            href={identity.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "secondary" })}
          >
            Résumé
          </a>
          <a
            href={socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "secondary" })}
          >
            <GithubIcon className="h-4 w-4" aria-hidden />
            GitHub
          </a>
        </div>
      </Reveal>
    </Section>
  );
}
