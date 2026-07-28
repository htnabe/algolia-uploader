---
name: design-workflow
description: "Use when planning a change, designing an implementation approach, or restructuring documentation in this repo. Covers architecture-aware scoping, single-responsibility design, and redundant-content removal."
argument-hint: "What should be designed or reorganized?"
---

# Design Workflow

Use this skill for implementation design, architecture-aware planning, and documentation design work.

## When to Use

- Plan a new feature before coding.
- Propose a refactor or structural change.
- Reorganize documentation.
- Evaluate where new behavior or docs should live.

## Design Sources

### Canonical References

- `docs/development/repository-map.md`: Repository, source, and test ownership.
- `.github/instructions/docs-structure.instructions.md`: Documentation single-responsibility and anti-duplication rules.

### Design Checks

- Extend an existing owner before creating a new file.
- Split files that would otherwise mix unrelated concerns.
- Remove redundant descriptions and keep one canonical source.
- Plan test impact before changing behavior.

## Procedure

1. Define the target outcome.
   - State the problem, desired behavior, and constraints.
   - Identify whether the work is code design, documentation design, or both.
2. Inspect the current structure.
   - Use `AGENTS.md` and `README.md` to find the canonical project guidance.
   - Use the design sources in this file to find the current owners.
3. Choose ownership boundaries.
   - Reuse an existing owner when the concern already has a canonical home.
   - Avoid duplicating descriptions across docs or introducing parallel abstractions in code.
4. Design the smallest coherent change.
   - Prefer focused changes over wide reorganizations.
   - Make side effects explicit and validation boundaries clear.
   - Plan the test impact before implementation starts.
5. Validate the design.
   - Check whether the proposal preserves deterministic behavior and clear error handling.
   - Check whether docs remain canonical and link-based instead of repetitive.
   - Check whether release or workflow docs must change as part of the design.
6. Present the plan.
   - Summarize affected files, rationale, tradeoffs, and validation strategy.
   - Call out ambiguous areas that need user confirmation.

## Decision Points

- If a concern fits an existing file, extend that file instead of creating a duplicate.
- If one file would mix unrelated concerns, split it before adding more content.
- If the design changes behavior, plan tests up front.
- If the design affects docs, update canonical pages and remove obsolete duplicates.

## Completion Checks

- The design has a clear owner for each concern.
- Redundant descriptions or structures were avoided.
- Test impact and validation were identified.
- Risks, tradeoffs, and follow-up questions were documented.
