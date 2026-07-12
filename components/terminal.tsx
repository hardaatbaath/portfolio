"use client";

import { useEffect, useRef, useState } from "react";
import { SquareTerminal, X } from "lucide-react";
import { useTheme } from "next-themes";
import {
  identity,
  socials,
  projects,
  recognition,
  reading,
  timeline,
} from "@/site.config";
import { cn } from "@/lib/utils";

type Line = { t: string; k: "in" | "out" | "dim" | "head" | "sys" | "link"; href?: string };

const USER = "hardaat@portfolio";
export const OPEN_TERMINAL_EVENT = "open-terminal";

const B = (): Line => ({ t: "", k: "out" });

// ---- content builders --------------------------------------------------------
function aboutLines(): Line[] {
  return [
    { t: `${identity.name} — Machine Learning Engineer @ Nurix.AI`, k: "head" },
    { t: "Building speech + multilingual RAG systems. Before that: deep-learning", k: "out" },
    { t: "research, an AI role in Tokyo, and leading autonomy on a student Mars rover.", k: "out" },
    { t: "BITS Pilani, Goa — B.E. Computer Science.", k: "dim" },
  ];
}
function projectsLines(): Line[] {
  const out: Line[] = [];
  for (const p of projects) {
    out.push({ t: `▸ ${p.title}   [${p.status}]`, k: "head" });
    if (p.metrics?.length) out.push({ t: `  ${p.metrics.join("   ·   ")}`, k: "dim" });
    out.push({ t: `  ${p.description}`, k: "out" });
    out.push({ t: `  ${p.tags.join(" · ")}`, k: "dim" });
    if (p.github) out.push({ t: `  code → ${p.github}`, k: "link", href: p.github });
    if (p.writeup) out.push({ t: `  write-up → ${p.writeup}`, k: "link", href: p.writeup });
    out.push(B());
  }
  return out;
}
function milestonesLines(): Line[] {
  const out: Line[] = [];
  for (const a of recognition) {
    out.push({ t: `▸ ${a.title}   (${a.year})`, k: "head" });
    if (a.detail) out.push({ t: `  ${a.detail}`, k: "out" });
    out.push(B());
  }
  return out;
}
function readingLines(): Line[] {
  return [
    { t: "Technical", k: "head" },
    ...reading.technical.map((b): Line => ({ t: `  - ${b}`, k: "out" })),
    B(),
    { t: "Beyond Tech", k: "head" },
    ...reading.humanities.map((b): Line => ({ t: `  - ${b}`, k: "out" })),
  ];
}
function timelineLines(): Line[] {
  const out: Line[] = [];
  for (const t of timeline) {
    out.push({ t: `${t.period}`, k: "dim" });
    out.push({ t: `  ${t.title} — ${t.org}`, k: "head" });
    if (t.detail) out.push({ t: `  ${t.detail}`, k: "out" });
    out.push(B());
  }
  return out;
}
function contactLines(): Line[] {
  return [
    { t: `github → ${socials.github}`, k: "link", href: socials.github },
    { t: `linkedin → ${socials.linkedin}`, k: "link", href: socials.linkedin },
    { t: `scholar → ${socials.scholar}`, k: "link", href: socials.scholar },
    { t: "…or run `exit` and use the contact form on the site.", k: "dim" },
  ];
}

// long sections open in a man-style pager
const PAGER: Record<string, { title: string; fn: () => Line[] }> = {
  projects: { title: "PROJECTS", fn: projectsLines },
  milestones: { title: "MILESTONES", fn: milestonesLines },
  timeline: { title: "TIMELINE", fn: timelineLines },
  reading: { title: "READING", fn: readingLines },
};
// short sections print inline
const INLINE: Record<string, () => Line[]> = {
  about: aboutLines,
  contact: contactLines,
  socials: contactLines,
  blogs: () => [{ t: `latest posts → ${socials.devtoUrl}`, k: "link", href: socials.devtoUrl }],
  "beyond-code": () => [{ t: `reflections → ${socials.substackUrl}`, k: "link", href: socials.substackUrl }],
};

