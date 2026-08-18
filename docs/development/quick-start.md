# Quick Start

This guide summarizes the minimum steps to run the uploader locally.

## 1. Install dependencies

```bash
npm install
```

## 2. Prepare environment variables

For local debugging, create a `.env.local` file with your own values. This file is
ignored by Git and must not be committed.

```env
ALGOLIA_APP_ID=1234abcd5768
ALGOLIA_ADMIN_API_KEY=hogehigehuge
ALGOLIA_INDEX_NAME=algoliaIndexName
DATA_DIR=path/to/dir
```

The required variables are:

- `ALGOLIA_APP_ID`
- `ALGOLIA_ADMIN_API_KEY`
- `ALGOLIA_INDEX_NAME`
- `DATA_DIR`

The repository may also contain an encrypted `.env` for shared configuration.
The `npm run dev` command uses `.env.local`; to use the encrypted `.env`
instead, run `dotenvx run -f .env jiti ./src/index.ts`. That requires the
corresponding private key in `.env.keys`. Do not commit or share `.env.keys`.

## 3. Prepare input JSON

Place JSON files in the directory specified by `DATA_DIR`.

- Only JSON files are supported.
- Each item must include an `objectID` field.

## 4. Run the uploader

```bash
npm run dev
```

The CLI will read the JSON files and upload the records to Algolia.

## 5. Run tests

Unit tests use mocked environment variables and do not require `.env`,
`.env.local`, or `.env.keys`:

```bash
npm test
```

## Related documents

- [Repository map](./repository-map.md)
- [Git workflow](./git-workflow.md)
- [Publishing](./publishing.md)
