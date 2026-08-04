---
name: paper-summarizer
description: >
  Produce a reader's paper review that first orients you (what the paper is about,
  what they used, what they achieved vs. did not), then teaches the building blocks
  you may not know (a short "FYI" explainer for each key model/technique/dataset the
  paper relies on), then walks the architecture step-by-step (input → what they did →
  output → intuition), then results, then questions worth asking. Trigger whenever the
  user shares a PDF, arXiv link, DOI, paper title, or raw paper text and wants a
  summary, overview, breakdown, review, critique, key findings, "explain this paper",
  or "add this paper as a note" — even without the word "summarize". Also trigger for
  follow-ups like "go deeper on the method", "what does <component> mean here?", or
  "what are the limitations?" once a paper is in context. Can output to chat or write
  a note into this repo's /notes site (see Output Modes).
---

# Paper Reviewer

Produce the review a curious reader actually wants: understand **what it's trying
to do**, **what the building blocks are** (with a little FYI on each), **what they
did and how**, and **what to conclude / ask next**. Accuracy over fluency — never
state a result you cannot confirm from the text, and clearly separate *what the
paper says* from *background you're adding to explain it*.

---

## Step 0 — Ingest the Paper

Retrieve the actual content before writing anything. Never summarize from memory
unless the paper is very well-known AND you flag it explicitly.

- **PDF upload** (`/mnt/user-data/uploads/<name>.pdf`):
  `pdftotext <file> -` to extract; if garbled/empty (scanned), fall back to
  `pypdf`; if image-only, say so — do not invent content.
- **arXiv URL/ID**: fetch `https://arxiv.org/abs/<id>` (abstract, to orient),
  then `https://arxiv.org/html/<id>` for full text. The **HTML mirror parses far
  more reliably than the PDF** — prefer it. Fetch the PDF only as a last resort.
- **DOI**: fetch `https://doi.org/<doi>`; note if paywalled (abstract-only).
- **Title only**: web-search `<title> arxiv`/`pdf`; if nothing free is found, ask
  for the PDF or a link.
- **Pasted text**: use it directly; note if it's abstract-only.

If you only have the abstract, say so at the top and scope every later section to
"based on the abstract."

**Depth** (infer from the request; default = Standard): *Quick* = the At-a-Glance
box only; *Standard* = the full structure below, concise; *Deep* = the full
structure with worked detail in Building Blocks and Architecture.

---

## Step 1 — Write the Review

Fill sections **in this order**. This ordering is the point of the skill — do not
revert to a generic problem/contributions/method template. Include only what the
paper supports; write "Not stated in the paper" rather than padding. Keep prose
tight and concrete.

### 1. At a glance
The orientation triad — a reader should get the whole shape from this alone.

- **What it's about** — 2–3 sentences: the problem, and what they built to attack it.
- **What they used** — a bullet inventory of the building blocks: models, datasets,
  architectures, training tricks, hardware. Just names + one clause each; the
  explaining happens in §2.
- **What they achieved ✓ / didn't ✗** — the headline wins, and — equally important —
  what they *couldn't* do, didn't attempt, or explicitly scoped out. Be honest about
  the ✗ column; it's usually the most useful part.

### 2. Building blocks — the FYI layer
**This is the section that makes the review useful.** For each non-obvious
component named in §2's inventory, give a short standalone explainer so the reader
doesn't have to go look it up:

> **`<Component>`** — what it is (1 sentence), why it exists / what problem it
> solves (1 sentence), and the one-line intuition. Then: how *this* paper uses it.

Cover the things a smart non-specialist wouldn't know — e.g. a specific named LLM,
an encoder/codec, a niche loss, a benchmark. 2–4 sentences each.

> [!warning] Label your sources
> Background explainers are **general knowledge, not paper claims**. Mark the
> section clearly (e.g. "*Background — not specific to this paper*") so it's never
> confused with what the authors actually did. If you're unsure what a component is,
> say so rather than guessing.

