# Quick Start

This guide summarizes the minimum steps for library users to run the uploader.

## 1. Install dependencies

```bash
npm install -D algolia-uploader
```

## 2. Prepare environment variables

For local execution, create a `.env` file like the example below.

```env
ALGOLIA_APP_ID=1234abcd5768
ALGOLIA_ADMIN_API_KEY=hogehigehuge
ALGOLIA_INDEX_NAME=algoliaIndexName
DATA_DIR=path/to/dir
```

The required variables are:

| Environment Variable | Description |
| --- | --- |
| `ALGOLIA_APP_ID` | Your Algolia App ID. |
| `ALGOLIA_ADMIN_API_KEY` | Your Algolia API key. It does not need to be an Admin key as long as it can update the target index. |
| `ALGOLIA_INDEX_NAME` | The name of your Algolia index. |
| `DATA_DIR` | Directory that contains JSON files to upload. Upload by specifying individual filenames is not supported yet. |

## 3. Prepare input JSON

Place JSON files in the directory specified by `DATA_DIR`.

- Only JSON files are supported.
- Each item must include an `objectID` field.

## 4. Run the uploader

You can run the uploader through a script like this in your `package.json`:

```json
{
	"scripts": {
		"algolia": "algolia-uploader"
	}
}
```

The CLI will read the JSON files and upload the records to Algolia.
