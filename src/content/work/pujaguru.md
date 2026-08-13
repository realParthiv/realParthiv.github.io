---
title: PujaGuru
stack: [Django, MCP, MySQL, Django Channels, Firebase]
year: 2025
status: "VERIFIED — SHIPPED"
order: 2
---
Two-sided platform connecting people with pandits for religious services — separate apps for the user side and the pandit-side management. Built the MCP server exposing booking and profile tools; an AI chatbot uses those tools to run a full puja booking flow through conversation, no traditional UI involved. Real-time chat between users and pandits runs on Django Channels over WebSockets, with Firebase Cloud Messaging handling push notifications. Authentication supports one mobile number holding multiple roles — user and pandit — closer to Uber's driver/rider login model than a typical single-role system.
