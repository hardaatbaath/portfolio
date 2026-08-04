---
name: paper-summarizer
description: >
  Summarize any academic paper in a structured, researcher-grade format — covering
  problem statement, core contributions, methodology, theoretical results, experiments,
  limitations, and connections to related work. Trigger this skill whenever the user
  shares a PDF, arXiv link, DOI, paper title, or raw paper text and wants any of the
  following: a summary, an overview, a breakdown, a critique, key findings, or
  "what does this paper do?" — even if they don't use the word "summarize".
  Also trigger for follow-up depth requests like "go deeper on the method" or
  "what are the limitations of this paper?" if a paper was already discussed.
  This skill produces output calibrated to the user's stated depth preference
  and the paper's type (theory / empirical / systems / survey).
---

# Academic Paper Summarizer

A skill for producing precise, researcher-grade summaries of academic papers.
Accuracy over fluency: never paraphrase results you cannot confirm from the text.

---

## Step 0 — Ingest the Paper

Determine what was provided and retrieve the content accordingly.

### A) PDF upload
A file is at `/mnt/user-data/uploads/<name>.pdf`.

```bash
pdfinfo /mnt/user-data/uploads/<name>.pdf       # page count, metadata
pdftotext /mnt/user-data/uploads/<name>.pdf -   # extract all text
```

If `pdftotext` produces garbled or empty output (scanned PDF), fall back to:

```python
from pypdf import PdfReader
r = PdfReader("/mnt/user-data/uploads/<name>.pdf")
text = "\n".join(p.extract_text() or "" for p in r.pages)
print(text[:8000])  # orient first
```

If both fail (image-only scan), say so clearly: *"This PDF appears to be a scanned
image without embedded text. I cannot extract content reliably without OCR."*
Do NOT invent paper content.

### B) arXiv URL or ID
If the user provides an arXiv URL (`https://arxiv.org/abs/XXXX.XXXXX`) or an ID:

```
web_fetch https://arxiv.org/abs/<id>         # abstract page
web_fetch https://arxiv.org/pdf/<id>         # full PDF (may be large)
```

Prefer the abstract page first to orient yourself. Fetch the PDF only if full-text
details are needed for the requested depth.

### C) DOI
```
web_fetch https://doi.org/<doi>
```

This typically redirects to the publisher page. Extract what is publicly visible.
Note if the paper is behind a paywall and you only have the abstract.

### D) Title only / no link
Do a web search: `<paper title> arxiv` or `<paper title> pdf`.
If a freely accessible version is found, fetch it. If not, say:
*"I could not locate a freely accessible version of this paper. Please upload the PDF
or share an arXiv/DOI link."* Do not summarize from memory unless the paper is
very well-known and you are highly confident — and even then, flag it explicitly.

### E) Pasted text
Work directly from the provided text. Note if it appears to be abstract-only vs.
full paper; adjust depth claims accordingly.

---

## Step 1 — Classify the Paper

Before writing the summary, identify:

| Attribute | Options |
|-----------|---------|
| **Type** | Theory / Empirical / Systems / Survey / Position |
| **Depth requested** | Quick (abstract-level) / Standard / Deep |
| **Domain** | ML / NLP / CV / RL / other |

**Infer depth from the request:**
- "quick summary", "tldr", "what's this about" → Quick
- "summarize", "overview", "break it down" → Standard (default)
- "deep dive", "go through the method", "explain the proofs" → Deep

**Paper type affects what to emphasize:**
- Theory-heavy → focus on assumptions, theorem statements, proof sketch, tightness
- Empirical → focus on baselines, datasets, metrics, ablations, reproducibility signals
- Systems → focus on architecture decisions, bottlenecks, benchmarks, engineering tradeoffs
- Survey → focus on taxonomy, coverage scope, identified gaps, organization scheme

---

## Step 2 — Write the Summary

Use the template matching the requested depth. Fill only from paper content.
If something is absent from the paper (e.g., no ablation), say "Not provided" —
do not infer or pad.

---

### QUICK template (≈150–250 words)

```
## [Paper Title] — Quick Summary

**Authors**: ...   **Venue/Year**: ...   **arXiv**: ... (if available)

**Problem**: One to two sentences — what gap or challenge does this paper address?

**Core Idea**: One to two sentences — what is the key insight or mechanism?

**Main Result**: The single most important finding or claim, stated precisely.
  Flag numbers as approximate if you are not reading from the exact paper text.

**Caveats**: The most important limitations or assumptions to be aware of.
```

