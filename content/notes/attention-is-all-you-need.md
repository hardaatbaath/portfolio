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

The **Transformer** discards recurrence and convolutions entirely and builds
sequence modelling out of a single primitive: **self-attention**. That one
decision is why we can train models the size of today's LLMs — attention
parallelises across the sequence, where an RNN is forced to march one step at a
time.

> [!key] Why it mattered
> Recurrence made the computation *inherently sequential*, capping how much you
> could parallelise per training example. Removing it turned sequence modelling
> into a problem you can throw GPUs at.

## Scaled dot-product attention

Each token emits a query, and every token exposes a key and a value. The output
for a token is a weighted average of all values, where the weights come from how
well that token's query matches each key:

$$
\text{Attention}(Q, K, V) = \text{softmax}\!\left(\frac{QK^{\top}}{\sqrt{d_k}}\right)V
$$

The $\sqrt{d_k}$ term is easy to skip past but load-bearing: for large $d_k$ the
dot products grow in magnitude, pushing softmax into regions with vanishing
gradients. Dividing by $\sqrt{d_k}$ keeps the variance in check.

```python
import torch, torch.nn.functional as F

def attention(q, k, v):
    d_k = q.size(-1)
    scores = q @ k.transpose(-2, -1) / d_k ** 0.5   # (…, T, T)
    weights = F.softmax(scores, dim=-1)
    return weights @ v                               # (…, T, d_v)
```

## Multi-head attention

One attention function averages everything into a single representation. Running
$h$ heads in parallel — each with its own learned projection — lets the model
attend to different relationships at once (syntax in one head, coreference in
another) and then concatenate the results.

## What I keep coming back to

- **Positional encodings** are the price of dropping recurrence: with no order
  built in, you inject it via sinusoids (or, later, learned/rotary embeddings).
- The encoder–decoder framing is now almost a footnote — decoder-only stacks
  dominate — but the attention block itself is unchanged.
- This is the direct ancestor of the retrieval systems I work on; see
  [[retrieval-augmented-generation]] for where attention meets external memory.

> [!tip] Re-read prompt
> Next pass: derive the gradient through softmax by hand and connect the
> $\sqrt{d_k}$ scaling to it quantitatively.
