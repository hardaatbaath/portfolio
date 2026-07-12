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

const B = (): Line => ({ t: "", k: "out" }); // blank spacer

// ---- content builders (render real portfolio content as terminal output) ----
function aboutLines(): Line[] {
  return [
    { t: `${identity.name} — Machine Learning Engineer @ Nurix.AI`, k: "head" },
    { t: "Building speech + multilingual RAG systems. Before that: deep-learning", k: "out" },
    { t: "research, an AI role in Tokyo, and leading autonomy on a student Mars rover.", k: "out" },
    { t: "BITS Pilani, Goa — B.E. Computer Science.", k: "dim" },
  ];
}
function projectsLines(): Line[] {
  const out: Line[] = [{ t: "// selected work", k: "sys" }, B()];
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
  const out: Line[] = [{ t: "// accomplishments", k: "sys" }, B()];
  for (const a of recognition) {
    out.push({ t: `▸ ${a.title}   (${a.year})`, k: "head" });
    if (a.detail) out.push({ t: `  ${a.detail}`, k: "out" });
    out.push(B());
  }
  return out;
}
function readingLines(): Line[] {
  return [
    { t: "// on the shelf", k: "sys" },
    B(),
    { t: "Technical", k: "head" },
    ...reading.technical.map((b): Line => ({ t: `  - ${b}`, k: "out" })),
    B(),
    { t: "Beyond Tech", k: "head" },
    ...reading.humanities.map((b): Line => ({ t: `  - ${b}`, k: "out" })),
  ];
}
function timelineLines(): Line[] {
  const out: Line[] = [{ t: "// the path so far", k: "sys" }, B()];
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
    { t: "// let's connect", k: "sys" },
    B(),
    { t: `github → ${socials.github}`, k: "link", href: socials.github },
    { t: `linkedin → ${socials.linkedin}`, k: "link", href: socials.linkedin },
    { t: `scholar → ${socials.scholar}`, k: "link", href: socials.scholar },
    B(),
    { t: "…or run `exit` and use the contact form on the site.", k: "dim" },
  ];
}
function blogsLines(): Line[] {
  return [
    { t: "// writing", k: "sys" },
    { t: `latest posts → ${socials.devtoUrl}`, k: "link", href: socials.devtoUrl },
  ];
}
function beyondLines(): Line[] {
  return [
    { t: "// beyond code", k: "sys" },
    { t: `reflections → ${socials.substackUrl}`, k: "link", href: socials.substackUrl },
  ];
}

const SECTIONS: Record<string, () => Line[]> = {
  about: aboutLines,
  projects: projectsLines,
  milestones: milestonesLines,
  blogs: blogsLines,
  "beyond-code": beyondLines,
  reading: readingLines,
  timeline: timelineLines,
  contact: contactLines,
};

const COMMANDS = [
  "help", "about", "whoami", "ls", "cd", "projects", "milestones", "blogs",
  "beyond-code", "reading", "timeline", "contact", "socials", "stack", "now",
  "resume", "theme", "clear", "exit",
];

const QUICK = ["help", "ls", "projects", "milestones", "contact", "exit"];

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

/** Full-screen terminal mode — a third way to view the whole portfolio.
 *  Renders real content (projects, milestones, reading, …) as command output. */
export function TerminalMode() {
  const { resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const past = useRef<string[]>([]);
  const cursor = useRef(0);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // open / close via event + keyboard
  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return setOpen(false);
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

  // seed a welcome banner when first opened
  useEffect(() => {
    if (open && history.length === 0) {
      setHistory([
        { t: `${identity.name} — portfolio [terminal mode]`, k: "head" },
        { t: "type `help` or `ls` to explore · `exit` (or Esc) to leave", k: "dim" },
        B(),
      ]);
    }
    if (open) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, history.length]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [history]);

  function exec(raw: string) {
    const line = raw.trim();
    const [name, ...args] = line.split(/\s+/);
    const cmd = name.toLowerCase();
    const out: Line[] = [{ t: line, k: "in" }];
    const say = (t: string) => out.push({ t, k: "out" });

    if (line) {
      past.current.push(line);
      cursor.current = past.current.length;
    }

    const showSection = (key: string) => {
      const norm = key.toLowerCase().replace(/^~\/?|\/$/g, "");
      const fn = SECTIONS[norm] ?? (norm === "" || norm === "overview" ? aboutLines : undefined);
      if (fn) out.push(...fn());
      else say(`no such section: ${key} — try \`ls\``);
    };

    switch (cmd) {
      case "":
        break;
      case "help":
        say("about · ls · projects · milestones · blogs · beyond-code · reading · timeline · contact · socials · stack · now · resume · theme · clear · exit");
        break;
      case "about":
      case "whoami":
        out.push(...aboutLines());
        break;
      case "ls":
        say(Object.keys(SECTIONS).join("   "));
        break;
      case "cd":
        showSection(args[0] ?? "");
        break;
      case "projects":
      case "milestones":
      case "blogs":
      case "beyond-code":
      case "reading":
      case "timeline":
      case "contact":
        showSection(cmd);
        break;
      case "socials":
        out.push(...contactLines());
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
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") exec(input);
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

  const Prompt = () => (
    <span className="select-none whitespace-nowrap">
      <span className="text-success">{USER}</span>
      <span className="text-muted">:~$</span>
    </span>
  );

  const cls = (k: Line["k"]) =>
    k === "head"
      ? "text-accent font-semibold"
      : k === "sys"
        ? "text-accent"
        : k === "dim"
          ? "text-muted"
          : "text-foreground/90";

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

      {/* output + inline prompt */}
      <div
        ref={bodyRef}
        className="flex-1 space-y-0.5 overflow-y-auto p-5 leading-relaxed sm:p-8"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((l, i) =>
          l.k === "in" ? (
            <div key={i} className="break-words">
              <Prompt /> <span className="text-foreground">{l.t}</span>
            </div>
          ) : l.k === "link" && l.href ? (
            <div key={i} className="break-all">
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                {l.t}
              </a>
            </div>
          ) : (
            <div key={i} className={cn("break-words", cls(l.k))}>
              {l.t || " "}
            </div>
          ),
        )}

        <div className="flex items-center">
          <Prompt />
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
    </div>
  );
}
