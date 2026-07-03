import { FileText, Mail } from "lucide-react";
import { identity, socials } from "@/site.config";
import { DevtoIcon, GithubIcon, LinkedinIcon, SubstackIcon, XIcon } from "./ui/brand-icons";

const iconClass =
  "inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-elevated hover:text-foreground focus-visible:text-foreground";

/** Icon-only social row. Any link with an empty href is hidden automatically. */
export function SocialLinks() {
  const links = [
    { href: socials.github, label: "GitHub", Icon: GithubIcon, external: true },
    { href: socials.linkedin, label: "LinkedIn", Icon: LinkedinIcon, external: true },
    { href: socials.twitter, label: "X (Twitter)", Icon: XIcon, external: true },
    { href: socials.devtoUrl, label: "dev.to", Icon: DevtoIcon, external: true },
    { href: socials.substackUrl, label: "Substack", Icon: SubstackIcon, external: true },
    { href: `mailto:${identity.email}`, label: "Email", Icon: Mail, external: false },
    { href: identity.resumeUrl, label: "Résumé", Icon: FileText, external: true },
  ].filter((l) => l.href && !l.href.endsWith("mailto:"));

  return (
    <nav aria-label="Social links" className="flex flex-wrap items-center gap-0.5">
      {links.map(({ href, label, Icon, external }) => (
        <a
          key={label}
          href={href}
          title={label}
          aria-label={label}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className={iconClass}
        >
          <Icon className="h-[18px] w-[18px]" aria-hidden />
        </a>
      ))}
    </nav>
  );
}
