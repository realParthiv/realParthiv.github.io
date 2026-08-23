---
title: PujaGuru
stack: [Django, DRF, MariaDB, WebSockets, Redis, Celery, FCM]
year: 2025
status: "VERIFIED — SHIPPED"
summary: "A booking marketplace for pandits, with live offer broadcasting and an MCP server that lets an AI agent handle a whole booking in conversation."
featured: true
order: 5
---
# Architecting a Two-Sided Marketplace

The unorganized sector of religious services suffers from a severe lack of transparency and discovery. Users struggle to find verified, available pandits, while practitioners rely on fragmented word-of-mouth networks to manage their bookings and schedules. The challenge wasn't just building a directory—it was engineering a highly concurrent, real-time marketplace that handles bidding, scheduling, and communication simultaneously across two separate client applications.

**PujaGuru** solves this by abstracting the friction into a seamless platform. It connects users with verified pandits for religious services through a unified backend architecture designed for scale and real-time responsiveness.

## Real-Time Concurrency and Bidding

A modern marketplace requires absolute temporal precision. When a user requests a service, the system must broadcast the offer to relevant pandits, manage concurrent acceptance attempts, and enforce strict timeouts—all without race conditions.

To achieve this, the platform utilizes **Django Channels** and **Daphne** to establish full-duplex WebSocket connections. The real-time layer runs on a dedicated **Redis** cluster, instantly pushing booking assignments, state changes, and chat messages to the clients. This ensures that pandits receive live broadcast offers without ever polling the server.

If a broadcasted offer is not accepted within a strictly defined window, an asynchronous **Celery** worker—scheduled via Celery Beat—automatically invalidates the offer and re-routes the booking to the next available practitioner. 

## The MCP Booking Agent

The most compelling technical achievement of PujaGuru lies in its interface—or lack thereof. Beyond the standard mobile applications, I engineered a complete **Model Context Protocol (MCP)** server integrated directly into the backend. 

This MCP server exposes the core booking algorithms, calendar checks, and profile directories as executable tools. As a result, an autonomous AI agent can interact with the backend to negotiate, schedule, and finalize a complex booking entirely through natural language conversation, entirely bypassing traditional graphical user interfaces.

## Unified Identity and Security

Marketplaces often struggle with fragmented user identity when participants switch roles. PujaGuru employs a unified authentication model driven by **SimpleJWT**. A single mobile identity can hold multi-role privileges (User and Pandit), sharing a core identity while partitioning wallet ledgers, catalogs, and payouts at the database level using **MariaDB**.

Push notifications are critical for operational sync. Using the **Firebase Admin SDK (FCM)**, the Django backend pushes deterministic alerts to devices for late-start warnings, muhurat (auspicious timing) reminders, and real-time chat sync, ensuring the physical service delivery matches the digital precision of the platform.
