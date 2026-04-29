# Working Rules

This document defines team-level implementation and git operation policy.
`AGENTS.md` should only index this file instead of duplicating detailed rules.

## Implementation Policy

- Use test-driven development (TDD): write or update tests first, then implement the minimum code to pass.

## Commit Message Policy

- Use Conventional Commits for all commits.
- Recommended format: `type(scope): summary`
- Example: `docs(publishing): clarify trusted publishing prerequisites`

## Branch Strategy for New Features

- When implementing new features, create a feature branch from `dev`.
- Do not start new feature branches from `main`.

## Review Before Push

- If the push includes a moderately large feature, perform review before pushing.
- Review must include at least:
  - scope and requirement alignment
  - tests added/updated and test results
  - risk/regression checks

## Design and Implementation Best Practices

- Prefer small, focused changes over broad refactors.
- Keep functions single-purpose and side effects explicit.
- Validate external input early and fail fast with actionable error messages.
- Preserve deterministic behavior (stable ordering and repeatable results).
- Use explicit types and avoid introducing new `any` unless absolutely necessary at boundaries.
- Reuse existing patterns before adding new abstractions.
- Cover both happy path and error/edge cases when behavior changes.
- Keep PR scope coherent: do not mix unrelated cleanup with feature work.

## Notes

- For release-specific branch flow, follow `.github/PUBLISHING.md` and `.github/PUBLISHING.en.md`.
