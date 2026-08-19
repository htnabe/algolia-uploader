# AGENTS Guide

This file helps coding agents be productive in this repository.

## Project Snapshot

- TypeScript CLI tool for syncing JSON data to Algolia.
- Entry point: [src/index.ts](src/index.ts)
- Core upload logic: [src/utils/Uploader.ts](src/utils/Uploader.ts)
- Data shape and validation: [src/types/IndexedItem.ts](src/types/IndexedItem.ts)

## Docs

Project documentation lives in [docs/development/quick-start.md](docs/development/quick-start.md).
For contributor setup and development workflow, see [docs/development/CONTRIBUTING.md](docs/development/CONTRIBUTING.md).

## Fast Commands

- Install deps: npm install
- Build (tsdown): npm run build
- Test: npm test
- Lint (Biome): npm run lint
- Lint + fix (Biome): npm run lint:fix
- Lint staged files: npm run lint:staged
- Local run: npm run dev

## Toolchain

- Required versions: Node.js `22.22.1`

## Required Environment

The runtime requires all of these variables:

- ALGOLIA_APP_ID
- ALGOLIA_ADMIN_API_KEY
- ALGOLIA_INDEX_NAME
- DATA_DIR

See setup details in [README.md](README.md).

## CI and Hooks

- Pre-commit runs lint-staged: [.husky/pre-commit](.husky/pre-commit)
- Pre-push runs tests: [.husky/pre-push](.husky/pre-push)
- CI test workflow: [.github/workflows/test.yml](.github/workflows/test.yml)

## Pull Requests

- When writing PR descriptions or comments, use [.github/PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md) as the canonical structure.

## Pitfalls

- DATA_DIR must point to an existing directory.
- Only JSON inputs are read by the loader utility.
- Version/tag consistency is validated in the publish workflow.
- This repo uses npm trusted publishing (OIDC); npm token secrets are not required for publish.
