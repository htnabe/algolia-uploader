# npm Publishing Operations Guide (English)

This file is the canonical publishing guide for this repository.

## Prerequisites

Before using the publish flow, configure the GitHub Actions settings required by `publish.yml`.

- Create a repository Environment named `publish`.
  - GitHub: Settings → Environments → New environment
- Configure npm Trusted Publishing (OIDC) for this GitHub repository/workflow.
- Configure branch protection for `main` so the required CI checks for the test workflow must pass before a merge is allowed.
- No npm token secret is required.
- The publish job pins npm to the `11` line: trusted publishing needs npm 11.5.1 or later, while npm 12 requires a newer Node than the workflow uses.

## Goal

- Release without direct pushes to `main`.
- Keep `package.json` version and Git tag aligned.
- Merge a release PR only after its CI checks have been polled to success.
- Publish to npm only after the required CI succeeds for the `main` merge commit.
- Publish to npm automatically only when a release version was intentionally bumped.
- Keep stable releases on npm `latest` and pre-releases on the matching channel (`beta`, `rc`, or `next`).
- Create the git tag locally (repository owner only) after `npm publish` succeeds, and let the tag push create the GitHub Release automatically.

## Release Policy (Main-First)

- Do not push release version bumps directly to `dev`.
- Always use a dedicated release branch from `dev`.
  - Examples: `release/v0.0.15`, `release/v0.0.15-beta.1`, `release/v0.0.15-rc.1`
- Merge flow for every release:
  1. `release/*` -> `dev`
  2. `dev` -> `main`
  3. Confirm the CI workflow has passed on the merge commit to `main`
  4. The publish workflow is triggered only after the test workflow succeeds on that `main` commit
  5. Publish to npm only when `package.json` or `package-lock.json` changed and the version increased
  6. After `npm publish` succeeds, the repository owner creates the `v<version>` tag locally on that `main` commit and pushes it
  7. The tag push triggers `github-release.yml`, which creates the GitHub Release
- The GitHub Actions publish workflow is intentionally not triggered by a GitHub Release event.

## CI Polling Rule (Required)

- Before merging any release PR, poll its CI checks until every required check succeeds.
- Wait at most 5 minutes. If the checks have not all succeeded by then, treat the release as failed and stop immediately.
- Do not merge, tag, or publish a release while checks are pending, failing, or unresolved.
- Apply the same rule to the publish workflow run on `main`: poll it, cap the wait at 5 minutes, and stop on timeout or failure.
- Create and push the release tag only after the publish workflow run has succeeded. Then poll the `Create GitHub Release from Tag` workflow run with the same 5-minute cap.

## npm Distribution Tag Behavior

- Stable versions (for example `0.0.15`) are published with npm dist-tag `latest`.
- Pre-release versions with a `beta` identifier (for example `0.0.15-beta.1`) are published with npm dist-tag `beta`.
- Pre-release versions with an `rc` identifier (for example `0.0.15-rc.1`) are published with npm dist-tag `rc`.
- Other prerelease versions (for example `0.0.15-next.1` or `0.0.15-alpha.1`) are published with npm dist-tag `next` by default.
- You can override the fallback prerelease tag by setting repository variable `NPM_PRERELEASE_DIST_TAG`.
  - Example values: `next`, `beta`, `rc`.
- Install pre-release builds with:

```bash
npm install algolia-uploader@beta
# or
npm install algolia-uploader@rc
# or
npm install algolia-uploader@next
```

## Automatic Publish Safety Rule

The publish workflow only runs after the main-branch test workflow succeeds, and only when the `main` commit includes a real version bump in either `package.json` or `package-lock.json` and the version is greater than the previous value (prerelease versions such as `-beta.1` or `-rc.1` count as an increase over their preceding stable or prerelease version).

This prevents routine documentation or maintenance merges from accidentally running `npm publish` and failing with a duplicate-version error.

## Tag Creation and GitHub Release Creation

Tag creation on this repository is restricted by a repository ruleset, so GitHub Actions cannot push tags.
The publish workflow therefore never creates tags or Releases; those flows are fully separated.

