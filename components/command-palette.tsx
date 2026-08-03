"use client";

import { ArrowRight, FileText, GraduationCap, NotebookPen } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { identity, nav, socials } from "@/site.config";
import { cn } from "@/lib/utils";
import {
  DevtoIcon,
  GithubIcon,
  LinkedinIcon,
  SubstackIcon,
  XIcon,
} from "./ui/brand-icons";

export const OPEN_PALETTE_EVENT = "open-command-palette";

type Item = {
  label: string;
  group: string;
  keywords?: string;
  icon: React.ReactNode;
  run: () => void;
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const pathname = usePathname();

  const go = useCallback((href: string, external = false) => {
    setOpen(false);
    if (external) window.open(href, "_blank", "noopener,noreferrer");
    else if (href.startsWith("/")) window.location.assign(href); // route (or /#hash)
    else window.location.hash = href; // in-page hash on the current route
  }, []);

  const items = useMemo<Item[]>(() => {
    const isHome = pathname === "/";
    const sections: Item[] = nav.map((n) => ({
      label: n.label,
      group: "Go to",
      keywords: n.href ? "notes papers reading" : undefined,
      icon: n.href ? (
        <NotebookPen className="h-4 w-4" aria-hidden />
      ) : (
        <ArrowRight className="h-4 w-4" aria-hidden />
      ),
      run: () =>
        n.href
          ? go(n.href)
          : go(isHome ? `#${n.id}` : `/#${n.id}`),
    }));
    const links: Item[] = [
      { label: "GitHub", group: "Links", icon: <GithubIcon className="h-4 w-4" aria-hidden />, run: () => go(socials.github, true) },
      { label: "LinkedIn", group: "Links", icon: <LinkedinIcon className="h-4 w-4" aria-hidden />, run: () => go(socials.linkedin, true) },
      ...(socials.twitter
        ? [{ label: "X (Twitter)", group: "Links", keywords: "twitter", icon: <XIcon className="h-4 w-4" aria-hidden />, run: () => go(socials.twitter, true) }]
        : []),
      { label: "Google Scholar", group: "Links", keywords: "research papers publications", icon: <GraduationCap className="h-4 w-4" aria-hidden />, run: () => go(socials.scholar, true) },
      { label: "dev.to", group: "Links", keywords: "blog writing notes", icon: <DevtoIcon className="h-4 w-4" aria-hidden />, run: () => go(socials.devtoUrl, true) },
      { label: "Substack", group: "Links", keywords: "reflections essays", icon: <SubstackIcon className="h-4 w-4" aria-hidden />, run: () => go(socials.substackUrl, true) },
      { label: "Résumé", group: "Links", keywords: "cv", icon: <FileText className="h-4 w-4" aria-hidden />, run: () => go(identity.resumeUrl, true) },
    ];
    return [...sections, ...links];
  }, [go, pathname]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) =>
      `${i.label} ${i.group} ${i.keywords ?? ""}`.toLowerCase().includes(q),
    );
  }, [items, query]);

  // Global open shortcut (⌘K / Ctrl+K) + custom event from the sidebar hint
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpen);
    };
  }, []);

  // Reset + focus when opening
  useEffect(() => {
    if (open) {
      setQuery("");
      setCursor(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => setCursor(0), [query]);

  if (!open) return null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      filtered[cursor]?.run();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[15vh]">
      <button
        aria-label="Close command palette"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="card relative w-full max-w-lg overflow-hidden p-0"
        onKeyDown={onKeyDown}
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Jump to a section or link…"
          className="w-full border-b border-border bg-transparent px-4 py-3.5 text-sm text-foreground placeholder:text-muted focus:outline-none"
        />
        <ul className="max-h-[50vh] overflow-y-auto p-2">
          {filtered.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-muted">No matches.</li>
          )}
          {filtered.map((item, i) => (
            <li key={`${item.group}-${item.label}`}>
              <button
                type="button"
                onMouseEnter={() => setCursor(i)}
                onClick={() => item.run()}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                  i === cursor ? "bg-elevated text-foreground" : "text-muted",
                )}
              >
                <span className="text-muted">{item.icon}</span>
                <span className="text-foreground">{item.label}</span>
                <span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-muted">
                  {item.group}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
