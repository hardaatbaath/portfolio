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

**RAG** couples a generator (a [[attention-is-all-you-need|Transformer]] seq2seq
model) with a **retriever** over a dense vector index of documents. Instead of
forcing every fact into the weights, the model looks things up at inference time
and conditions its output on what it finds.

> [!key] The core bet
> Split knowledge into two stores: *parametric* memory (the weights, good at
> fluency and reasoning) and *non-parametric* memory (a document index, good at
> facts). You can swap the index without retraining the model.

## How it works

1. Encode the query with a question encoder.
2. Retrieve the top-$k$ documents by maximum inner-product search (MIPS) against
   a pre-encoded passage index.
3. Condition the generator on the query **and** the retrieved passages.

The paper marginalises over retrieved documents two ways:

- **RAG-Sequence** — use the *same* $k$ documents to generate the whole output.
- **RAG-Token** — allow a *different* document to drive each token.

$$
p_{\text{RAG-Token}}(y \mid x) = \prod_{i}^{N} \sum_{z \in \text{top-}k} p_\eta(z \mid x)\, p_\theta(y_i \mid x, z, y_{1:i-1})
$$

```python
# Sketch: retrieve then generate.
docs = index.search(encode_query(x), k=5)     # non-parametric memory
ctx = concat(x, docs)
y = generator.generate(ctx)                     # parametric memory
```

## Why I care

This is the shape of the multilingual RAG systems I build at Nurix — the failure
modes in practice are almost always *retrieval* failures, not generation ones.

> [!warning] Open question
> Retrieval quality dominates end-to-end quality, yet it's trained with a much
> weaker signal than the generator. How much of the gap closes with better
> negatives vs. joint training of retriever + generator?

- The attention mechanism the generator relies on is the same one from
  [[attention-is-all-you-need]].
- Next: read the FiD paper and compare how it fuses passages against RAG-Token.
