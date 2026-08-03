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
  // Leave TWITTER_URL empty to hide the X/Twitter icon entirely.
  twitter: process.env.NEXT_PUBLIC_TWITTER_URL ?? "",
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
// Each entry is a section on the single page (`id` = URL hash + scroll anchor).
// An optional `href` turns an entry into a route link instead; unused for now —
// section links route back to `/#id` from other pages automatically. Order here
// === order on the page === order in the sidebar.
export type NavItem = { id: string; label: string; href?: string };

export const nav: readonly NavItem[] = [
  { id: "overview", label: "Overview" },
  { id: "projects", label: "Projects" },
  { id: "recognition", label: "Milestones" },
  { id: "writing", label: "Blogs" },
  { id: "thinking", label: "Beyond Code" },
  { id: "notes", label: "Notes" },
  { id: "reading", label: "Reading" },
  { id: "timeline", label: "Timeline" },
  { id: "contact", label: "Contact" },
];

// How many project cards to show before the "More on GitHub" link.
export const featuredProjectCount = 4;

// --- Types -------------------------------------------------------------------
export type ProjectStatus = "Planning" | "Building" | "Testing" | "Research" | "Released" | "Archived";

export type Project = {
  title: string;
  description: string;
  tags: string[];
  status: ProjectStatus;
  metrics?: string[]; // punchy outcome highlights, shown as accent chips
  github?: string;
  writeup?: string;
  demo?: string;
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
    metrics: ["87% accuracy", "3 speech corpora"],
  },
  {
    title: "Multimodal Multilingual RAG",
    description:
      "A retrieval-augmented generation pipeline serving multiple languages and modalities at 96% accuracy with a p95 latency of 2.93s. Built at Nurix.AI.",
    tags: ["RAG", "LLMs", "Retrieval"],
    status: "Building",
    metrics: ["96% accuracy", "p95 2.93s"],
  },
  {
    title: "Distributed Deployment Platform",
    description:
      "Deploys GitHub repos to the web via AWS S3 + ECS, with a Node.js API and reverse proxy, a Kafka log pipeline, and PostgreSQL for real-time build logs.",
    tags: ["Node.js", "AWS", "Kafka", "PostgreSQL"],
    status: "Released",
    metrics: ["one-click deploys", "real-time build logs"],
    github: socials.github,
  },
  {
    title: "Project Kratos — Mars Rover",
    description:
      "Autonomous navigation for a student-built Mars rover: visual servoing with YOLO, PID + RTK-GNSS waypointing to 10 cm accuracy, and point-cloud terrain mapping on a Jetson.",
    tags: ["ROS", "Computer Vision", "Robotics"],
    status: "Research",
    metrics: ["10 cm GPS accuracy", "autonomous nav"],
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
    metrics: ["NIFTY-50 & S&P 500"],
    github: socials.github,
  },
];

// --- Recognition / awards ---------------------------------------------------
export type Award = { year: string; title: string; detail?: string };

export const recognition: Award[] = [
  {
    year: "2024",
    title: "NXP AIM — National Finalist",
    detail:
      "Top 15 of 600+ teams. Built an autonomous RC car with lane following, sign detection, and obstacle avoidance.",
  },
  {
    year: "2024",
    title: "LAM Research India — Stage 2",
    detail:
      "Top 100 of 1000+ teams. Designed a Peltier-based cooling system with live temperature monitoring and control.",
  },
  {
    year: "2024",
    title: "University Rover Challenge",
    detail:
      "Scored 93/100 with Project Kratos, improving on the previous year's result.",
  },
  {
    year: "2023",
    title: "Best Overall Rover — IRC",
    detail:
      "International Rover Challenge, Bengaluru — top honour with Project Kratos.",
  },
  {
    year: "2023",
    title: "Published at CVIP 2023",
    detail:
      "First-author paper on deep-learning damage segmentation & restoration of Rajasthani wall murals.",
  },
];

// --- Reading (beyond the "currently reading" list) --------------------------
export const reading = {
  technical: [
    "System Design Interview",
    "Designing Data-Intensive Applications",
    "Naked Statistics",
    "Computer Systems: A Programmer's Perspective",
  ],
  humanities: [
    "Humankind: A Hopeful History",
    "Thinking, Fast and Slow",
    "Slaughterhouse Five",
  ],
};

// --- Timeline ----------------------------------------------------------------
// One entry per milestone, ordered oldest → newest. Scrolls horizontally, so
// add as many as you like. `period` is free-form (single date or a range).
export type TimelineEntry = { period: string; title: string; org: string; detail?: string };

export const timeline: TimelineEntry[] = [
  { period: "Nov 2021 – Jul 2025", title: "B.E. Computer Science", org: "BITS Pilani, Goa", detail: "Bachelor's in CS. Coursework across ML, OS, networks, and architecture." },
  { period: "May 2023 – May 2024", title: "Autonomous Subsystem Lead", org: "Project Kratos", detail: "Led autonomous navigation for a student-built Mars rover." },
  { period: "Jun 2023 – Aug 2023", title: "Research Intern", org: "CSIR-CEERI, Pilani", detail: "Deep-learning restoration of Rajasthani wall murals." },
  { period: "May 2024 – Aug 2024", title: "AI Engineer", org: "DG Takano, Tokyo", detail: "Automated a hardware testing line with cloud logging." },
  { period: "Jan 2025 – Present", title: "Machine Learning Engineer", org: "Nurix.AI, Bangalore", detail: "Speech emotion recognition and multilingual RAG systems." },
];

// --- How many auto-fetched posts to show ------------------------------------
export const feeds = {
  devtoCount: 3,
  substackCount: 3,
} as const;
