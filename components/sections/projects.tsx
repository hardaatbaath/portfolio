import { projects } from "@/site.config";
import { GithubIcon } from "../ui/brand-icons";
import { Section, SectionHeader } from "../ui/section";
import { Reveal } from "../ui/reveal";
import { Card } from "../ui/card";
import { StatusBadge, Tag } from "../ui/badge";
import { ExternalLink } from "../ui/external-link";

export function Projects() {
  return (
    <Section id="projects">
      <SectionHeader
        label="Projects"
        title="Things I'm building"
        description="A selection of projects spanning AI, systems programming, and the layers in between."
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {projects.map((project, i) => (
          <Reveal key={project.title} delay={(i % 2) * 0.05}>
            <Card interactive className="flex h-full flex-col">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-xl font-semibold text-foreground">
                  {project.title}
                </h3>
                <StatusBadge status={project.status} />
              </div>

              <p className="mt-3 text-sm leading-relaxed text-muted">
                {project.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {project.tags.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>

              <div className="mt-auto flex flex-wrap items-center gap-4 pt-5 text-sm">
                {project.github && (
                  <ExternalLink href={project.github} showIcon={false} className="text-muted hover:text-accent">
                    <GithubIcon className="h-4 w-4" aria-hidden />
                    <span className="ml-1.5">Code</span>
                  </ExternalLink>
                )}
                {project.writeup && (
                  <ExternalLink href={project.writeup}>Write-up</ExternalLink>
                )}
                {project.demo && <ExternalLink href={project.demo}>Demo</ExternalLink>}
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