### 3. How it works — architecture & method
Start with **the big idea in one paragraph** (the intuition: why should this work?).
Then walk the pipeline as **input → output**, broken into numbered steps. For each
step give four things:

1. **Input** — what goes in.
2. **What they do** — the operation/transform, concretely.
3. **Output** — what comes out.
4. **Intuition** — *why* this step, in plain terms.

Where the clean description hides a practical trick, add a **"ground reality"** note:
the idealized story vs. what actually had to happen to make it work (a delay, a
special token, a distillation, a stability hack). This "clean story vs. reality"
contrast is exactly what a good review surfaces. Use a diagram/code block for token
or data layouts when it clarifies.

### 4. Results & conclusions
The headline numbers **with their metric + dataset/split** (mark figure-read
numbers "approx."), what each demonstrates, and the authors' own conclusions. A
small table is fine. Separate "authors claim" from "this suggests (my read)".

### 5. Questions worth asking
A short list (3–6) of questions a thoughtful reader/reviewer would raise: unproven
assumptions, missing ablations, generalization doubts, fairness of baselines,
scaling/cost, and what to read next. Frame as questions, not verdicts.

---

## Step 2 — Accuracy Guardrails

1. **Paper vs. background** — the single most important rule here. "The authors…" =
   from the paper; "*Background:*…" = general knowledge you added; "This suggests…" =
   your read, used sparingly and labeled.
2. **Numbers** — always attach metric + dataset/split; append "(read from figure,
   approx.)" for chart-derived values.
3. **Partial access** — declare abstract-only at the top and scope accordingly.
4. **Uncertainty** — "it appears that…" beats a confident wrong statement.
5. **Never invent** citations, results, or components not in the paper.

---

## Output Modes

**A) Chat (default).** Render the review as Markdown in the reply.

**B) Website note** — when the user says "add as a note", "add to the website",
"put it in /notes", etc. Write the review into this repo's notes site:

- Create `content/notes/<slug>.md` (slug from the title, kebab-case).
- Add YAML frontmatter:
  ```yaml
  ---
  title: "<Full paper title>"
  paper: "<arXiv/DOI URL>"
  authors: "<First et al. (Group)>"
  venue: "<Venue Year or 'arXiv YYYY'>"
  date: <today, YYYY-MM-DD>
  tags: [<topic>, <topic>]
  status: reading          # reading | summarized | revisited
  summary: "<one-line teaser>"
  ---
  ```
- Write the §1–§5 review as the body, using the site's Markdown conventions:
  `$math$`/`$$display$$` (KaTeX), fenced code with a language, `> [!key]` /
  `> [!warning]` callouts, and `[[wikilinks]]` to related notes that already exist
  in `content/notes/` (they generate backlinks automatically). Use a `> [!warning]`
  callout for the "Reviewer note" caveats.
- Then verify + ship on the **`preview`** branch: `npm run build` (confirm the
  `/notes/<slug>` route prerenders), then commit **title-only, no AI attribution**,
  and `git push origin preview`. Tell the user it's on the open preview/PR.
- Full authoring reference: `docs/05-writing-notes.md`.

---

## Follow-ups
- "Go deeper on <step>" → expand that step's input/do/output/intuition + ground reality.
- "What is <component>?" → expand its §2 FYI explainer (labeled as background).
- "Compare to <other paper>" → ingest that paper first, then contrast building blocks + results.
- "Turn this into a note" → switch to Output Mode B.

## Pitfalls to avoid
| Pitfall | Instead |
|---|---|
| Reverting to generic problem→method→results order | Keep the orient → FYI → step-by-step → questions flow |
| Building-block FYI blended into paper claims | Label background explicitly as general knowledge |
| "The paper proves X" | "X, under assumptions A, B, C" |
| Numbers with no metric/dataset | metric + dataset/split every time |
| Only listing wins | Always fill the "didn't achieve ✗" column |
| Skipping the intuition/"ground reality" | That contrast is the most valuable part of the review |
