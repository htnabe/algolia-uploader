# Quick Start

This guide explains the minimum steps to run the uploader.

## 1. Install

```bash
npm install -D algolia-uploader
```

## 2. Credentials

Create a `.env` file for local development with your Algolia credentials:

```env
ALGOLIA_APP_ID=yourAppId
ALGOLIA_ADMIN_API_KEY=yourAdminApiKey
ALGOLIA_INDEX_NAME=yourIndexName
```

## 3. Provide input JSON

The uploader accepts JSON files containing records with an `objectID` field. Provide input using CLI flags (recommended):

- `--data-files` — space-separated list of JSON file paths

Example `package.json` script (using `--data-files`):

```json
{
	"scripts": {
		"algolia": "algolia-uploader --data-files path/to/a.json path/to/b.json"
	}
}
```

## Notes

- Only JSON files are supported.
- Each record must include an `objectID` field.
- Additional paths after `--data-files` are accepted as positional arguments; bare positional arguments without `--data-files` are still rejected.

For more details, see the repository documentation.
