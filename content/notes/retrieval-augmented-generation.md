---
title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP"
paper: "https://arxiv.org/abs/2005.11401"
authors: "Lewis, Perez, Piktus, et al."
venue: "NeurIPS 2020"
date: 2026-07-11
tags: [rag, retrieval, llms, nlp]
status: reading
summary: "Pairs a parametric seq2seq model with a non-parametric retriever so knowledge lives in an index you can edit, not just in the weights."
---

## 1. At a glance

**What it's about.** LLMs store facts in their weights, but that knowledge is hard
to *update*, hard to *attribute*, and prone to hallucination. **RAG** gives the
model a second memory: a searchable document index. At inference it retrieves
relevant passages and conditions generation on them — so facts live in an index you
can swap out, not only in frozen parameters.

**What they used** *(each explained in §2)*:

- **BART-large** (400M) — the seq2seq **generator**.
- **DPR** (Dense Passage Retrieval) — the dual-BERT **retriever**.
- **Wikipedia index** — 21M 100-word passages, searched by **MIPS via FAISS**.
- Two variants: **RAG-Sequence** and **RAG-Token**.

**Achieved ✓**

- New SOTA on several open-domain QA benchmarks (e.g. **Natural Questions 44.5 EM**,
  beating DPR's 41.5), trained end-to-end with **no gold-document supervision**.
- More factual, more specific generation (Jeopardy question generation: judged more
  factual **42.7%** vs BART's **7.1%**).
- Knowledge is editable: swap the index and the model's "facts" change without
  retraining.

**Didn't ✗**

- End-to-end quality is bottlenecked by **retrieval** — if the right passage isn't in
  the top-k, the generator can't recover it.
- The **document encoder is frozen** (only the query side is fine-tuned) to avoid
  re-indexing 21M passages — a pragmatic compromise, not full joint training.
- Competitive but **not** universally SOTA (e.g. close to DPR on TriviaQA, not ahead).

## 2. Building blocks — the FYI layer

> [!warning] Background — general knowledge, not specific to this paper
> The pieces first; the paper's own method is in §3–§4.

**Parametric vs. non-parametric memory.** *Parametric* = knowledge baked into model
weights (fluent, but static and opaque). *Non-parametric* = an external store you can
read from and edit (a document index). RAG's whole thesis is to combine both.

**Seq2seq generator (BART).** A Transformer encoder-decoder (same machinery as
[[attention-is-all-you-need]]) pretrained as a denoising autoencoder; good at fluent
conditional generation. Here it writes the answer given query + retrieved text.

**DPR — Dense Passage Retrieval.** Two BERT encoders: one embeds the **question**,
one embeds each **passage**, into a shared vector space so that relevant Q–passage
pairs have high inner product. Replaces sparse keyword search (BM25) with *semantic*
search.

**MIPS / FAISS.** Maximum Inner-Product Search finds the nearest vectors to the query
embedding; FAISS does it approximately (HNSW) so retrieval over 21M passages is fast.

## 3. How it works — architecture & method

**Big idea.** Treat the retrieved document $z$ as a **latent variable** and
marginalise over the top-k documents, training the retriever and generator *jointly*
on just the final answer — the model learns which documents help without ever being
told the "right" one.

**The pipeline, step by step:**

1. **Encode the query.**
   *Input:* the question $x$. *Do:* DPR question encoder → a dense vector.
   *Output:* query embedding. *Intuition:* put the question in the same space as the
   passages so "relevant" = "nearby."

2. **Retrieve top-k.**
   *Input:* query embedding. *Do:* MIPS over the pre-encoded Wikipedia index (FAISS).
   *Output:* top-k passages $z_1..z_k$. *Intuition:* pull in candidate evidence.

3. **Generate, conditioned on evidence.**
   *Input:* query + each retrieved passage. *Do:* BART generates the answer,
   conditioned on $x$ and $z$. *Output:* answer tokens. *Intuition:* let the model
   *read* the facts rather than recall them.

4. **Marginalise over documents.** Two flavours:

$$
p_{\text{RAG-Seq}}(y\mid x) \approx \sum_{z\in\text{top-}k} p_\eta(z\mid x)\,p_\theta(y\mid x,z)
\quad\quad
p_{\text{RAG-Tok}}(y\mid x) \approx \prod_i \sum_{z\in\text{top-}k} p_\eta(z\mid x)\,p_\theta(y_i\mid x,z,y_{<i})
$$

   *Intuition:* **RAG-Sequence** commits to one document for the whole answer;
   **RAG-Token** can lean on a different document per token (better when an answer
   fuses facts from several passages).

> [!key] Ground reality vs. the clean story
> "Train it end-to-end" hides the key compromise: back-propagating into the
> **document** encoder would require **re-embedding and re-indexing all 21M
> passages** every update — infeasible. So they **freeze the document encoder** and
> only fine-tune the query encoder + generator. Retrieval is a latent variable, but a
> *mostly frozen* one.

## 4. Results & conclusions

- **Natural Questions:** RAG-Sequence **44.5 EM** vs DPR 41.5 — new SOTA at the time.
- Set new SOTA on additional open-domain QA benchmarks (WebQuestions, CuratedTrec);
  competitive with DPR on TriviaQA. *(Exact per-dataset figures vary by metric —
  verify against Table 1 before quoting.)*
- **Generation:** markedly more factual/specific than BART on Jeopardy question
  generation (human eval).

**Conclusion (authors).** Combining parametric (BART) and non-parametric (Wikipedia
index) memory, trained end-to-end, beats closed-book models on knowledge-intensive
tasks while making knowledge updatable and answers more grounded.

## 5. Questions worth asking

- Retrieval is the ceiling — how much do better retrievers (hard negatives, joint
  retriever+generator training) close the gap vs. the frozen-index compromise here?
- RAG-Token vs. RAG-Sequence: when is per-token document switching worth the extra
  cost, and how often does it actually switch?
- How does this scale as the generator grows to modern LLM sizes — does retrieval
  still help once parametric memory is huge?
- The generator relies on the same attention machinery as
  [[attention-is-all-you-need]]; contrast "knowledge in an editable index" here with
  "knowledge in the audio tokens" in [[moshi-speech-text-foundation-model]].
