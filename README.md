# algolia-uploader

This is a command-line util to upload Algolia sources. This idea comes from [atomic-algolia](https://github.com/chrisdmacrae/atomic-algolia).

## Install

```
npm install -D algolia-uploader
```

or

```
yarn add -D algolia-uploader
```

## Example

1. Make `.env` file and set params

```.env
  ALGOLIA_APP_ID=1234abcd5768
  ALGOLIA_ADMIN_API_KEY=hogehigehuge
  ALGOLIA_INDEX_NAME=algoliaIndexName
  DATA_DIR=path/to/dir
```

|                       | Description                                                                           |
| --------------------- | ------------------------------------------------------------------------------------- |
| ALGOLIA_APP_ID        | ID of the app indexed in Algolia                                                      |
| ALGOLIA_ADMIN_API_KEY | API key that can update, delete and make indexes                                      |
| ALGOLIA_INDEX_NAME    | Name of index set inn Algolia                                                         |
| DATA_DIR              | Relative path to the directory where the file you want to upload to Algolia is stored |

> [!IMPORTANT]
> Do not include the file name in `DATA_DIR`.

2. Make `example.json` to be uploaded to Algolia

> [!CAUTION]
>
> - Currently only json file is supported.
> - `objectID` key is necessary

```
[
  {
    "objectID": "prod_001",
    "name": "Wireless Headphones",
    "brand": "SoundMaster",
    "price": 129.99,
    "inStock": true,
    "rating": 4.5,
    "description": "Premium sound quality with noise cancellation.",
    "imageUrl": "https://example.com/images/headphones.jpg"
  },
  {
    "objectID": "prod_002",
    "name": "Ultra-Slim Laptop",
    "brand": "TechPro",
    "price": 999.00,
    "inStock": true,
    "rating": 4.8,
    "description": "Sleek design with powerful performance.",
    "imageUrl": "https://example.com/images/laptop.jpg"
  },
  {
    "objectID": "prod_003",
    "name": "Smart Security Camera",
    "brand": "SafeGuard",
    "price": 89.99,
    "inStock": false,
    "rating": 4.2,
    "description": "Monitor your home with 1080p video.",
    "imageUrl": "https://example.com/images/camera.jpg"
  }
]
```

3. Execute command

For example,

```
npx algolia-uploader
```

```
npm run algolia-uploader
```

```
yarn algolia-uploader
```

Then, the items will be uploaded.

```
> Added 3 items
> Updated 2 items
> Deleted 3 items

or

> No updates needed. All objects are up to date.
```

## Development

A `devcontainer` is included.

In this repository, `.env` and `.env.ci` are encrypted with [dotenvx](https://dotenvx.com/docs/quickstart).

- `.env` is for debugging and testing in your local environment
- `.env.ci` is for testing with GitHub Actions
  - These files contain only dummy data

### How to debug

Run `npm run dev`.

You can debug with your real Algolia application using `.debug/example.json` or a JSON file you prepared.

If you want to do so, you also need to edit the `.env` file.

### How to test

Run `npm test`.

The tests attempt to read the local `.env` file, but the actual variables used in the tests are updated internally.

Therefore, the tests do not access your real Algolia application.

### GitHub Actions

Testing with GitHub Actions uses `.env.ci`.
