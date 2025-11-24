# GitHub Copilot Instructions for algolia-uploader

This document provides guidelines for GitHub Copilot when working on the `algolia-uploader` project.

## Project Overview

`algolia-uploader` is a command-line utility for uploading data to Algolia search indexes. It's built with TypeScript and uses the Algolia search API to synchronize JSON data files with Algolia indexes.

## Technology Stack

- **Language**: TypeScript
- **Build Tool**: unbuild
- **CLI Framework**: citty
- **Testing**: vitest
- **Linting/Formatting**: Prettier
- **Environment Management**: dotenvx (encrypted .env files)
- **Package Manager**: npm

## Code Style and Conventions

### TypeScript

- Use TypeScript strict mode
- Prefer interfaces for type definitions
- Use type guards for runtime type checking (e.g., `isIndexedItem`)
- Export types as default when they represent the primary export of a module

### Formatting

- Use Prettier for code formatting
- Run `npm run lint` to format all files
- Prettier is configured to format `.js`, `.ts`, `.json`, and `.md` files

### Naming Conventions

- Use PascalCase for classes and interfaces (e.g., `Uploader`, `IndexedItem`)
- Use camelCase for variables, functions, and methods
- Use UPPERCASE for environment variables (e.g., `ALGOLIA_APP_ID`)

### Comments and Documentation

- Use JSDoc comments for public methods and classes
- Include `@param` and `@returns` tags in JSDoc
- Keep comments concise and meaningful
- Example:
  ```typescript
  /**
   * Uploads objects to Algolia, performing add, update, or delete operations as necessary.
   * @param {IndexedItem[]} newObjects - The new objects to be uploaded.
   * @returns {Promise<number>} The number of updated or added objects.
   */
  ```

## Project Structure

```
src/
├── index.ts              # Main CLI entry point
├── types/
│   ├── IndexedItem.ts    # Core type for Algolia objects
│   └── Operations.ts     # Type for CRUD operations
└── utils/
    ├── AlgoliaClientProvider.ts  # Algolia client singleton
    ├── ConfigProvider.ts         # Environment config singleton
    ├── Uploader.ts              # Core upload logic
    └── readAllJsonFiles.ts      # JSON file reader

test/
├── AlgoliaClientProvider.test.ts
├── ConfigProvider.test.ts
├── Uploader.test.ts
└── normalizeIndexedItem.test.ts
```

## Key Concepts

### IndexedItem

All objects uploaded to Algolia must have an `objectID` property:

```typescript
interface IndexedItem {
  objectID: string;
  [key: string]: unknown;
}
```

### Singleton Pattern

- `AlgoliaClientProvider` and `ConfigProvider` use the singleton pattern
- Use `getInstance()` to access the single instance

### Operations

The uploader determines three types of operations:

- **Add**: New objects not in the index
- **Update**: Objects with changed content
- **Delete**: Objects in the index but not in the new data

## Development Workflow

### Building

```bash
npm run build
```

### Testing

```bash
npm test
```

Tests use mocked Algolia clients and don't connect to real Algolia services.

### Debugging

```bash
npm run dev
```

This runs the CLI with `.env` file loaded via dotenvx.

### Linting

```bash
npm run lint
```

## Environment Variables

Required environment variables (stored in `.env` or `.env.ci`):

- `ALGOLIA_APP_ID`: Algolia application ID
- `ALGOLIA_ADMIN_API_KEY`: Algolia admin API key
- `ALGOLIA_INDEX_NAME`: Target index name
- `DATA_DIR`: Directory containing JSON files to upload

Note: `.env` files are encrypted with dotenvx in this repository.

## Testing Guidelines

### Test Structure

- Use vitest for testing
- Mock external dependencies (Algolia client)
- Test both success and error cases
- Use descriptive test names

### Example Test Pattern

```typescript
import { describe, it, expect } from "vitest";

describe("ComponentName", () => {
  it("should perform expected behavior", () => {
    // Arrange
    // Act
    // Assert
  });
});
```

## Common Patterns

### Error Handling

- Log errors with `console.error()`
- Exit with `process.exit(1)` for CLI errors
- Validate inputs before processing

### Type Guards

Use type guard functions for runtime type checking:

```typescript
export function isIndexedItem(item: unknown): item is IndexedItem {
  return (
    typeof item === "object" &&
    item !== null &&
    "objectID" in item &&
    typeof (item as IndexedItem).objectID === "string"
  );
}
```

### Normalization

Normalize objects to ensure consistent comparison:

- Sort object keys alphabetically (except `objectID` first)
- Sort arrays by `objectID`

## Important Notes

- Always preserve the `objectID` property in IndexedItem objects
- Use `es-toolkit`'s `isEqual` for deep object comparison
- The CLI expects JSON files with arrays of objects
- Directory paths in `DATA_DIR` should not include the filename
- All operations are batched using Algolia's batch APIs

## Adding New Features

When adding new features:

1. Update types in `src/types/` if needed
2. Add utility functions in `src/utils/` if needed
3. Write tests in `test/` directory
4. Update README.md with usage instructions
5. Run `npm run lint` before committing
6. Ensure all tests pass with `npm test`

## Dependencies

### Production

- `algoliasearch`: Official Algolia JavaScript client
- `citty`: Lightweight CLI framework
- `es-toolkit`: Modern utility library

### Development

- `@dotenvx/dotenvx`: Encrypted environment variable management
- `vitest`: Fast unit testing framework
- `prettier`: Code formatting
- `unbuild`: Build tool for libraries
