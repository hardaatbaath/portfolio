/**
 * ============================================================================
 *  SINGLE SOURCE OF TRUTH
 * ============================================================================
 *  Everything editable about this site lives here (or in `.env.local` for
 *  secrets + handles). Change your email, add a project, reorder the timeline —
 *  all in one file. Nothing is hardcoded in components.
 *
 *  Simple strings (email, handles, URLs) read from environment variables so you
 *  can tweak them in Vercel without a code change. The defaults below are used
 *  when the env var is absent. Rich content (projects, timeline, lists) is
 *  edited directly in the arrays further down.
 * ============================================================================
 */

// --- Identity + links (override any of these in .env.local) -----------------
export const identity = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://hardaatbaath.dev",
  name: process.env.NEXT_PUBLIC_NAME ?? "Hardaat Singh Baath",
  roles: ["AI Engineer", "Systems Programmer", "Researcher"],
  tagline: "Building intelligent systems, from silicon to software.",
  domains: "AI • Systems • Research",
  email: process.env.NEXT_PUBLIC_EMAIL ?? "hardaat.singh@nurix.ai",
  resumeUrl: process.env.NEXT_PUBLIC_RESUME_URL ?? "/Hardaat-Singh-Baath-Resume.pdf",
} as const;

export const socials = {
  github: `https://github.com/${process.env.NEXT_PUBLIC_GITHUB_USERNAME ?? "hardaatbaath"}`,
  githubUsername: process.env.NEXT_PUBLIC_GITHUB_USERNAME ?? "hardaatbaath",
  linkedin:
    process.env.NEXT_PUBLIC_LINKEDIN_URL ??
    "https://www.linkedin.com/in/hardaatbaath",
  devtoUsername: process.env.NEXT_PUBLIC_DEVTO_USERNAME ?? "hardaatbaath",
  devtoUrl: `https://dev.to/${process.env.NEXT_PUBLIC_DEVTO_USERNAME ?? "hardaatbaath"}`,
  substackUrl:
    process.env.NEXT_PUBLIC_SUBSTACK_URL ?? "https://hardaatbaath.substack.com",
} as const;

// Google Analytics measurement id (e.g. "G-XXXXXXX"). Empty = analytics off.
export const analytics = {
  gaId: process.env.NEXT_PUBLIC_GA_ID ?? "",
} as const;

// --- Navigation / narrative order -------------------------------------------
// Each entry is a section on the single page. `id` is the URL hash + scroll
// anchor. Order here === order on the page === order in the sidebar.
export const nav = [
  { id: "overview", label: "Overview" },
  { id: "building", label: "Building" },
  { id: "projects", label: "Projects" },
  { id: "writing", label: "Writing" },
  { id: "thinking", label: "Thinking" },
  { id: "reading", label: "Reading" },
  { id: "timeline", label: "Timeline" },
  { id: "contact", label: "Contact" },
] as const;

// --- Types -------------------------------------------------------------------
export type ProjectStatus = "Planning" | "Building" | "Testing" | "Research" | "Released" | "Archived";

export type Project = {
  title: string;
  description: string;
  tags: string[];
  status: ProjectStatus;
  github?: string;
  writeup?: string;
  demo?: string;
};

// --- Currently ---------------------------------------------------------------
export const currently = {
  building: [
    { name: "Atmos", detail: "AI voice infrastructure", status: "Building" as ProjectStatus },
    { name: "Neural TTS", detail: "From-scratch text-to-speech", status: "Research" as ProjectStatus },
    { name: "Redis Clone", detail: "In-memory store in Rust", status: "Building" as ProjectStatus },
    { name: "Database", detail: "A storage + query engine", status: "Planning" as ProjectStatus },
    { name: "Compiler", detail: "A small language + backend", status: "Planning" as ProjectStatus },
    { name: "Operating System", detail: "A teaching kernel", status: "Planning" as ProjectStatus },
  ],
  learning: ["Rust", "Distributed Systems", "Audio DSP", "CUDA", "Compiler Optimizations"],
  reading: [
    "Designing Data-Intensive Applications",
    "Computer Systems: A Programmer's Perspective",
    "SICP",
    "The Beginning of Infinity",
  ],
};

// --- Featured projects (curated) --------------------------------------------
// Update GitHub/writeup/demo links per project. Leave a field out to hide it.
export const projects: Project[] = [
  {
    title: "Atmos",
    description:
      "Low-latency voice infrastructure for real-time AI agents — streaming ASR, turn-taking, and neural TTS behind a single API.",
    tags: ["Rust", "PyTorch", "Audio DSP", "gRPC"],
    status: "Building",
    github: socials.github,
  },
  {
    title: "Neural TTS",
    description:
      "A text-to-speech model built from the ground up to understand the full pipeline — text normalization, acoustic model, and vocoder.",
    tags: ["PyTorch", "CUDA", "Transformers"],
    status: "Research",
    github: socials.github,
  },
  {
    title: "Redis From Scratch",
    description:
      "A Redis-compatible in-memory data store implementing the RESP protocol, event loop, and core data structures.",
    tags: ["Rust", "Networking", "Systems"],
    status: "Building",
    github: socials.github,
  },
  {
    title: "Storage Engine",
    description:
      "An embedded database exploring LSM-trees, write-ahead logging, and MVCC — the ideas behind the systems we take for granted.",
    tags: ["Go", "Distributed Systems", "Storage"],
    status: "Planning",
    github: socials.github,
  },
  {
    title: "Toy Compiler",
    description:
      "A compiler for a small statically-typed language: lexer, Pratt parser, type checker, and a bytecode VM.",
    tags: ["Rust", "Compilers", "LLVM"],
    status: "Planning",
    github: socials.github,
  },
  {
    title: "Teaching Kernel",
    description:
      "A minimal operating system kernel — bootloader, virtual memory, and a cooperative scheduler — written to learn every layer.",
    tags: ["C", "Assembly", "OS"],
    status: "Planning",
    github: socials.github,
  },
];

// --- Reading (beyond the "currently reading" list) --------------------------
export const reading = {
  technical: [
    "Designing Data-Intensive Applications",
    "Computer Systems: A Programmer's Perspective",
    "SICP",
    "The Rust Programming Language",
  ],
  humanities: [
    "The Beginning of Infinity",
    "Thinking, Fast and Slow",
    "Gödel, Escher, Bach",
    "Sapiens",
  ],
};

// --- Timeline ----------------------------------------------------------------
export const timeline = [
  { year: "2024", title: "Hackathons", detail: "Shipping fast, learning faster." },
  { year: "2025", title: "Research", detail: "Diving deep into ML systems and audio." },
  { year: "2026", title: "Atmos", detail: "Building voice infrastructure for AI agents." },
  { year: "Future", title: "What's next", detail: "Systems that are hard, and worth it." },
];

// --- How many auto-fetched posts to show ------------------------------------
export const feeds = {
  devtoCount: 3,
  substackCount: 3,
} as const;