const SECTION_NAMES = [...Object.keys(PAGER), "about", "blogs", "beyond-code", "contact"];
const COMMANDS = [
  "help", "about", "whoami", "ls", "cd", ...Object.keys(PAGER), "blogs",
  "beyond-code", "contact", "socials", "stack", "now", "resume", "theme", "clear", "exit",
];
const QUICK = ["help", "ls", "projects", "milestones", "timeline", "exit"];

export function TerminalButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      aria-label="Enter terminal mode"
      title="Terminal mode ( ` )"
      onClick={() => window.dispatchEvent(new Event(OPEN_TERMINAL_EVENT))}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-elevated hover:text-foreground",
        className,
      )}
    >
      <SquareTerminal className="h-[18px] w-[18px]" aria-hidden />
    </button>
  );
}

const cls = (k: Line["k"]) =>
  k === "head"
    ? "text-accent font-semibold"
    : k === "sys"
      ? "text-accent"
      : k === "dim"
        ? "text-muted"
        : "text-foreground/90";

function LineView({ l }: { l: Line }) {
  if (l.k === "in")
    return (
      <div className="break-words">
        <span className="select-none whitespace-nowrap">
          <span className="text-success">{USER}</span>
          <span className="text-muted">:~$</span>
        </span>{" "}
        <span className="text-foreground">{l.t}</span>
      </div>
    );
  if (l.k === "link" && l.href)
    return (
      <div className="break-all">
        <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
          {l.t}
        </a>
      </div>
    );
  return <div className={cn("break-words", cls(l.k))}>{l.t || " "}</div>;
}

/** Full-screen terminal mode — a third way to view the whole portfolio.
 *  Long sections open in a scrollable man-style pager (q to quit). */
