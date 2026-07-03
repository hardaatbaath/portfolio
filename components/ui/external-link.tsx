import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Every external link opens in a new tab with a small external-link icon and
 * safe rel attributes. The arrow nudges on hover.
 */
export function ExternalLink({
  href,
  children,
  className,
  showIcon = true,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  showIcon?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group inline-flex items-center gap-1 text-accent transition-colors hover:brightness-110",
        className,
      )}
    >
      {children}
      {showIcon ? (
        <ArrowUpRight
          className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden
        />
      ) : null}
    </a>
  );
}
