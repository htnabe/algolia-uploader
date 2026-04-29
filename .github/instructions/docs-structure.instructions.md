---
description: "Use when editing Markdown documentation. Enforce single-responsibility docs and remove redundant descriptions across files."
name: "Algolia Uploader Documentation SRP Rules"
applyTo: ["**/*.md"]
---

# Documentation Single-Responsibility Rules

- Keep each documentation file responsible for one topic.
- Do not duplicate the same descriptions across multiple docs files.
- If content overlaps, keep one canonical file and replace others with links.
- Prefer focused pages over monolithic files that mix unrelated concerns.
- Keep AGENTS.md concise; do not require it to mirror docs indexes.
- When moving content, update inbound links in the same change.
