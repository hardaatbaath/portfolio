---
title: "Moshi: a Speech-Text Foundation Model for Real-Time Dialogue"
paper: "https://arxiv.org/abs/2410.00037"
authors: "Défossez, Mazaré, Orsini, et al. (Kyutai)"
venue: "arXiv 2024"
date: 2026-08-04
tags: [speech, audio-codec, dialogue, llms, full-duplex]
status: summarized
summary: "A full-duplex speech-to-speech LLM: a text-LM backbone generates audio-codec tokens for both speakers in parallel, hitting ~200ms real-world latency."
---

Conventional voice assistants chain separate models — voice-activity detection →
ASR → a text dialogue model → TTS. That pipeline is latency-heavy, loses
non-linguistic signal (emotion, tone), and forces rigid turn-taking. **Moshi**
collapses the whole stack into a single **speech-to-speech** model that listens
and speaks *at the same time*.

> [!key] The core idea
> Treat spoken dialogue as one generative modelling problem over discrete audio
> tokens, with **both** the model's and the user's speech modelled as parallel
> streams — so there are no explicit turn boundaries, and interruptions and
> overlapping speech just fall out of the architecture.

## Core contributions (as claimed by the authors)

1. **Mimi**, a streaming neural audio codec that jointly encodes *semantic* and
   *acoustic* tokens at a very low frame rate.
2. **Moshi**, the first real-time **full-duplex** spoken LLM, built on a text-LM
   backbone that generates Mimi tokens.
3. **Inner Monologue** — predicting time-aligned text as a prefix to audio,
   which sharply improves linguistic quality and unlocks zero-shot streaming
   ASR/TTS.

## Method

**Mimi codec.** Runs at **12.5 Hz / 1.1 kbps** with **8 codebooks** (2048
centroids each). The first quantizer level is *distilled from WavLM* to carry
semantic content; the remaining 7 levels are a residual VQ for acoustics. It's
causal, so it streams with ~80 ms initial latency.

**Helium backbone.** A **7B**-parameter Transformer (RMSNorm, RoPE,
FlashAttention, 32 layers, 4096 context) pre-trained on **2.1T** tokens of
English text — the same attention machinery as [[attention-is-all-you-need]],
repurposed to emit audio tokens.

**RQ-Transformer + multi-stream.** A two-stage decoder: a large *Temporal*
Transformer over time steps, and a small *Depth* Transformer that predicts the
K sub-tokens within each step. Each frame carries **K = 17 streams**:

```text
[ 1 text ] + [ 8 audio: Moshi ] + [ 8 audio: user ]   per 12.5 Hz frame
             └── acoustic delay τ = 1 step ──┘
```

Modelling the user's stream too is what makes it full-duplex — Moshi is always
"hearing" while it speaks.

**Inner Monologue.** Text tokens are aligned to the 12.5 Hz grid via Whisper
word timestamps (with PAD/EPAD tokens between words) and generated *before* the
audio for each frame. Varying the text↔audio delay yields streaming ASR or TTS
for free.

## Key results

| Aspect | Reported |
| --- | --- |
| Latency | **160 ms** theoretical, **200 ms** practical |
| Helium (text) | 79.6% ARC-easy · 54.3% MMLU |
| Spoken QA | Authors report state-of-the-art among speech-text models |
| Release | Code + weights at `github.com/kyutai-labs/moshi` |

## Limitations & open questions

- English-only backbone (2.1T English tokens) — multilingual behaviour is out of
  scope here.
- Full-duplex quality leans heavily on Mimi's low-bitrate reconstruction; the
  semantic/acoustic split is elegant but under-ablated for far-field / noisy audio.

> [!warning] Reviewer note
> The 200 ms figure is end-to-end model latency, not a product-level number
> (network, endpointing, and client buffering sit on top). Worth pinning down
> before quoting it as "conversational latency."

## Why I care

This is the cleanest existing blueprint for a low-latency, emotion-preserving
speech agent — directly relevant to the speech + dialogue systems I work on.
The Mimi semantic-token trick is the piece I want to re-read most; contrast its
"knowledge in the tokens" framing with the external-memory approach in
[[retrieval-augmented-generation]].
