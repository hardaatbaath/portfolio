"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { SquareTerminal } from "lucide-react";
import { identity, socials } from "@/site.config";
import { cn } from "@/lib/utils";

type Line = { t: string; k: "in" | "out" | "sys" };

const PROMPT = "hardaat@portfolio:~$";
export const OPEN_TERMINAL_EVENT = "open-terminal";

const BOOT: Line[] = [
  { t: "Machine Learning Engineer @ Nurix.AI", k: "out" },
  { t: "Systems · Robotics · Research — type `help` to explore.", k: "sys" },
];

function go(hash: string) {
  if (typeof window !== "undefined") window.location.hash = hash;
}

/** Small interactive terminal — the hero's signature. Types on load, then
 *  responds to a handful of commands. Honors reduced-motion. */
export function Terminal() {
  const reduce = useReducedMotion();
  const [history, setHistory] = useState<Line[]>([]);
  const [typed, setTyped] = useState("");
  const [ready, setReady] = useState(false);
  const [input, setInput] = useState("");
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Boot: type "whoami", then print the intro and open the prompt.
  useEffect(() => {
    if (reduce) {
      setHistory([{ t: "whoami", k: "in" }, ...BOOT]);
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
          setHistory([{ t: "whoami", k: "in" }, ...BOOT]);
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

  // Focus the prompt once booted (it lives in a modal, so this is safe).
  useEffect(() => {
    if (ready) inputRef.current?.focus();
  }, [ready]);

  function exec(raw: string) {
    const cmd = raw.trim().toLowerCase();
    const out: Line[] = [{ t: raw.trim() || "", k: "in" }];
    switch (cmd) {
      case "":
        break;
      case "help":
        out.push({ t: "whoami · stack · now · projects · blogs · contact · resume · socials · clear", k: "out" });
        break;
      case "whoami":
        out.push({ t: `${identity.name} — Machine Learning Engineer @ Nurix.AI`, k: "out" });
        break;
      case "stack":
        out.push({ t: "PyTorch · Rust · ROS · RAG / LLMs · TypeScript · AWS", k: "out" });
        break;
      case "now":
        out.push({ t: "building speech + multilingual RAG systems at Nurix.AI", k: "out" });
        break;
      case "projects":
        out.push({ t: "→ opening projects…", k: "sys" });
        go("#projects");
        break;
      case "blogs":
        out.push({ t: "→ opening blogs…", k: "sys" });
        go("#writing");
        break;
      case "contact":
        out.push({ t: "→ opening contact…", k: "sys" });
        go("#contact");
        break;
      case "resume":
        out.push({ t: "→ opening résumé…", k: "sys" });
        if (typeof window !== "undefined") window.open(identity.resumeUrl, "_blank");
        break;
      case "socials":
        out.push({ t: `github   ${socials.github}`, k: "out" });
        out.push({ t: `linkedin ${socials.linkedin}`, k: "out" });
        break;
      case "clear":
        setHistory([]);
        setInput("");
        return;
      default:
        out.push({ t: `command not found: ${cmd} — try \`help\``, k: "out" });
    }
    setHistory((h) => [...h, ...out]);
    setInput("");
  }

  const color = (k: Line["k"]) =>
    k === "sys" ? "text-accent" : k === "in" ? "text-foreground" : "text-muted";

  return (
    <div
      className="card w-full max-w-xl cursor-text overflow-hidden p-0 font-mono text-[13px]"
      onClick={() => inputRef.current?.focus()}
    >
      {/* title bar */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-xs text-muted">{PROMPT}</span>
      </div>

      {/* body */}
      <div ref={bodyRef} className="max-h-56 space-y-1 overflow-y-auto p-4 leading-relaxed">
        {/* boot typing line */}
        {!ready && (
          <div>
            <span className="text-accent">{PROMPT}</span>{" "}
            <span className="text-foreground">{typed}</span>
            <span className="ml-0.5 inline-block h-3.5 w-2 translate-y-0.5 animate-pulse bg-foreground" />
          </div>
        )}

        {history.map((l, idx) => (
          <div key={idx} className="break-words">
            {l.k === "in" ? (
              <>
                <span className="text-accent">{PROMPT}</span>{" "}
                <span className={color(l.k)}>{l.t}</span>
              </>
            ) : (
              <span className={color(l.k)}>{l.t}</span>
            )}
          </div>
        ))}

        {/* live input line */}
        {ready && (
          <div className="flex items-center">
            <span className="shrink-0 text-accent">{PROMPT}</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") exec(input);
              }}
              aria-label="Terminal input — type a command like help"
              spellCheck={false}
              autoComplete="off"
              className="ml-2 min-w-0 flex-1 bg-transparent text-foreground caret-accent outline-none"
            />
          </div>
        )}
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
