# クイックスタート

このガイドでは、ライブラリ利用者がライブラリを実行するための最小限の手順を説明します。

- インストール

```bash
npm install -D algolia-uploader
```

## 環境変数を準備する

ローカルで実行する場合は、以下のような `.env` ファイルを作成します。

```env
ALGOLIA_APP_ID=1234abcd5768
ALGOLIA_ADMIN_API_KEY=hogehigehuge
ALGOLIA_INDEX_NAME=algoliaIndexName
```

必要な環境変数は次のとおりです。

| 環境変数 | 説明 |
| --- | --- |
| `ALGOLIA_APP_ID` | Algolia の App ID です。 |
| `ALGOLIA_ADMIN_API_KEY` | Algolia の API Key です。インデックスを更新できるKeyであればAdmin API Keyでなくてもよいです。 |
| `ALGOLIA_INDEX_NAME` | Algolia で使用している Index 名です。 |
| `DATA_DIR` | (非推奨)  v0.0.22で廃止されます。代わりに `--data-files` を使ってください。|

## 入力 JSON を準備する

AlgoliaにアップっロードするJSONファイルは、個別のファイルパスを `--data-files` フラグで指定してください。

- 対応しているのは JSON ファイルのみです。
- 各アイテムには `objectID` フィールドが必要です。

## アップローダーを実行する

`package.json`で以下のようなscriptを設定してください（複数ファイルはカンマ区切りで指定できます）：

```json
{
  "scripts": {
    "algolia": "algolia-uploader --data-files \"path/to/a.json,path/to/b.json\""
  }
}
```

位置引数は現在サポートしていません。入力ファイルは `--data-files` で指定してください。
