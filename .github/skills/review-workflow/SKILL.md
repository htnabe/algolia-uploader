---
name: review-workflow
description: "Use when reviewing a change, pull request, or implementation plan for this repo. Covers scope alignment, tests, regression risk, and repository-specific review output."
argument-hint: "What should be reviewed?"
---

# Review Workflow

Use this skill for code review, change review, or pre-push review in this repository.

## When to Use

- Review a feature or bug-fix change.
- Review a refactor for regression risk.
- Review a documentation or workflow change for redundancy and scope drift.
- Perform the required review step before pushing a moderately large feature.

## Review Checklist

### Minimum Review Items

- Scope and requirement alignment.
- Tests added or updated, plus stated test results.
- Risk and regression checks.
- Adherence to TypeScript library best practices.
- Adherence to SOLID principles.
- Adherence to TDD.

### Review Focus

- Confirm the change addresses the stated problem.
- Confirm behavior changes are covered by tests.
- Confirm deterministic behavior and input validation are preserved.
- Confirm TypeScript library best practices were followed.
- Confirm SOLID principles were followed where abstractions changed.
- Confirm TDD flow was followed.
- Flag mixed concerns, broad refactors, or duplicated documentation.
- For docs changes, check terminology consistency, typos, and missing characters.

## Procedure

1. Establish review scope.
   - Identify the requirement, intended behavior, and changed files.
   - Read the relevant engineering and architecture docs before judging the change.
   - Use the review checklist in this file as the minimum baseline.
2. Check requirement alignment.
   - Verify the change actually addresses the stated problem.
   - Flag scope drift, mixed concerns, or missing updates to related files.
3. Check tests and validation.
   - Confirm tests were added or updated when behavior changed.
   - Confirm the test coverage includes happy path and edge or error behavior.
   - Verify any reported test, build, or lint results are consistent with the change.
4. Check regression and design risk.
   - Look for broken assumptions, nondeterministic behavior, and weak validation.
   - Look for unnecessary abstractions, hidden side effects, or broad refactors.
   - Check compliance with TypeScript library best practices.
   - Check compliance with SOLID principles where design changed.
   - Check whether implementation followed TDD.
   - For docs changes, look for duplicated explanations and violations of single responsibility.
   - For docs changes, check terminology consistency and proofreading quality (typos and missing characters).
5. Produce review output.
   - List findings first, ordered by severity.
   - Include file references and explain the concrete impact.
   - If no findings remain, state that explicitly and note residual risks or testing gaps.

## Decision Points

- If the change is large, prioritize requirement alignment, tests, and regression risk before style concerns.
- If behavior changed without tests, treat that as a significant review issue.
- If docs overlap across files, recommend consolidating to one canonical location.
- If no defect is provable, note uncertainty as an assumption rather than inventing a finding.

## Completion Checks

- Findings are specific, actionable, and severity-ordered.
- Requirement alignment was checked.
- Tests and validation evidence were checked.
- Regression risk was assessed.
- TypeScript library best practices were checked.
- SOLID adherence was checked.
- TDD adherence was checked.
- Documentation quality was checked when docs changed (terminology consistency, typos, and missing characters).
- Remaining gaps or assumptions were stated.
