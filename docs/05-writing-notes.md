# Writing paper notes (`/notes`)

The **Notes** section is a small knowledge base of paper summaries, rendered
from plain Markdown. It's designed to double as an **Obsidian vault** so you can
read, link, and refine notes in a comfortable editor — the exact same files are
what the site publishes.

## Where notes live

```
content/notes/*.md      ← one Markdown file per note
```

- Each `.md` file becomes a page at `/notes/<slug>`.
- The slug comes from the filename (or a `slug:` in frontmatter).
- The **only** `.md` files in this folder should be real notes — anything here
  is parsed as a note. (Keep this guide in `docs/`, not in `content/notes/`.)

## Authoring in Obsidian

1. Open Obsidian → **Open folder as vault** → choose
   `content/notes/` inside this repo.
2. Write notes as normal Markdown. Live preview shows math, links, and callouts.
3. When you're happy, `git add . && git commit && git push` on the `preview`
   branch — Vercel builds a preview URL. Merge to `main` to publish.

> Everything is a normal file on disk, so there is no lock-in: edit in Obsidian,
> VS Code, or with Claude in a session — whatever you prefer.

## Frontmatter template

Copy this to the top of a new note:

```markdown
---
title: "Denoising Diffusion Probabilistic Models"
paper: "https://arxiv.org/abs/2006.11239"      # link to the paper (optional)
authors: "Ho, Jain, Abbeel"                     # free text (optional)
venue: "NeurIPS 2020"                           # optional
date: 2026-08-03                                # first written (YYYY-MM-DD)
updated: 2026-08-10                             # optional; used for sort + "updated" label
tags: [diffusion, generative-models]            # drive the tag filter on /notes
status: reading                                 # reading | summarized | revisited
summary: "One-line teaser shown on cards and in search results."
---

Your note body starts here…
```

**Status** controls the coloured badge and the filter on the index:

| status       | meaning                                  |
| ------------ | ---------------------------------------- |
| `reading`    | still working through it                 |
| `summarized` | a settled summary                        |
| `revisited`  | came back to it and updated my take      |

## Markdown features

Standard GitHub-flavoured Markdown, plus:

- **Math** — inline `$…$` and display `$$…$$` via KaTeX, e.g.
  `$\text{softmax}(QK^\top/\sqrt{d_k})V$`. (No brace-escaping headaches — these
  are plain `.md`, not MDX.)
- **Code** — fenced blocks with a language get Shiki highlighting (light + dark).
  Add a title with ```` ```python title="attention.py" ````.
- **Wikilinks** — `[[note-title-or-slug]]` links to another note, and
  `[[slug|custom label]]` sets the link text. Links to a note that doesn't exist
  yet render dimmed/dashed. Each note automatically shows a **Referenced by**
  panel listing the notes that link *to* it (backlinks).
- **Tags** — from frontmatter `tags:`; they become filter chips on `/notes`.
- **Callouts** — Obsidian-style:

  ```markdown
  > [!key] Why it matters
  > The core idea in one or two sentences.
  ```

  Supported types: `note`, `info`, `tip`, `key`, `important`, `question`,
  `quote`, `math`, and `warning`/`caution`/`danger` (amber).

## Publishing checklist

1. Add/edit `.md` files in `content/notes/`.
2. `npm run dev` → visit http://localhost:3000/notes to preview.
3. Commit on `preview`, push, check the Vercel preview URL.
4. Merge `preview → main` to go live. The sitemap picks up new notes
   automatically.
