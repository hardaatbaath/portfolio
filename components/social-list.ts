import type { ComponentType, SVGProps } from "react";
import { FileText, GraduationCap, Mail } from "lucide-react";
import { identity, socials } from "@/site.config";
import {
  DevtoIcon,
  GithubIcon,
  LinkedinIcon,
  SubstackIcon,
  XIcon,
} from "./ui/brand-icons";

export type SocialLink = {
  label: string;
  href: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  external: boolean;
};

/**
 * The single source of truth for social/contact links, so the sidebar row and
 * the Contact "Elsewhere" list always show the exact same set. Any link with an
 * empty href (e.g. Twitter before you set NEXT_PUBLIC_TWITTER_URL) is dropped.
 */
export function getSocialLinks(): SocialLink[] {
  return [
    { label: "GitHub", href: socials.github, Icon: GithubIcon, external: true },
    { label: "LinkedIn", href: socials.linkedin, Icon: LinkedinIcon, external: true },
    { label: "X (Twitter)", href: socials.twitter, Icon: XIcon, external: true },
    { label: "dev.to", href: socials.devtoUrl, Icon: DevtoIcon, external: true },
    { label: "Substack", href: socials.substackUrl, Icon: SubstackIcon, external: true },
    { label: "Google Scholar", href: socials.scholar, Icon: GraduationCap, external: true },
    { label: "Email", href: identity.email ? `mailto:${identity.email}` : "", Icon: Mail, external: false },
    { label: "Résumé", href: identity.resumeUrl, Icon: FileText, external: true },
  ].filter((l) => l.href);
}
