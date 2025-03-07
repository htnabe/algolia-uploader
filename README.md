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

### Devcontainer

`Devcontainer` is included. If you are using vscode as your editor, the command below is required only the first time it is started.

```
yarn dlx @yarnpkg/sdks vscode
```

- Also check here :point_right: : https://yarnpkg.com/getting-started/editor-sdks

### How to dev in your env

You can debug in the development environment with the `yarn dev` command.

Running the `yarn dev` command will read the `.env` file in the development environment and access the DB provided in Algolia.

Therefore, please prepare your own Algolia test application using `.debug/example.json` and prepare the `.env` file as well.

Also, this package uses [dotenvx](https://dotenvx.com/docs/quickstart). If you are not familiar with it, I suggest you check the original docs.
