"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { identity, nav } from "@/site.config";
import { cn } from "@/lib/utils";
import { useActiveSection } from "@/lib/use-active-section";
import { SocialLinks } from "./social-links";
import { ThemeToggle } from "./theme-toggle";
import { TerminalButton } from "./terminal";
import { OPEN_PALETTE_EVENT } from "./command-palette";

// Scroll-spy only tracks in-page sections, not route links (e.g. /notes).
const NAV_IDS = nav.filter((n) => !n.href).map((n) => n.id);

const linkClass = (isActive: boolean) =>
  cn(
    "group relative flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
    isActive ? "text-foreground" : "text-muted hover:text-foreground",
  );

function ActiveBar({ isActive }: { isActive: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "absolute left-0 h-4 w-0.5 rounded-full bg-accent transition-all duration-200",
        isActive ? "opacity-100" : "opacity-0",
      )}
    />
  );
}

function NavList({
  active,
  onSelect,
  onNavigate,
}: {
  active: string;
  onSelect: (id: string) => void;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <ul className="space-y-0.5">
      {nav.map((item) => {
        // Route links (e.g. /notes) — active when on that route.
        if (item.href) {
          const isActive = pathname.startsWith(item.href);
          return (
            <li key={item.id}>
              <Link
                href={item.href}
                onClick={() => onNavigate?.()}
                aria-current={isActive ? "page" : undefined}
                className={linkClass(isActive)}
              >
                <ActiveBar isActive={isActive} />
                {item.label}
              </Link>
            </li>
          );
        }

        // In-page section links — hash on home, route-to-home elsewhere.
        const isActive = isHome && active === item.id;
        return (
          <li key={item.id}>
            <a
              href={isHome ? `#${item.id}` : `/#${item.id}`}
              onClick={() => {
                if (isHome) onSelect(item.id);
                onNavigate?.();
              }}
              aria-current={isActive ? "location" : undefined}
              className={linkClass(isActive)}
            >
              <ActiveBar isActive={isActive} />
              {item.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

function Identity() {
  return (
    <a href="#overview" className="block">
      <Image
        src="/avatar.png"
        alt={identity.name}
        width={48}
        height={48}
        priority
        className="mb-3 h-12 w-12 rounded-full border border-border object-cover"
      />
      <span className="font-display text-base font-semibold text-foreground">
        {identity.name}
      </span>
      <span className="mt-1.5 block whitespace-pre-line font-mono text-xs leading-relaxed text-muted">
        {identity.roles.join("\n")}
      </span>
    </a>
  );
}

function PaletteHint() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))}
      className="flex w-full items-center gap-2 rounded-lg border border-border bg-background/50 px-3 py-2 text-sm text-muted transition-colors hover:border-accent/40 hover:text-foreground"
    >
      <Search className="h-4 w-4" aria-hidden />
      <span>Jump to…</span>
      <kbd className="ml-auto rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted">
        ⌘K
      </kbd>
    </button>
  );
}

export function Navigation() {
  const { active, select } = useActiveSection(NAV_IDS);
  const [open, setOpen] = useState(false);

  // Lock scroll + close on Escape while the mobile drawer is open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r border-border bg-surface/60 px-6 py-8 backdrop-blur-sm lg:flex">
        <Identity />
        <div className="my-6 h-px bg-border" />
        <nav aria-label="Sections" className="flex-1">
          <NavList active={active} onSelect={select} />
        </nav>
        <PaletteHint />
        <div className="my-5 h-px bg-border" />
        <SocialLinks />
      </aside>

      {/* Mobile top bar */}
      <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between border-b border-border bg-surface/80 px-4 py-3 backdrop-blur-md lg:hidden">
        <a href="#overview" className="font-display text-sm font-semibold">
          {identity.name}
        </a>
        <div className="flex items-center gap-1">
          <TerminalButton />
          <ThemeToggle />
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-elevated hover:text-foreground"
          >
            <Menu className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[80vw] flex-col border-r border-border bg-surface px-6 py-8">
            <div className="flex items-start justify-between">
              <Identity />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-elevated hover:text-foreground"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <div className="my-6 h-px bg-border" />
            <nav aria-label="Sections" className="flex-1">
              <NavList active={active} onSelect={select} onNavigate={() => setOpen(false)} />
            </nav>
            <div className="my-5 h-px bg-border" />
            <SocialLinks />
          </div>
        </div>
      )}
    </>
  );
}
