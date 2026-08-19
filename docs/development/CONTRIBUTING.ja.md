# コントリビューティング

このガイドは、このリポジトリに貢献する開発者向けです。

## 1. 開発環境の準備

- Node.js 22.22.1 を使用してください。
- 依存関係をインストールします。

```bash
npm install
```

- 実行確認が必要な場合は、[quick-start.ja.md](./quick-start.ja.md) を参照して `.env` を準備してください。

## 2. ローカル開発とデバッグ

CLI をローカル実行します。

```bash
npm run dev
```

入力ディレクトリと Algolia 認証情報は環境変数で指定します。

## 3. ビルド・Lint・テスト

- ビルド:

```bash
npm run build
```

- Lint:

```bash
npm run lint
```

- Lint 自動修正:

```bash
npm run lint:fix
```

- 単体テスト:

```bash
npm test
```

## 4. 単体試験の方針

- 振る舞いを変更した場合は、必ずテストを追加または更新してください。
- テストは決定的で独立した状態を保ってください。
- push 前に `npm test` を実行してください。
- pre-push フックでもテストが実行されるため、失敗は解消してください。

## 5. ワークフローとプルリクエスト

- ブランチ運用とコミット規約は [git-workflow.md](./git-workflow.md) に従ってください。
- プルリクエストの構成は [.github/PULL_REQUEST_TEMPLATE.md](../../.github/PULL_REQUEST_TEMPLATE.md) に従ってください。
- 挙動や使い方を変更した場合は関連ドキュメントを更新してください。

## 6. 関連資料

- プロジェクト構成と責務: [repository-map.md](./repository-map.md)
- リリース手順（メンテナー向け）: [publishing.md](./publishing.md)
- 利用者向け実行手順: [quick-start.ja.md](./quick-start.ja.md)