export function TerminalMode() {
  const { resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [pager, setPager] = useState<{ title: string; lines: Line[] } | null>(null);
  const past = useRef<string[]>([]);
  const cursor = useRef(0);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pagerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "`") {
        const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
        if (tag !== "input" && tag !== "textarea") {
          e.preventDefault();
          setOpen((o) => !o);
        }
      }
    };
    window.addEventListener(OPEN_TERMINAL_EVENT, onOpen);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(OPEN_TERMINAL_EVENT, onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (open && history.length === 0) {
      setHistory([
        { t: `${identity.name} — portfolio [terminal mode]`, k: "head" },
        { t: "type `help` or `ls` to explore · `exit` (or Esc) to leave", k: "dim" },
        B(),
      ]);
    }
    document.body.style.overflow = open ? "hidden" : "";
    if (open && !pager) setTimeout(() => inputRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, history.length, pager]);

  useEffect(() => {
    if (pager) setTimeout(() => pagerRef.current?.focus(), 30);
    else if (open) setTimeout(() => inputRef.current?.focus(), 30);
  }, [pager, open]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [history]);

  function exec(raw: string) {
    const line = raw.trim();
    const [name, ...args] = line.split(/\s+/);
    const cmd = name.toLowerCase();
    const out: Line[] = [{ t: line, k: "in" }];
    const say = (t: string) => out.push({ t, k: "out" });
    let toPage: { title: string; lines: Line[] } | null = null;

    if (line) {
      past.current.push(line);
      cursor.current = past.current.length;
    }

    const resolve = (key: string) => {
      const norm = key.toLowerCase().replace(/^~\/?|\/$/g, "");
      if (PAGER[norm]) toPage = { title: PAGER[norm].title, lines: PAGER[norm].fn() };
      else if (INLINE[norm]) out.push(...INLINE[norm]());
      else if (norm === "" || norm === "overview") out.push(...aboutLines());
      else say(`no such section: ${key} — try \`ls\``);
    };

    switch (cmd) {
      case "":
        break;
      case "help":
        say("about · ls · projects · milestones · timeline · reading · blogs · beyond-code · contact · socials · stack · now · resume · theme · clear · exit");
        break;
      case "about":
      case "whoami":
        out.push(...aboutLines());
        break;
      case "ls":
        say(SECTION_NAMES.join("   "));
        break;
      case "cd":
      case "man":
        resolve(args[0] ?? "");
        break;
      case "projects":
      case "milestones":
      case "timeline":
      case "reading":
      case "blogs":
      case "beyond-code":
      case "contact":
      case "socials":
        resolve(cmd);
        break;
      case "stack":
        say("PyTorch · Rust · ROS · RAG / LLMs · TypeScript · AWS");
        break;
      case "now":
        say("building speech + multilingual RAG systems at Nurix.AI");
        break;
      case "resume":
        out.push({ t: "→ opening résumé…", k: "sys" });
        window.open(identity.resumeUrl, "_blank");
        break;
      case "theme": {
        const next = resolvedTheme === "dark" ? "light" : "dark";
        setTheme(next);
        out.push({ t: `→ theme: ${next}`, k: "sys" });
        break;
      }
      case "sudo":
        say("🔒 permission denied — this is a portfolio, not prod.");
        break;
      case "exit":
      case "quit":
      case "q":
      case "gui":
        setOpen(false);
        return;
      case "clear":
        setHistory([]);
        setInput("");
        return;
      default:
        say(`command not found: ${cmd} — try \`help\``);
    }
    setHistory((h) => [...h, ...out]);
    setInput("");
    if (toPage) setPager(toPage);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") exec(input);
    else if (e.key === "Escape") setOpen(false);
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!past.current.length) return;
      cursor.current = Math.max(0, cursor.current - 1);
      setInput(past.current[cursor.current] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!past.current.length) return;
      cursor.current = Math.min(past.current.length, cursor.current + 1);
      setInput(past.current[cursor.current] ?? "");
    } else if (e.key === "Tab") {
      e.preventDefault();
      const m = COMMANDS.filter((c) => c.startsWith(input.trim().toLowerCase()));
      if (m.length === 1) setInput(m[0] + " ");
      else if (m.length > 1) setHistory((h) => [...h, { t: m.join("   "), k: "dim" }]);
    }
  }

  if (!open) return null;

  const title = pager?.title ?? "";

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-background font-mono text-[13.5px]">
      {/* top bar */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-xs text-muted">{USER}: terminal mode</span>
        <button
          type="button"
          aria-label="Exit terminal mode"
          onClick={() => setOpen(false)}
          className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs text-muted transition-colors hover:border-accent/50 hover:text-accent"
        >
          <X className="h-3.5 w-3.5" aria-hidden /> exit
        </button>
      </div>

      {pager ? (
        /* man-style pager */
        <div
          ref={pagerRef}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "q" || e.key === "Escape") {
              e.preventDefault();
              e.stopPropagation();
              setPager(null);
            }
          }}
          className="flex flex-1 flex-col outline-none"
        >
          <div className="flex justify-between border-b border-border px-5 py-2 text-xs uppercase tracking-wider text-muted sm:px-8">
            <span>{title}(1)</span>
            <span className="hidden sm:inline">Portfolio Manual</span>
            <span>{title}(1)</span>
          </div>
          <div className="flex-1 space-y-0.5 overflow-y-auto p-5 leading-relaxed sm:p-8">
            {pager.lines.map((l, i) => (
              <LineView key={i} l={l} />
            ))}
          </div>
          <div className="border-t border-border bg-elevated px-5 py-2 text-xs text-muted sm:px-8">
            manual: {title.toLowerCase()} — ↑ / ↓ · space to scroll ·{" "}
            <span className="text-accent">q</span> to quit
          </div>
        </div>
      ) : (
        <>
          {/* output + inline prompt */}
          <div
            ref={bodyRef}
            className="flex-1 space-y-0.5 overflow-y-auto p-5 leading-relaxed sm:p-8"
            onClick={() => inputRef.current?.focus()}
          >
            {history.map((l, i) => (
              <LineView key={i} l={l} />
            ))}
            <div className="flex items-center">
              <span className="select-none whitespace-nowrap">
                <span className="text-success">{USER}</span>
                <span className="text-muted">:~$</span>
              </span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                aria-label="Terminal input"
                spellCheck={false}
                autoComplete="off"
                className="ml-2 min-w-0 flex-1 bg-transparent text-foreground caret-accent outline-none"
              />
            </div>
          </div>

          {/* quick commands */}
          <div className="flex flex-wrap gap-1.5 border-t border-border px-5 py-3 sm:px-8">
            {QUICK.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => {
                  exec(q);
                  inputRef.current?.focus();
                }}
                className="rounded-md border border-border px-2 py-0.5 text-[11px] text-muted transition-colors hover:border-accent/50 hover:text-accent"
              >
                {q}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
