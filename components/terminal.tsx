"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { SquareTerminal } from "lucide-react";
import { useTheme } from "next-themes";
import { identity, socials } from "@/site.config";
import { cn } from "@/lib/utils";

type Line = { t: string; k: "in" | "out" | "sys"; href?: string };

const USER = "hardaat@portfolio";
export const OPEN_TERMINAL_EVENT = "open-terminal";

// section name → scroll target
const SECTIONS: Record<string, string> = {
  overview: "#overview",
  projects: "#projects",
  milestones: "#recognition",
  blogs: "#writing",
  "beyond-code": "#thinking",
  reading: "#reading",
  timeline: "#timeline",
  contact: "#contact",
};

const COMMANDS = [
  "help", "whoami", "stack", "now", "ls", "cd", "resume", "socials", "theme", "clear",
];

const QUICK = ["help", "ls", "cd projects", "resume", "theme"];

function go(hash: string) {
  if (typeof window !== "undefined") window.location.hash = hash;
}

/** Interactive terminal (opens in a modal via TerminalButton / the ` key).
 *  Supports command history (↑/↓), Tab-completion, ls/cd navigation, and a
 *  theme toggle. Honors reduced-motion. */
export function Terminal() {
  const reduce = useReducedMotion();
  const { resolvedTheme, setTheme } = useTheme();
  const [history, setHistory] = useState<Line[]>([]);
  const [typed, setTyped] = useState("");
  const [ready, setReady] = useState(false);
  const [input, setInput] = useState("");
  const past = useRef<string[]>([]); // command history
  const cursor = useRef<number>(-1); // position in history while browsing
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const boot: Line[] = [
      { t: "Machine Learning Engineer @ Nurix.AI", k: "out" },
      { t: "Systems · Robotics · Research — type `help` to explore.", k: "sys" },
    ];
    if (reduce) {
      setHistory([{ t: "whoami", k: "in" }, ...boot]);
      setReady(true);
      return;
    }
    const cmd = "whoami";
    let i = 0;
    const iv = setInterval(() => {
      i += 1;
      setTyped(cmd.slice(0, i));
      if (i >= cmd.length) {
        clearInterval(iv);
        setTimeout(() => {
          setHistory([{ t: "whoami", k: "in" }, ...boot]);
          setTyped("");
          setReady(true);
        }, 400);
      }
    }, 85);
    return () => clearInterval(iv);
  }, [reduce]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [history, typed]);

  useEffect(() => {
    if (ready) inputRef.current?.focus();
  }, [ready]);

  function exec(raw: string) {
    const line = raw.trim();
    const [name, ...args] = line.split(/\s+/);
    const cmd = name.toLowerCase();
    const out: Line[] = [{ t: line, k: "in" }];
    const say = (t: string, href?: string) => out.push({ t, k: "out", href });
    const sys = (t: string) => out.push({ t, k: "sys" });

    if (line) {
      past.current = [...past.current, line];
      cursor.current = past.current.length;
    }

    switch (cmd) {
      case "":
        break;
      case "help":
        say("help · whoami · stack · now · ls · cd <section> · resume · socials · theme · clear");
        break;
      case "whoami":
        say(`${identity.name} — Machine Learning Engineer @ Nurix.AI`);
        break;
      case "stack":
        say("PyTorch · Rust · ROS · RAG / LLMs · TypeScript · AWS");
        break;
      case "now":
        say("building speech + multilingual RAG systems at Nurix.AI");
        break;
      case "ls":
        say(Object.keys(SECTIONS).join("   "));
        break;
      case "cd": {
        const target = (args[0] ?? "").toLowerCase().replace(/^~\/?|\/$/g, "");
        if (!target || target === "~" || target === "overview") {
          sys("→ ~/overview");
          go("#overview");
        } else if (SECTIONS[target]) {
          sys(`→ ~/${target}`);
          go(SECTIONS[target]);
        } else {
          say(`cd: no such section: ${target} — try \`ls\``);
        }
        break;
      }
      case "resume":
        sys("→ opening résumé…");
        if (typeof window !== "undefined") window.open(identity.resumeUrl, "_blank");
        break;
      case "socials":
        out.push({ t: socials.github, k: "out", href: socials.github });
        out.push({ t: socials.linkedin, k: "out", href: socials.linkedin });
        out.push({ t: socials.scholar, k: "out", href: socials.scholar });
        break;
      case "theme": {
        const next = resolvedTheme === "dark" ? "light" : "dark";
        setTheme(next);
        sys(`→ theme: ${next}`);
        break;
      }
      case "sudo":
        say("🔒 permission denied — this is a portfolio, not prod.");
        break;
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
    if (e.key === "Enter") {
      exec(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (past.current.length === 0) return;
      cursor.current = Math.max(0, cursor.current - 1);
      setInput(past.current[cursor.current] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (past.current.length === 0) return;
      cursor.current = Math.min(past.current.length, cursor.current + 1);
      setInput(past.current[cursor.current] ?? "");
    } else if (e.key === "Tab") {
      e.preventDefault();
      const m = COMMANDS.filter((c) => c.startsWith(input.trim().toLowerCase()));
      if (m.length === 1) setInput(m[0] + " ");
      else if (m.length > 1) setHistory((h) => [...h, { t: m.join("   "), k: "sys" }]);
    }
  }

  const Prompt = () => (
    <span className="select-none">
      <span className="text-success">{USER}</span>
      <span className="text-muted">:~$</span>
    </span>
  );

  return (
    <div
      className="card w-full overflow-hidden p-0 font-mono text-[13px]"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-xs text-muted">{USER}:~$</span>
      </div>

      <div ref={bodyRef} className="max-h-64 space-y-1 overflow-y-auto p-4 leading-relaxed">
        {!ready && (
          <div>
            <Prompt /> <span className="text-foreground">{typed}</span>
            <span className="ml-0.5 inline-block h-3.5 w-2 translate-y-0.5 animate-pulse bg-foreground" />
          </div>
        )}

        {history.map((l, idx) => (
          <div key={idx} className="break-all">
            {l.k === "in" ? (
              <>
                <Prompt /> <span className="text-foreground">{l.t}</span>
              </>
            ) : l.href ? (
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                {l.t}
              </a>
            ) : (
              <span className={l.k === "sys" ? "text-accent" : "text-muted"}>{l.t}</span>
            )}
          </div>
        ))}

        {ready && (
          <div className="flex items-center">
            <Prompt />
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              aria-label="Terminal input — type a command like help"
              spellCheck={false}
              autoComplete="off"
              className="ml-2 min-w-0 flex-1 bg-transparent text-foreground caret-accent outline-none"
            />
          </div>
        )}
      </div>

      {/* quick commands */}
      <div className="flex flex-wrap gap-1.5 border-t border-border px-4 py-2.5">
        {QUICK.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => exec(q)}
            className="rounded-md border border-border px-2 py-0.5 text-[11px] text-muted transition-colors hover:border-accent/50 hover:text-accent"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Icon button that opens the terminal modal. Also opens via the ` key. */
export function TerminalButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      aria-label="Open terminal"
      title="Terminal ( ` )"
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

/** The terminal overlay. Rendered once (in the layout); opens on the button
 *  click event or the ` key, closes on Escape / backdrop. */
export function TerminalModal() {
  const [open, setOpen] = useState(false);

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

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[14vh]">
      <button
        aria-label="Close terminal"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <div className="relative w-full max-w-xl">
        <Terminal />
      </div>
    </div>
  );
}
