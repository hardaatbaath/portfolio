import { ExternalLink } from "../ui/external-link";

export function Footer() {
  // Evaluated at build/revalidation time — reflects the last deploy.
  const updated = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <footer className="mt-16 border-t border-border py-10 font-mono text-xs text-muted md:mt-24">
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <p className="flex flex-wrap items-center gap-1.5">
          <span>Built with</span>
          <ExternalLink href="https://nextjs.org" showIcon={false}>Next.js</ExternalLink>
          <span aria-hidden>·</span>
          <ExternalLink href="https://tailwindcss.com" showIcon={false}>Tailwind</ExternalLink>
          <span aria-hidden>·</span>
          <ExternalLink href="https://vercel.com" showIcon={false}>Vercel</ExternalLink>
        </p>
        <p>Last updated {updated}</p>
      </div>
    </footer>
  );
}
