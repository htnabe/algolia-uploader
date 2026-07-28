# Quick Start

This guide summarizes the minimum steps to run the uploader locally.

## 1. Install dependencies

```bash
npm install
```

## 2. Prepare environment variables

Create a `.env` file with the required values:

```env
ALGOLIA_APP_ID=1234abcd5768
ALGOLIA_ADMIN_API_KEY=hogehigehuge
ALGOLIA_INDEX_NAME=algoliaIndexName
DATA_DIR=path/to/dir
```

## 3. Prepare input JSON

Place JSON files in the directory specified by `DATA_DIR`.

- Only JSON files are supported.
- Each item must include an `objectID` field.

## 4. Run the uploader

```bash
npm run dev
```

The CLI will read the JSON files and upload the records to Algolia.

## Related documents

- [Repository map](./repository-map.md)
- [Git workflow](./git-workflow.md)
- [Publishing](./publishing.md)
