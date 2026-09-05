# Repository Map

Directory-level map of the repository.

## Top-Level

- `.github/`: CI workflows and copilot-related documentation.
- `.husky/`: Git hooks for pre-commit and pre-push checks.
- `src/`: Application source code and co-located Vitest test suites.
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

### Features

- `src/features/authors`: CLI flag `--authors` implementation (show package authors).
- `src/features/dataDir`: Handler for `DATA_DIR` accepting a directory or single JSON file.
- `src/features/dataFiles`: Handler for `--data-files` accepting one-or-more explicit JSON file paths.

## Test Layout

Test suites live alongside their source files as `*.test.ts`:

- `src/index.test.ts`: CLI entry point and orchestration.
- `src/utils/ConfigProvider.test.ts`: Config singleton behavior.
- `src/utils/AlgoliaClientProvider.test.ts`: Algolia provider behavior.
- `src/utils/Uploader.test.ts`: Upload operation scenarios.
- `src/utils/readAllJsonFiles.test.ts`: JSON source loader behavior.
- `src/types/IndexedItem.test.ts`: Normalization and deterministic ordering checks.
- `src/features/authors/showAuthors.test.ts`: `--authors` flag behavior.
- `src/features/dataDir/retrieveDataFromDir.test.ts`: `DATA_DIR` handling.
- `src/features/dataFiles/retrieveDataFromFiles.test.ts`: `--data-files` handling.

## Related References

- [publishing.md](./publishing.md)
