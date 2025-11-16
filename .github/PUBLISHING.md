# 安全な npm publishing 手順

このドキュメントは、CI（GitHub Actions）を使って npm パッケージを安全に自動公開する運用手順をまとめたものです。

目的

- パッケージ公開時のサプライチェーンリスクを低減すること。

基本方針

- 公開トリガーは `タグ (v*.*.*)` のプッシュのみとする。
- npm の発行トークンは `Automation token` を使用し、最小権限（publish のみ）・有効期限を設定する。
- トークンは GitHub の `Environment`（例: `publish`）に登録し、必要に応じて承認者を設定する。
- CI ワークフローは必ずテスト・lint・依存性チェックを通過させてから publish する。

手順

1. npm 側で Automation token を作成

- npm (https://www.npmjs.com/) にログイン
- Profile → Access Tokens → Create New Token
- Type: Automation
- Permissions: Publish（最小）
- Expiration: 可能なら短期（例: 30〜90日）を設定
- トークンは一度しか表示されないので、安全に控えてください。

2. GitHub に `Environment` を作成してシークレットを登録

- リポジトリ → Settings → Environments → New environment → `publish`
- Environment に `NPM_AUTOMATION_TOKEN` を追加（値は npm で作成したトークン）
- 必要であれば `Required reviewers` を設定して、ワークフロー実行時に承認を必須にする

3. ブランチ・タグ戦略

- 公開はタグ `vX.Y.Z` の作成のみで行う
- タグは main など保護されたブランチからのみ作成する（ブランチ保護ルールで PR レビューを必須にする）

4. ワークフローでの安全チェック（ワークフロー内で実装済み）

- `npm ci`（lockfile 使用）
- `npm test`（ユニット/統合テスト）
- `npm audit`（重大な脆弱性の検出）
- タグと `package.json` のバージョン一致の検証

5. 署名・証跡（オプション推奨）

- より高い保証のため、ビルド成果物（`npm pack`で作成される tarball）を Sigstore/cosign で署名し、署名と provenance を GitHub Release に添付することを検討してください。

運用上の注意

- トークンは短期に設定し、定期ローテーションを行ってください。
- トークンは個人アカウントではなく bot アカウントや organization 管理アカウントで発行することを推奨します。
- 発行前に CI 成果物の内容を目視/自動チェックで確認できる仕組みを持ってください。

トラブルシュート

- ワークフローが `NPM_AUTOMATION_TOKEN` にアクセスできない場合は、ジョブが `environment: publish` を指定しているか確認してください。
- publish が失敗した場合は、まずワークフローのログを確認し、`npm publish` のエラーメッセージを確認してください。

---

このドキュメントはワークフローの補助としてリポジトリに置きます。運用ルールは組織ポリシーに合わせて調整してください。
