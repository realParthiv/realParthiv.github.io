---
title: SiteForge
stack: [Node.js, LLMs, Tailwind CSS, GSAP, Octokit]
year: 2026
status: "VERIFIED — SHIPPED"
order: 5
---
# Autonomous Multi-Agent Web Generation

Building bespoke, production-ready portfolio websites usually requires hours of manual layout design, component composition, animation tuning, and deployment setup. Traditional template generators produce rigid, cookie-cutter layouts that lack distinct brand identity and fluid interactions.

**SiteForge** was engineered to solve this by transforming natural language prompts into fully functional, uniquely styled multi-page portfolio websites using autonomous multi-agent orchestration.

## Multi-Agent Pipeline Architecture

Rather than relying on single-prompt generation—which frequently results in truncated code or broken layouts—SiteForge splits the generation process into a multi-stage autonomous agent pipeline:

1. **Intake Agent:** Analyzes the natural language prompt, evaluates target brand mood and content requirements, and generates a structured, validated `spec.json` schema.
2. **Dynamic Site Generator:** Consumes `spec.json` and synthesizes complete, multi-page HTML documents (`index.html`, `about.html`, `work.html`, `contact.html`). It determines layouts dynamically with zero hardcoded templates, integrating Tailwind CSS, GSAP animations, and Lenis smooth scrolling.
3. **Automated Validation Agent:** Inspects output structure, syntax, and asset links to verify code integrity before deployment.

## Provider-Agnostic LLM Engine

SiteForge supports multiple LLM providers (Anthropic Claude 3.5 Sonnet and Google Gemini 3 Flash Preview) via a modular client wrapper. The system manages token budgets, streams response outputs, and handles provider failover seamlessly.

## Automated Deployment Pipeline

The platform bridges code generation with cloud hosting. Utilizing `@octokit/rest`, the orchestrator automatically provisions a new GitHub repository, commits the generated asset bundle, configures GitHub Pages settings, and deploys the live site autonomously.
