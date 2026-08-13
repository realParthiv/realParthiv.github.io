---
title: Email Automation System
stack: [FastAPI, n8n, Ollama, PyTorch, ChromaDB]
year: 2024
status: "VERIFIED — SHIPPED"
order: 2
---
# The Problem of Support Latency

Customer support at scale is an exercise in managing entropy. As inbound email volume grows, human agents are bogged down by repetitive inquiries, categorization triage, and manual data retrieval. The latency between a customer asking a question and receiving an accurate, context-aware answer increases linearly with volume, creating a bottleneck that human capital alone cannot solve efficiently.

I architected the **Email Automation System** to completely eliminate this bottleneck. The goal was not simply to deploy a chatbot, but to engineer an autonomous, end-to-end pipeline capable of reading, comprehending, prioritizing, and resolving inbound communications with zero human intervention for standard inquiries.

## System Architecture

The solution operates as a seamless integration between high-throughput event processing and local, privacy-preserving LLM inference. 

At the edge, **n8n** acts as the ingestion layer, polling the inbox and formatting raw email payloads. These payloads are dispatched to a **FastAPI** backend designed for strict, asynchronous throughput.

Instead of relying on third-party APIs with variable latency and data privacy risks, the semantic reasoning layer is handled entirely locally via **Ollama**. The inference engine evaluates the payload to extract intent, categorize the issue, and assign a deterministic severity score. 

### The RAG Intervention

Crucially, the system does not hallucinate. For inquiries requiring domain-specific knowledge, the pipeline triggers a strict **Retrieval-Augmented Generation (RAG)** protocol. It queries a **ChromaDB** vector store—populated natively from internal company documentation via `pdfplumber`—to ground its generated responses in verified, factual data.

## Escalation and Impact

Autonomous systems must know their limits. If the inference engine detects a `Critical` severity flag or its confidence threshold falls below a specific parameter, the system gracefully aborts the automated response and immediately routes the payload to a human escalation queue.

By fine-tuning the underlying models via **PEFT (LoRA)**, the system adopts the precise tone and operational parameters of the organization. The result is a dramatic reduction in median time-to-resolution (MTTR), freeing human agents to tackle high-variance edge cases while the infrastructure handles the rest.
