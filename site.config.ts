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
  roles: ["Machine Learning Engineer", "Systems & Robotics", "Researcher"],
  tagline: "Building intelligent systems, from silicon to software.",
  domains: "ML • Systems • Robotics",
  email: process.env.NEXT_PUBLIC_EMAIL ?? "hardaatsinghbaath@gmail.com",
  resumeUrl: process.env.NEXT_PUBLIC_RESUME_URL ?? "/Hardaat-Singh-Baath-Resume.pdf",
} as const;

export const socials = {
  github: `https://github.com/${process.env.NEXT_PUBLIC_GITHUB_USERNAME ?? "hardaatbaath"}`,
  githubUsername: process.env.NEXT_PUBLIC_GITHUB_USERNAME ?? "hardaatbaath",
  linkedin:
    process.env.NEXT_PUBLIC_LINKEDIN_URL ??
    "https://www.linkedin.com/in/hardaat-singh-baath",
  scholar:
    process.env.NEXT_PUBLIC_SCHOLAR_URL ??
    "https://scholar.google.com/citations?user=8xumNrgAAAAJ&hl=en",
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
    { name: "Multimodal RAG", detail: "Low-latency multilingual retrieval @ Nurix", status: "Building" as ProjectStatus },
    { name: "Speech Emotion Recognition", detail: "Multi-corpus SER in PyTorch", status: "Testing" as ProjectStatus },
    { name: "LLM Analysis Pipelines", detail: "News + action-item generation", status: "Building" as ProjectStatus },
  ],
  learning: ["LLM Inference Optimization", "Multimodal Learning", "Distributed Systems", "Audio DSP", "CUDA"],
  reading: [
    "Designing Data-Intensive Applications",
    "The Silent Patient",
    "Thinking, Fast and Slow",
  ],
};

// --- Featured projects (curated) --------------------------------------------
// Update github/writeup/demo links per project. Leave a field out to hide it.
// TODO: swap the profile links below for the exact repo URLs when public.
export const projects: Project[] = [
  {
    title: "Speech Emotion Recognition",
    description:
      "A multi-corpus emotion-recognition model in PyTorch — trained on IEMOCAP, RAVDESS, and CREMA-D — reaching 87% classification accuracy. Built at Nurix.AI.",
    tags: ["PyTorch", "Audio", "Deep Learning"],
    status: "Released",
  },
  {
    title: "Multimodal Multilingual RAG",
    description:
      "A retrieval-augmented generation pipeline serving multiple languages and modalities at 96% accuracy with a p95 latency of 2.93s. Built at Nurix.AI.",
    tags: ["RAG", "LLMs", "Retrieval"],
    status: "Building",
  },
  {
    title: "Distributed Deployment Platform",
    description:
      "Deploys GitHub repos to the web via AWS S3 + ECS, with a Node.js API and reverse proxy, a Kafka log pipeline, and PostgreSQL for real-time build logs.",
    tags: ["Node.js", "AWS", "Kafka", "PostgreSQL"],
    status: "Released",
    github: socials.github,
  },
  {
    title: "Project Kratos — Mars Rover",
    description:
      "Autonomous navigation for a student-built Mars rover: visual servoing with YOLO, PID + RTK-GNSS waypointing to 10 cm accuracy, and point-cloud terrain mapping on a Jetson.",
    tags: ["ROS", "Computer Vision", "Robotics"],
    status: "Research",
    github: "https://github.com/Kratos-The-Rover",
    writeup: "https://kratos-the-rover.github.io/",
  },
  {
    title: "Neuro Chaos Learning",
    description:
      "Research into chaotic maps (skew-tent, Gauss, circle) as feature extractors — making ML models faster and more resilient to noise. Advised by Dr. Harikrishnan NB.",
    tags: ["Research", "ML", "Chaos Theory"],
    status: "Research",
    github: socials.github,
  },
  {
    title: "Transformers for Stock Prediction",
    description:
      "A Transformer + CNN time-series model on NIFTY-50 and S&P 500, paired with a realistic trading simulator that accounts for transaction costs and taxation.",
    tags: ["Transformers", "Time Series", "Finance"],
    status: "Research",
    github: socials.github,
  },
];

// --- Reading (beyond the "currently reading" list) --------------------------
export const reading = {
  technical: [
    "Designing Data-Intensive Applications",
    "Deep Learning — Goodfellow, Bengio & Courville",
    "Probabilistic Machine Learning — Murphy",
    "Computer Systems: A Programmer's Perspective",
  ],
  humanities: [
    "The Silent Patient",
    "Thinking, Fast and Slow",
    "Sapiens",
    "The Beginning of Infinity",
  ],
};

// --- Timeline ----------------------------------------------------------------
export const timeline = [
  { year: "2023", title: "Research @ CSIR-CEERI", detail: "Deep-learning restoration of Rajasthani wall murals; paper accepted at CVIP." },
  { year: "2024", title: "AI Engineer @ DG Takano", detail: "Automated a testing line in Tokyo; led Project Kratos to global rover challenges." },
  { year: "2025", title: "ML Engineer @ Nurix.AI", detail: "Graduated BITS Pilani; building speech and RAG systems in Bangalore." },
  { year: "Now", title: "What's next", detail: "Going deeper into multimodal ML and the systems that serve it." },
];

// --- How many auto-fetched posts to show ------------------------------------
export const feeds = {
  devtoCount: 3,
  substackCount: 3,
} as const;
