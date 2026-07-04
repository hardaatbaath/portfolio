# Personal Site — Hardaat Singh Baath

A calm, content-first personal site that feels like walking into an engineer's
workshop. Single-page, persistent sidebar, dark-by-default, obsessively fast.

Built with **Next.js 16 (App Router)**, **Tailwind v4**, **Framer Motion**,
**Lucide**, and **Resend**.

---

## Editing content — start here

**Almost everything you'll ever change lives in one file: [`site.config.ts`](./site.config.ts).**
Name, tagline, projects, timeline, "currently" lists, reading shelves, nav order —
all there. Change it, save, done.

Simple strings that you might want to tweak without a code change (email,
social handles, feed URLs) also read from environment variables — see
[`.env.example`](./.env.example). Copy it to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

| I want to…                                   | Edit this                                                        |
| -------------------------------------------- | ---------------------------------------------------------------- |
| Change my name / hero tagline / roles        | `identity` in `site.config.ts`                                   |
| Change my email / social links / feed handles | `.env.local` (defaults live in `site.config.ts`)                |
| Add / edit a **project** (title, blurb, tags, links) | `projects` array in `site.config.ts`                     |
| Change a project's **status badge**          | the project's `status` field (see options below)                |
| How many projects show before "More on GitHub" | `featuredProjectCount` in `site.config.ts`                     |
| Update the **timeline**                      | `timeline` array in `site.config.ts`                             |
| Change **reading** lists                     | `reading` in `site.config.ts`                                    |
| Reorder / rename the **sidebar nav**         | `nav` in `site.config.ts`                                        |
| Change a section's **heading / subtext**     | the `<SectionHeader label title description />` in that section's file under `components/sections/` |
| Swap the résumé                              | replace the PDF in `public/`, set `NEXT_PUBLIC_RESUME_URL`       |

**Project status badges.** Each project's `status` accepts one of:
`"Planning" | "Building" | "Testing" | "Research" | "Released" | "Archived"`.
They're color-coded automatically (blue = building/testing, green = research/released, muted = planning/archived).

**Blogs update themselves.** The latest posts from **dev.to** (Blogs) and
**Substack** (Beyond Code) are fetched automatically and refresh every hour —
you never touch the code when you publish. Change how many show with
`feeds.devtoCount` / `feeds.substackCount` in `site.config.ts`.

> Note: section *headings and subtexts* (e.g. "Selected work", "Things that
> moved me") live in each section component under `components/sections/`, not in
> `site.config.ts` — they're short and rarely change, so they stay next to the layout.

---

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill it in
npm run dev                  # http://localhost:3000
```

```bash
npm run build && npm run start   # production build
```

---

## Deploying & setup guides

Step-by-step docs live in [`docs/`](./docs):

1. [Deploy to Vercel](./docs/01-vercel-deploy.md)
2. [Buy & connect a custom domain](./docs/02-custom-domain.md)
3. [Wire up the contact form with Resend](./docs/03-resend-email.md)
4. [Google Analytics, Search Console & SEO](./docs/04-analytics-seo.md)

---

## Project structure

```
site.config.ts          ← single source of truth for content
.env.example            ← all configurable env vars, documented
app/
  layout.tsx            ← fonts, theme, metadata, analytics
  page.tsx              ← assembles the sections (ISR: revalidate 1h)
  globals.css           ← design tokens (light + dark), scrollbar, selection
  sitemap.ts, robots.ts, icon.svg
components/
  navigation.tsx        ← sidebar + mobile drawer + scroll-spy
  command-palette.tsx   ← ⌘K / Ctrl+K quick jump
  sections/             ← hero, currently, projects, writing, …
  ui/                   ← one card / button / badge design system
lib/
  posts.ts              ← dev.to + Substack fetchers (ISR)
actions/
  send-email.ts         ← Resend contact-form server action
```

---

## Design language

- Colors, radius (16px), shadows, fonts are all CSS variables in `globals.css`.
- One card style, two button types (primary / secondary) — used everywhere.
- Animations are limited to fade, slide-up, and hover. `prefers-reduced-motion`
  is respected. Dark is default; light is a separate palette, not an inversion.
