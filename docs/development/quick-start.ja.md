# クイックスタート

このガイドでは、ライブラリ利用者がライブラリを実行するための最小限の手順を説明します。

## 1. 依存関係をインストールする

```bash
npm install -D algolia-uploader
```

## 2. 環境変数を準備する

ローカルで実行する場合は、以下のような `.env` ファイルを作成します。

```env
ALGOLIA_APP_ID=1234abcd5768
ALGOLIA_ADMIN_API_KEY=hogehigehuge
ALGOLIA_INDEX_NAME=algoliaIndexName
DATA_DIR=path/to/dir
```

必要な環境変数は次のとおりです。

| 環境変数 | 説明 |
| --- | --- |
| `ALGOLIA_APP_ID` | Algolia の App ID です。 |
| `ALGOLIA_ADMIN_API_KEY` | Algolia の API Key です。インデックスを更新できるKeyであればAdmin API Keyでなくても構いません。 |
| `ALGOLIA_INDEX_NAME` | Algolia で使用している Index 名です。 |
| `DATA_DIR` | アップロードしたい JSON ファイルを格納しているフォルダです。JSON ファイル名を個別指定したアップロードは、まだサポートしていません。 |

## 3. 入力 JSON を準備する

`DATA_DIR` に指定したディレクトリに JSON ファイルを配置します。

- 対応しているのは JSON ファイルのみです。
- 各アイテムには `objectID` フィールドが必要です。

## 4. アップローダーを実行する

`package.json`では以下のようなscriptで実行できます。

```json
{
  "scripts": {
    "algolia": "algolia-uploader"
  }
}
```

CLI が JSON ファイルを読み込み、レコードを Algolia にアップロードします。
