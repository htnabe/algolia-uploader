# npm 公開運用ガイド（日本語）

このファイルは、日本語での公開手順を管理します。
英語版は `.github/PUBLISHING.en.md` を参照してください。

## 目的

- main への直接 push を行わず、PR ベースでリリースする。
- `package.json` のバージョンと Git タグを一致させる。
- GitHub Release をトリガーに npm publish を実行する。

## 現在の標準フロー

1. `dev` からリリースブランチを作成する。
   - 例: `release/v0.0.13`
2. リリースブランチでバージョンだけを更新する。
   - `npm version 0.0.13 --no-git-tag-version`
3. リリースブランチを `dev` にPRする。
4. `dev` を `main` にPRする。
5. `main` 反映後に `main` の対象コミットへタグを作成する。
   - 例: `v0.0.13`
6. GitHub Release を公開し、publish workflow を起動する。

## 実行コマンド例

### 1) リリースブランチ作成〜version更新

```bash
git checkout dev
git pull origin dev
git checkout -b release/v0.0.13
npm version 0.0.13 --no-git-tag-version
git add package.json package-lock.json
git commit -m "chore(release): 0.0.13"
git push -u origin release/v0.0.13
```

### 2) PR作成

```bash
gh pr create --base dev --head release/v0.0.13 --title "chore(release): 0.0.13"
gh pr create --base main --head dev --title "dev"
```

### 3) main反映後のタグ・Release

```bash
git checkout main
git pull origin main
git tag -a v0.0.13 -m "v0.0.13"
git push origin v0.0.13
gh release create v0.0.13 --target main --title "v0.0.13" --generate-notes
```

## v0.0.13 実施履歴（参考）

- `release/v0.0.13 -> dev`: PR #139
- `dev -> main`: PR #140
- tag/release: `v0.0.13`
- publish workflow: success

## 運用注意

- `npm version patch` は通常タグも同時作成するため、リリースブランチでは `--no-git-tag-version` を使う。
- `gh pr merge --delete-branch` は `dev -> main` PR に使わない。
  - `dev` ブランチ削除を招く可能性があるため。
- タグは `main` の公開対象コミットに対して作成する。

## 失敗時の確認ポイント

- GitHub Release は公開済みか（Draft のままではないか）。
- タグ名が `vX.Y.Z` 形式（例: `v0.0.13`）になっているか。
- `publish.yml` の workflow run が `release` イベントで起動しているか。
- `tag` と `package.json version` の一致チェックで失敗していないか。
