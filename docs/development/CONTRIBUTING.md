# Contributing

This guide is for developers contributing to this repository.

## 1. Development environment setup

- Use Bun 1.4.3 and Node.js 22.22.1.
- Install dependencies:

```bash
bun install
```

- For runtime checks, prepare `.env` as described in [quick-start.md](./quick-start.md).

## 2. Local development and debugging

Run the CLI locally:

```bash
bun run dev
```

Use your local input directory and Algolia credentials through environment variables.

## 3. Build, lint, and test commands

- Build:

```bash
bun run build
```

- Lint:

```bash
bun run lint
```

- Lint with autofix:

```bash
bun run lint:fix
```

- Unit tests:

```bash
bun run test
```

## 4. Unit test policy

- Add or update tests for every behavior change.
- Keep tests deterministic and isolated.
- Run `bun run test` before pushing.
- Pre-push hook also runs tests. Do not bypass failures.

## 5. Workflow and pull requests

- Follow commit and branch rules in [git-workflow.md](./git-workflow.md).
- Follow the pull request structure in [.github/PULL_REQUEST_TEMPLATE.md](../../.github/PULL_REQUEST_TEMPLATE.md).
- Update related documentation when behavior or usage changes.

## 6. Related references

- Project structure and ownership: [repository-map.md](./repository-map.md)
- Release process (maintainers): [publishing.md](./publishing.md)
- End-user execution steps: [quick-start.md](./quick-start.md)