- `publish.yml` (`Secure Publish to npm`): publishes to npm only. The `publish` job keeps `contents: read`.
- The repository owner creates the annotated tag `v<version>` locally on the published `main` commit and pushes it.
- `github-release.yml` (`Create GitHub Release from Tag`): triggered by `push` on tags matching `v*`.
  - Fails if the tag name does not match `v<package.json version>` on the tagged commit.
  - Skips creation when a Release for that tag already exists, so re-runs are safe.
  - Creates the Release with auto-generated notes (`gh release create --generate-notes`), marking it as a
    pre-release when the version contains a prerelease identifier (for example `-beta.1` or `-rc.1`).
  - Requires only `contents: write`.

## Current Standard Flow

1. Create a release branch from `dev`.
   - Example: `release/v0.0.13`
2. Bump version on the release branch only.
   - `npm version 0.0.13 --no-git-tag-version`
3. Open a PR from the release branch to `dev`, poll its CI, and merge only after it succeeds.
4. Open a PR from `dev` to `main`, poll its CI, and merge only after it succeeds.
5. Poll the publish workflow run for the `main` merge commit.
6. If the `main` push changed `package.json` or `package-lock.json`, the publish workflow automatically publishes to npm.
7. After `npm publish` succeeds, create the `v<version>` tag locally on that `main` commit and push it.
8. The tag push triggers the GitHub Release workflow, which creates the Release.

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

### 3) Poll CI before merging each PR

```bash
# stops with a non-zero status on failure or after 5 minutes
timeout 300 gh pr checks <pr-number> --watch --fail-fast
gh pr merge <pr-number> --merge --delete-branch=false
```

### 4) Poll the publish workflow after the merge to main

```bash
git checkout main
git pull origin main
# The publish workflow runs automatically when package.json / package-lock.json changed.
RUN_ID=$(gh run list --workflow="Secure Publish to npm" --branch main --limit 1 --json databaseId --jq '.[0].databaseId')
timeout 300 gh run watch "${RUN_ID}" --exit-status
```

### 5) Create and push the release tag locally

```bash
# only after the publish workflow succeeded
git checkout main
git pull origin main
git tag -a v0.0.13 -m "v0.0.13"
git push origin refs/tags/v0.0.13

# the tag push triggers the GitHub Release workflow
RELEASE_RUN_ID=$(gh run list --workflow="Create GitHub Release from Tag" --limit 1 --json databaseId --jq '.[0].databaseId')
timeout 300 gh run watch "${RELEASE_RUN_ID}" --exit-status
gh release view v0.0.13
```

### 6) Pre-release example (beta)

```bash
git checkout dev
git pull origin dev
git checkout -b release/v0.0.15-beta.1
npm version 0.0.15-beta.1 --no-git-tag-version
git add package.json package-lock.json
git commit -m "chore(release): 0.0.15-beta.1"
git push -u origin release/v0.0.15-beta.1

# after the dev -> main PR is merged and CI passes
# the publish workflow publishes the package to npm with the beta dist-tag,
# then create and push the v0.0.15-beta.1 tag locally to generate a pre-release GitHub Release
```

The publish workflow detects the prerelease identifier and maps it to `beta`, `rc`, or `next` automatically.

## v0.0.13 Execution Record (Reference)

- `release/v0.0.13 -> dev`: PR #139
- `dev -> main`: PR #140
- CI must pass on the merge commit before npm publish is allowed
- npm publish: success
- tag: `v0.0.13` (pushed locally) / release: created automatically by the tag-triggered workflow

## Operational Notes

- `npm version patch` normally creates a tag automatically; use `--no-git-tag-version` on release branches.
- Do not use `gh pr merge --delete-branch` on `dev -> main` PRs.
  - It can unintentionally delete the `dev` branch.
- Always tag the exact `main` commit that was successfully published to npm, not a possibly-advanced branch HEAD.
- Only the repository owner can create tags; the ruleset rejects tag pushes from GitHub Actions.
- Do not rely on GitHub Releases to trigger the publish workflow.
- Do not bypass a blocked or pending merge; a timeout is a release failure, not a reason to force the merge.

## Troubleshooting Checklist

- Was the `main` branch push a deliberate version bump in `package.json` or `package-lock.json`?
- Did every required CI check reach success within the 5-minute polling window before the merge?
- Did the required CI checks pass on the merge commit before the publish workflow started?
- Does the npm dist-tag match the version channel (for example `latest`, `beta`, `rc`, `next`)?
- Does the tag name match the package version format (for example `v0.0.13` or `v0.0.15-beta.1`)?
- Was the tag pushed locally only after `npm publish` succeeded?
- Did the tag-triggered GitHub Release workflow succeed?
- Did the tag/version consistency check pass?
