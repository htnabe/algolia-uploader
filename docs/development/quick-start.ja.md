# クイックスタート

このガイドでは、アップローダーをローカルで実行するための最小限の手順を説明します。

## 1. 依存関係をインストールする

```bash
npm install
```

## 2. 環境変数を準備する

ローカルでデバッグする場合は、自分の値を使用して `.env.local` ファイルを作成します。このファイルは Git の対象外であり、コミットしてはいけません。

```env
ALGOLIA_APP_ID=1234abcd5768
ALGOLIA_ADMIN_API_KEY=hogehigehuge
ALGOLIA_INDEX_NAME=algoliaIndexName
DATA_DIR=path/to/dir
```

必要な環境変数は次のとおりです。

- `ALGOLIA_APP_ID`
- `ALGOLIA_ADMIN_API_KEY`
- `ALGOLIA_INDEX_NAME`
- `DATA_DIR`

## 3. 入力 JSON を準備する

`DATA_DIR` に指定したディレクトリに JSON ファイルを配置します。

- 対応しているのは JSON ファイルのみです。
- 各アイテムには `objectID` フィールドが必要です。

## 4. アップローダーを実行する

```bash
npm run dev
```

CLI が JSON ファイルを読み込み、レコードを Algolia にアップロードします。

## 5. テストを実行する

ユニットテストでは環境変数をモックしているため、`.env.local` は必要ありません。

```bash
npm test
```
