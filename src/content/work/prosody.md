---
title: Prosody
stack: [Django, Next.js, RoBERTa, PyTorch, MCP, Celery, Jira, ClickUp]
year: 2026
status: "VERIFIED — LIVE"
url: "https://prosody.co.in"
summary: "A tool that turns meeting transcripts into Jira and ClickUp tickets, tracking where the conversation got tense and confirming names before it files anything."
featured: true
order: 0
---
# Eliminating Meeting Entropy and Action Item Ambiguity

During engineering and product alignment meetings, critical decisions and task commitments are frequently spoken verbally. Traditional transcription tools generate passive, flat text summaries that lack contextual reasoning, fail to detect underlying team tension, and cannot reliably map spoken names (e.g., *"Hey Alex, can you look into this?"*) to real employee user accounts in issue trackers like Jira or ClickUp. Pushing raw AI guesses directly into enterprise tools creates noisy, misassigned tickets.

**Prosody** was engineered as an intelligent meeting action execution platform. It transforms unstructured B2B meeting conversations into verified, executed work in Jira and ClickUp while detecting emotional friction line-by-line.

## 3D Emotion Modeling (Valence-Arousal-Dominance)

Standard sentiment analysis reduces dialogue to simple positive/negative binary states. Prosody implements a continuous 3D emotion model powered by a custom **RoBERTa regressor** fine-tuned on the **EmoBank** dataset, trained against a Concordance Correlation Coefficient (CCC) loss rather than plain MSE — the latter lets a model collapse to predicting the dataset mean and still look accurate. Predictions are post-hoc calibrated, and the label set's own noise ceiling is reported alongside model performance rather than glossed over.

For every line of dialogue ingested from Zoom (`.vtt`) or Microsoft Teams (`.docx`/`.txt`), the model predicts continuous metrics for **Valence** (sentiment), **Arousal** (calm vs. tense), and **Dominance** (assertive vs. submissive). This allows the platform to visually map segment-level emotional timelines and highlight high-tension meeting moments (`arousal >= 0.65` and `valence <= 0.35`).

## Claude AI & Model Context Protocol (MCP) Integration

The extraction layer relies on Anthropic's **Claude API** orchestrating over a custom **Model Context Protocol (MCP)** server via Server-Sent Events (SSE). 

Instead of passing massive, unstructured prompt context, Claude queries dedicated MCP tools (`get_segment_by_time`, `find_tense_moment`, `get_speaker_sentiment_summary`) to analyze transcripts alongside emotion scores. It drafts structured action items with self-reported confidence scores (0.000–1.000) and priority ranks based on emotional urgency.

## Human-in-the-Loop & Resilient Dispatch

To guarantee zero misassigned tickets, Prosody provides a human-in-the-loop verification modal where team leads resolve drafted names against live project directories fetched via OAuth from Jira Cloud or ClickUp.

Once confirmed, tickets are dispatched asynchronously via **Celery** and **Redis**. The integration layer is protected by per-tenant circuit breakers (`pybreaker`), exponential retry mechanisms (`tenacity`), and token-level Fernet encryption at rest (`django-cryptography`). Every confirmation or rejection feeds into a prediction feedback loop, powering company-wide analytics on AI accuracy and team workload distribution.

Multi-tenancy is enforced at the database level rather than patched on in application logic, so company-scoped isolation holds even under concurrent load. Prosody runs in production on a shared Oracle Cloud (ARM/Ampere) VM alongside an unrelated app, with its own database, its own Redis logical DB, and namespaced systemd services, nginx site, and TLS certs, so the two deployments can't interfere with each other.