---

### STANDARD template (≈400–700 words)

```
## [Paper Title]

**Authors**: ...   **Venue/Year**: ...   **arXiv/DOI**: ...

---

### Problem & Motivation
What is the research gap? Why does it matter? What prior approaches fall short?

### Core Contributions
Numbered list of the paper's stated contributions (use the paper's own language
where possible, with attribution). Do not add contributions not claimed by the authors.

1. ...
2. ...

### Method / Approach
[Theory papers] State key definitions, theorem(s), proof technique at a high level.
  Flag if a proof sketch is your paraphrase, not a quote.
[Empirical papers] Describe the model/algorithm, training setup, datasets used.
[Systems papers] Describe the architecture, key design choices, and their rationale.
[Survey papers] Describe the taxonomy and organization logic.

### Key Results
Present results as stated in the paper. Use "approximately X" when reading from
figures rather than tables. List baselines compared against.

| Baseline | Metric | Paper's Method | Delta |
|----------|--------|----------------|-------|
| ...      | ...    | ...            | ...   |

(Skip table if no quantitative comparisons exist.)

### Limitations & Open Questions
What do the authors acknowledge as limitations? What is not addressed?
Add your own assessment only if clearly labeled as such: *[Reviewer note: ...]*

### Connections
1–3 papers this work directly builds on or contrasts with (only if named in the paper).
```

---

### DEEP template (≈800–1500 words)

Use the STANDARD template, then extend with:

```
### Method Deep-Dive

[Theory] Walk through the key theorem(s): statement → assumptions → proof strategy →
  where tightness is established or left open. Quote theorem numbers from the paper.
  Flag any step you are paraphrasing from memory vs. reading from extracted text.

[Empirical] Cover: architecture details, loss function, hyperparameters reported,
  data preprocessing, evaluation protocol, statistical significance (if reported),
  ablation study findings.

[Systems] Cover: component breakdown, latency/throughput numbers, hardware config,
  failure modes discussed, comparison methodology.

### Reproducibility Assessment
- Code available? (yes / no / partial — state what was found)
- Key hyperparameters reported? (yes / no / partial)
- Dataset(s) publicly available?
- Any obvious reproducibility concerns?

### Critical Assessment
Clearly labeled as reviewer perspective, not the paper's own claims.
*[Reviewer note: ...]*
What assumptions might be strong? Are the baselines fair? Are the claimed
improvements likely to hold in broader settings?
```

---

## Step 3 — Accuracy Guardrails

These rules apply to every summary regardless of depth:

1. **Numbers from figures** — Append "(read from figure, approximate)" when
   reporting numbers extracted from a chart rather than a results table.

2. **Theorem statements** — Use the paper's exact statement if available in
   extracted text. If paraphrasing, write "In essence, the theorem states..."

3. **Author claims vs. your inference** — Distinguish:
   - "The authors claim..." → stated in paper
   - "This suggests..." → your interpretation; use sparingly and label it

4. **Partial access** — If you only have the abstract, state that at the top:
   *"Note: This summary is based on the abstract only. Method details, results,
   and limitations may differ from the full paper."*

5. **Uncertainty** — If you are unsure about a detail (e.g., ambiguous figure),
   say "I am not certain, but it appears that..." rather than stating it as fact.

6. **Never invent citations** — Only list related works that appear in the paper.

---

## Step 4 — Follow-Up Handling

After delivering the summary, be ready for:

- "Go deeper on [section]" → re-read that section and expand
- "How does this compare to [other paper]?" → summarize the other paper first
  if not already in context, then compare
- "What are the limitations?" → surface limitations section + your *[Reviewer note]*
- "Can you explain [term/equation]?" → explain from paper context; flag if your
  explanation goes beyond what the paper states

---

## Common Pitfalls — Avoid These

| Pitfall | Instead |
|---------|---------|
| "The paper proves X is optimal" | "The paper proves X is optimal under assumptions A, B, C" |
| Reporting a number without its units or metric | Always state: metric name, dataset, split |
| Listing contributions you inferred | Only list contributions the paper explicitly states |
| Summarizing as if full paper was read when only abstract was available | Always declare access level |
| Merging two results into one | Keep each result separate with its own conditions |