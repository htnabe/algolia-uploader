# Project Structure

This document provides a directory-level map of the repository.
`AGENTS.md` should stay concise and link here for structure details.

## Top-Level

- `.github/`: CI workflows and release/publishing documentation.
- `.husky/`: Git hooks for pre-commit and pre-push checks.
- `src/`: Application source code.
- `test/`: Vitest test suites.
- `docs/`: Supporting project documentation for agent and contributor indexing.
- `README.md`: Usage and environment setup.
- `package.json`: Scripts, dependencies, and lint-staged config.
- `build.config.ts`: `unbuild` build output configuration.
- `vitest.config.ts`: Test configuration.
- `tsconfig.json`: TypeScript compiler settings.

## Source Layout

- `src/index.ts`: CLI entry point and orchestration.
- `src/types/`
  - `IndexedItem.ts`: Data shape, type guard, and normalization.
  - `Operations.ts`: Operation model for add/update/delete handling.
- `src/utils/`
  - `ConfigProvider.ts`: Environment configuration singleton.
  - `AlgoliaClientProvider.ts`: Algolia client/index singleton.
  - `Uploader.ts`: Diff and upload execution logic.
  - `readAllJsonFiles.ts`: JSON source loader.

## Test Layout

- `test/ConfigProvider.test.ts`: Config singleton behavior.
- `test/AlgoliaClientProvider.test.ts`: Algolia provider behavior.
- `test/Uploader.test.ts`: Upload operation scenarios.
- `test/normalizeIndexedItem.test.ts`: Normalization and deterministic ordering checks.

## Related References

- Japanese publishing guide: `.github/PUBLISHING.md`
- English publishing guide: `.github/PUBLISHING.en.md`
- Publish workflow: `.github/workflows/publish.yml`
- Test workflow: `.github/workflows/test.yml`
