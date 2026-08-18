# Repository Map

Directory-level map of the repository.

## Top-Level

- `.github/`: CI workflows and copilot-related documentation.
- `.husky/`: Git hooks for pre-commit and pre-push checks.
- `src/`: Application source code.
- `test/`: Vitest test suites.
- `docs/`: Supporting project documentation.
- `README.md`: Usage and environment setup.
- `package.json`: Scripts, dependencies, and lint-staged config.
- `tsdown.config.ts`: `tsdown` build output configuration.
- `vitest.config.ts`: Test configuration.
- `tsconfig.json`: TypeScript compiler settings.

## Source Layout

- `src/index.ts`: CLI entry point and orchestration.
- `src/utils/Uploader.ts`: Diff and upload execution logic.

### Types

- `src/types/IndexedItem.ts`: Data shape, type guard, and normalization.
- `src/types/Operations.ts`: Operation model for add/update/delete handling.

### Utilities

- `src/utils/ConfigProvider.ts`: Environment configuration singleton.
- `src/utils/AlgoliaClientProvider.ts`: Algolia client/index singleton.
- `src/utils/readAllJsonFiles.ts`: JSON source loader.

## Test Layout

- `test/ConfigProvider.test.ts`: Config singleton behavior.
- `test/AlgoliaClientProvider.test.ts`: Algolia provider behavior.
- `test/Uploader.test.ts`: Upload operation scenarios.
- `test/normalizeIndexedItem.test.ts`: Normalization and deterministic ordering checks.

## Related References

- [publishing.md](./publishing.md)
