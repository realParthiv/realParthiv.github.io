---
title: "What Blockchain Taught Me About Trusting AI Agents"
date: 2026-08-13
tags: [AI agents, MCP, blockchain, verification]
excerpt: "MCP servers let an agent claim it booked something. Nothing forces that claim to be true. Building a certificate-verification system on Ethereum taught me exactly what's missing."
---

I built two things that don't usually end up in the same sentence: a system that books puja ceremonies through a chat conversation, and a system that verifies academic certificates on Ethereum. Building both back to back taught me something the first one is quietly missing.

## The gap

PujaGuru runs on an MCP server. A user chats with an agent, the agent calls tools — check availability, create a booking, confirm a slot — and the agent tells the user what happened. "Booked. You're confirmed for Tuesday."

Here's the problem: that sentence gets generated the same way every other sentence the model produces gets generated. Nothing about the words "you're confirmed" structurally guarantees the booking exists. The tool call returned a result, the model summarized it in language, and the user trusts the summary. Usually the tool call succeeded and the summary is accurate. But "usually" isn't a property you can build a business on, and it's definitely not a property you can build a certificate registry on.

## Where I actually enforce this

AcademicShield exists because "usually true" isn't good enough for a certificate. A university claims it issued a degree; anyone — an employer, another university, a visa office — can independently check the chain and confirm it, without taking the university's word for it, or mine. The verification isn't a UI feature bolted on top. It's the mechanism itself. Nobody has to trust a sentence.

That's the part MCP doesn't have. A tool call in an agent pipeline can fail silently, half-succeed, or execute correctly and then get summarized incorrectly — and from the user's side, all three look identical: text saying it worked.

## What "verifiable" would actually mean here

I don't think the fix is "put booking systems on a blockchain" — that's a bigger hammer than the problem needs, and I've built enough blockchain systems to know when the ceremony isn't worth the cost. The fix is smaller, and it comes from a place I didn't expect: database concurrency.

Row-level locking and transactions solve a version of this same problem. A transaction either commits or it doesn't — there's no state where the system silently believes it committed when it didn't. Two properties from that world are missing from most agent tool-calling setups:

- **Idempotency.** Calling the same tool twice with the same input should be safe, not a double booking. Most MCP tools I've seen — including my early versions — don't guarantee this.
- **Receipts, not summaries.** A tool call should return something checkable — a booking ID, a hash, a timestamp tied to a row that actually exists — and the agent's claim should trace back to that receipt instead of just paraphrasing it.

Neither of these needs a blockchain. They need the same discipline a backend engineer already applies to a payment system, applied to agent actions instead of skipped because "it's just a chatbot."

## The actual takeaway

The industry conversation about AI agents is mostly about what they can do — more tools, longer chains, more autonomy. Almost none of it is about whether the system can prove what it did after it did it. That's a solved problem in distributed systems and a mostly unsolved one in agent design. The gap isn't there because it's hard — transactions and idempotency keys aren't new ideas. It's there because nobody's forced to close it yet.

I'm closing it in my own tools going forward — not with a chain, with a receipt. If an agent tells a user something happened, there should be a row, a hash, or a log entry that agrees with it. Anything less is a sentence, not a confirmation.
