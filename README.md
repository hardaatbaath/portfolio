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

| I want to…                        | Edit this                                              |
| --------------------------------- | ----------------------------------------------------- |
| Change my email / links / handles | `.env.local` (or the defaults in `site.config.ts`)    |
| Add / edit a project              | `projects` array in `site.config.ts`                  |
| Update "Currently building/…"     | `currently` in `site.config.ts`                       |
| Reorder or rename sections        | `nav` in `site.config.ts`                             |
| Change reading lists              | `reading` in `site.config.ts`                         |
| Update the timeline               | `timeline` in `site.config.ts`                        |
| Swap the résumé                   | replace the PDF in `public/`, set `NEXT_PUBLIC_RESUME_URL` |

**Blogs update themselves.** The latest 3 posts from **dev.to** (Technical
Writing) and **Substack** (Reflections) are fetched automatically and refresh
every hour — you never touch the code when you publish.

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
