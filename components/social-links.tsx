import { getSocialLinks } from "./social-list";

const iconClass =
  "inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-elevated hover:text-foreground focus-visible:text-foreground";

/** Icon-only social row (sidebar). Same links as the Contact "Elsewhere" list. */
export function SocialLinks() {
  const links = getSocialLinks();
  return (
    <nav aria-label="Social links" className="flex items-center justify-between">
      {links.map(({ href, label, Icon, external }) => (
        <a
          key={label}
          href={href}
          title={label}
          aria-label={label}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className={iconClass}
        >
          <Icon className="h-4 w-4" aria-hidden />
        </a>
      ))}
    </nav>
  );
}
