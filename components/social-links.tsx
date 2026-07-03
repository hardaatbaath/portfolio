import { FileText, Mail } from "lucide-react";
import { identity, socials } from "@/site.config";
import { GithubIcon, LinkedinIcon } from "./ui/brand-icons";

const iconClass =
  "inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-elevated hover:text-foreground focus-visible:text-foreground";

/** Icon-only social row. Labels are carried by aria-label + native title. */
export function SocialLinks() {
  const links = [
    { href: socials.github, label: "GitHub", Icon: GithubIcon, external: true },
    { href: socials.linkedin, label: "LinkedIn", Icon: LinkedinIcon, external: true },
    { href: `mailto:${identity.email}`, label: "Email", Icon: Mail, external: false },
    { href: identity.resumeUrl, label: "Résumé", Icon: FileText, external: true },
  ];

  return (
    <nav aria-label="Social links" className="flex items-center gap-1">
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
