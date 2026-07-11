import { identity, socials } from "@/site.config";
import { Section } from "../ui/section";
import { Reveal } from "../ui/reveal";
import { buttonVariants } from "../ui/button";
import { GithubIcon } from "../ui/brand-icons";
import { ExternalLink } from "../ui/external-link";
import { ContributionGraph } from "../contribution-graph";

export function Hero() {
  return (
    <Section id="overview" className="flex min-h-[82vh] flex-col justify-center py-0">
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
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
          I&apos;m a Machine Learning Engineer at{" "}
          <ExternalLink href="https://nurix.ai" showIcon={false} className="font-medium">
            Nurix.AI
          </ExternalLink>
          , building speech and multilingual RAG systems. Before that — deep-learning
          research, an AI role in Tokyo, and leading autonomy on a{" "}
          <ExternalLink
            href="https://kratos-the-rover.github.io/"
            showIcon={false}
            className="font-medium"
          >
            student Mars rover
          </ExternalLink>
          .
        </p>
      </Reveal>

      <Reveal delay={0.15}>
        <p className="mt-5 font-mono text-sm tracking-wide text-muted">{identity.domains}</p>
      </Reveal>

      <Reveal delay={0.2}>
        <div className="mt-10 flex flex-wrap gap-3">
          <a href="#projects" className={buttonVariants({ variant: "primary" })}>
            View work
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

      <Reveal delay={0.28} className="mt-14">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">
          <span className="text-accent">{">"}</span> Recent activity
        </p>
        <ContributionGraph />
      </Reveal>
    </Section>
  );
}
