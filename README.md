# algolia-uploader

This is a command-line util to upload Algolia sources. This idea comes from [atomic-algolia](https://github.com/chrisdmacrae/atomic-algolia).

## Example

1. Make `.env` file and set params

```.env
  ALGOLIA_APP_ID=1234abcd5768
  ALGOLIA_ADMIN_API_KEY=hogehigehuge
  ALGOLIA_INDEX_NAME=algoliaIndexName
  DATA_DIR=path/to/dir
```

2. Make `example.json` to be uploaded to Algolia

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

Cautions:

- `objectID` is necessary
- For now, only one json file can be loaded, I will support multiple files(maybe)

3. Run `npx algolia-uploader` (WIP)

If this library is published, I will try to make it possible to do the following

```
> npx algolia-uploader

> Added 3 items
> Updated 2 items
> Deleted 3 items
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
