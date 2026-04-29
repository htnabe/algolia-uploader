---
description: "Use when writing or modifying TypeScript implementation or tests in src and test. Enforces repository engineering rules: TDD-first workflow, explicit typing, deterministic behavior, focused changes, and regression-safe updates."
name: "Algolia Uploader TypeScript Engineering Rules"
applyTo: ["src/**/*.ts", "test/**/*.ts"]
---

# TypeScript Engineering Rules

Use these rules when implementing or modifying TypeScript behavior in `src/` and `test/`.

## Core Rules

- Use TDD: add or update tests before implementation changes.
- Follow Eric Evans' Test-Driven Development discipline: start from failing tests, implement the minimum change, then refactor safely.
- Prefer small, focused changes over broad refactors.
- Keep functions single-purpose and make side effects explicit.
- Validate external input early and fail fast with actionable errors.
- Preserve deterministic behavior (stable ordering and repeatable outputs).
- Use explicit types; avoid introducing new `any` except at unavoidable boundaries.
- Apply TypeScript library best practices (clear public API boundaries, explicit types, safe error handling, and compatibility-conscious changes).
- Apply SOLID principles when introducing or changing abstractions.
- Reuse existing patterns before introducing new abstractions.
- When behavior changes, cover happy path and edge or error cases in tests.
- Keep change scope coherent; avoid mixing unrelated cleanup into feature work.

## Implementation Flow

1. Identify the change scope.
   - Read `AGENTS.md` and relevant docs in `docs/`.
   - Map the affected code paths before editing.
   - Confirm whether the change affects runtime behavior, validation, docs, or release flow.
2. Plan the minimum viable change.
   - Reuse existing patterns before introducing abstractions.
   - Prefer a small coherent change over a broad refactor.
3. Update tests first.
   - Add or modify tests before implementation.
   - Cover happy path plus edge or error behavior when behavior changes.
4. Implement the smallest code change that satisfies the tests.
   - Keep failure messages actionable.
5. Validate the result.
   - Run targeted tests first, then broader validation as needed.
   - If the change affects build or lint-sensitive code, run `npm run build` and `npm run lint` when appropriate.
   - If the change affects release or CI behavior, inspect related workflow or hook docs before finishing.
6. Summarize the outcome.
   - State what changed, why it changed, and what was validated.
   - Note residual risks, assumptions, or follow-up work.

## Decision Points

- If behavior changes, update tests before code.
- If the change is mostly cleanup with no behavioral impact, avoid unrelated refactors anyway.
- If docs or release flow are affected, update the canonical docs in `docs/` instead of duplicating guidance elsewhere.
- If the work is a new feature branch task, prefer the branch strategy in `docs/engineering/git-workflow.md`.

## Completion Checks

- Tests were added or updated first.
- The implementation is focused and coherent.
- Input validation and error handling remain actionable.
- Deterministic behavior was preserved.
- TypeScript library best practices were followed.
- SOLID principles were respected where abstractions changed.
- Eric Evans TDD flow was followed.
- Any affected docs were updated in one canonical place.
