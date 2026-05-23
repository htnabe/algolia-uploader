# npm Publishing Operations Guide (English)

This file is the canonical publishing guide for this repository.

## Prerequisites

Before using the publish flow, configure the GitHub Actions settings required by `publish.yml`.

- Create a repository Environment named `publish`.
  - GitHub: Settings → Environments → New environment
- Configure npm Trusted Publishing (OIDC) for this GitHub repository/workflow.
- No npm token secret is required.

## Goal

- Release without direct pushes to `main`.
- Keep `package.json` version and Git tag aligned.
- Trigger npm publish from GitHub Release.
- Keep stable releases on npm `latest` and pre-releases on npm `next`.

## npm Distribution Tag Behavior

- Stable versions (for example `0.0.15`) are published with npm dist-tag `latest`.
- Pre-release versions (for example `0.0.15-beta.1`, `0.0.15-alpha.1`) are published with npm dist-tag `next` by default.
- You can override the pre-release dist-tag by setting repository variable `NPM_PRERELEASE_DIST_TAG`.
   - Example values: `next`, `beta`, `alpha`.
- Install pre-release builds with:

```bash
npm install algolia-uploader@next
```

## Current Standard Flow

1. Create a release branch from `dev`.
   - Example: `release/v0.0.13`
2. Bump version on the release branch only.
   - `npm version 0.0.13 --no-git-tag-version`
3. Open a PR from the release branch to `dev`.
4. Open a PR from `dev` to `main`.
5. After merge to `main`, create a tag on the target commit.
   - Example: `v0.0.13`
6. Publish a GitHub Release to trigger the publish workflow.

## Command Example

### 1) Release branch and version bump

```bash
git checkout dev
git pull origin dev
git checkout -b release/v0.0.13
npm version 0.0.13 --no-git-tag-version
git add package.json package-lock.json
git commit -m "chore(release): 0.0.13"
git push -u origin release/v0.0.13
```

### 2) Open pull requests

```bash
gh pr create --base dev --head release/v0.0.13 --title "chore(release): 0.0.13"
gh pr create --base main --head dev --title "dev"
```

### 3) Tag and Release after merge to main

```bash
git checkout main
git pull origin main
git tag -a v0.0.13 -m "v0.0.13"
git push origin v0.0.13
gh release create v0.0.13 --target main --title "v0.0.13" --generate-notes
```

### 4) Pre-release example (beta)

```bash
git checkout dev
git pull origin dev
git checkout -b release/v0.0.15-beta.1
npm version 0.0.15-beta.1 --no-git-tag-version
git add package.json package-lock.json
git commit -m "chore(release): 0.0.15-beta.1"
git push -u origin release/v0.0.15-beta.1

# after merging to main and tagging:
git checkout main
git pull origin main
git tag -a v0.0.15-beta.1 -m "v0.0.15-beta.1"
git push origin v0.0.15-beta.1
gh release create v0.0.15-beta.1 --prerelease --target main --title "v0.0.15-beta.1" --generate-notes
```

The publish workflow detects the `-beta.1` suffix and publishes this release to npm with the `next` tag.

## v0.0.13 Execution Record (Reference)

- `release/v0.0.13 -> dev`: PR #139
- `dev -> main`: PR #140
- tag/release: `v0.0.13`
- publish workflow: success

## Operational Notes

- `npm version patch` normally creates a tag automatically; use `--no-git-tag-version` on release branches.
- Do not use `gh pr merge --delete-branch` on `dev -> main` PRs.
  - It can unintentionally delete the `dev` branch.
- Always create the release tag on the exact `main` commit to be published.

## Troubleshooting Checklist

- Is the GitHub Release published (not left as a draft)?
- Does the tag name match package version format (e.g., `v0.0.13` or `v0.0.15-beta.1`)?
- Did the `publish.yml` workflow start from the `release` event?
- Did the tag/version consistency check pass?
