---
title: "Attention Is All You Need"
paper: "https://arxiv.org/abs/1706.03762"
authors: "Vaswani, Shazeer, Parmar, et al."
venue: "NeurIPS 2017"
date: 2026-07-08
tags: [transformers, attention, deep-learning, nlp]
status: summarized
summary: "The paper that replaced recurrence with pure attention and became the backbone of modern LLMs."
---

## 1. At a glance

**What it's about.** Sequence models (translation, etc.) were built on RNNs, which
process a sentence one token at a time — inherently sequential, so you can't
parallelise within an example, and long-range dependencies decay. This paper
proposes the **Transformer**: drop recurrence and convolutions entirely and build
the model out of **attention** alone, so every position can look at every other
position in one parallel step.

**What they used** *(each explained in §2)*:

- **Self-attention** (scaled dot-product) — the one core operation.
- **Multi-head attention** — 8 attention functions in parallel.
- **Encoder–decoder stack** — N = 6 layers each.
- **Positional encodings** (sinusoidal), **position-wise FFN**, **residual + LayerNorm**.

**Achieved ✓**

- New SOTA on WMT-2014: **28.4 BLEU** EN→DE (+2.0 over prior best ensemble),
  **41.8 BLEU** EN→FR — at "a small fraction of the training cost."
- Fully parallel training; base model trains in **12 h on 8 P100 GPUs**.

**Didn't ✗**

- Self-attention is **O(n²)** in sequence length — expensive for long sequences
  (the paper flags this; long-context is left to future work).
- Demonstrated on machine translation + parsing only; not yet the general
  pretraining recipe that BERT/GPT would later make it.

## 2. Building blocks — the FYI layer

> [!warning] Background — general knowledge, not specific to this paper
> Context so §3 reads easily; the paper's own contributions are in §3–§4.

**RNN / recurrence.** The prior default: read tokens left-to-right, carrying a
hidden state. Because step *t* needs step *t-1*, training can't parallelise over
positions, and gradients over long distances vanish. Removing this is the whole
motivation.

**Attention (query / key / value).** Each token forms a **query**; every token
exposes a **key** and a **value**. The output for a token is a weighted average of
all values, weighted by how well its query matches each key. Intuition: "look at
the whole sentence and pull in whatever is relevant," in one step.

**Word embeddings + positional encoding.** Tokens become vectors (embeddings).
Since attention is order-agnostic (a bag of vectors), you must **add position
information** back — here via fixed sinusoids of different frequencies.

**Residual connections + LayerNorm.** Standard deep-net stabilizers:
`LayerNorm(x + Sublayer(x))` keeps gradients healthy through many stacked layers.

**BLEU.** The translation-quality metric (n-gram overlap with references); higher
is better. Used for the headline results.

## 3. How it works — architecture & method

**Big idea.** If attention lets any position gather information from any other in a
single operation, you don't need recurrence at all — stack attention + FFN blocks
and you get a fully parallel, strong sequence model.

**Scaled dot-product attention** is the primitive:

$$
\text{Attention}(Q, K, V) = \text{softmax}\!\left(\frac{QK^{\top}}{\sqrt{d_k}}\right)V
$$

**The pipeline, step by step:**

1. **Embed + position.**
   *Input:* token ids. *Do:* embed to `d_model = 512` vectors, add sinusoidal
   positional encodings. *Output:* order-aware token vectors. *Intuition:* give the
   model both *what* each token is and *where* it sits.

2. **Encoder (×6).**
   *Input:* token vectors. *Do:* multi-head **self**-attention (every token attends
   to all tokens) → position-wise FFN, each wrapped in residual+LayerNorm.
   *Output:* context-rich encodings. *Intuition:* build a representation where each
   token already "knows" the rest of the source.

3. **Decoder (×6).**
   *Input:* generated tokens so far + encoder output. *Do:* **masked** self-attention
   (can't peek ahead) → **cross**-attention over encoder output → FFN.
   *Output:* next-token distribution. *Intuition:* attend to what's been said and to
   the source, then predict the next word.

4. **Project → token.**
   *Input:* decoder output. *Do:* linear + softmax over vocabulary. *Output:* next
   token. *Intuition:* standard LM head.

> [!key] Ground reality vs. the clean story
> Three details make "just use attention" actually work: the **√dₖ scaling** (large
> `d_k` blows up dot products and flatlines softmax gradients — the paper's fix);
> **multi-head** (one attention averages everything into one view; 8 heads let it
> track several relations — syntax, coreference — at once); and the decoder
> **causal mask** (so training can be parallel yet still autoregressive).

## 4. Results & conclusions

| Task (WMT-2014) | Model | BLEU |
| --- | --- | --- |
| EN→DE | Transformer (big) | **28.4** (prior best ensemble 26.36) |
| EN→FR | Transformer (big) | **41.8** |

Training: 8×P100; base 12 h, big 3.5 days — far cheaper than the RNN/CNN SOTA it beat.

**Conclusion (authors).** Attention alone, stacked with FFNs, matches or beats
recurrent/convolutional translation models while being dramatically more
parallelisable — establishing the architecture the field has built on ever since.

## 5. Questions worth asking

- The O(n²) attention cost — how far can sequence length scale before it dominates,
  and what approximations preserve quality? (The whole "efficient attention" line.)
- How much of the win is *attention* vs. just *removing the sequential bottleneck*
  (i.e. more compute per second)?
- Sinusoidal vs. learned vs. rotary position encodings — which actually matters, and
  when does length-extrapolation break?
- This is the shared backbone of [[retrieval-augmented-generation]] and
  [[moshi-speech-text-foundation-model]] — what changes when the "tokens" are
  passages or audio instead of words?
