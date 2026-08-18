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
- Automatically publish to npm when `dev` is merged to `main`.
- Create git tag and GitHub Release only after npm publish succeeds.
- Keep stable releases on npm `latest` and pre-releases on npm `next`.

## Release Policy (Main-First, Automated npm Publish)

- Do not push release version bumps directly to `dev`.
- Always use a dedicated release branch from `dev`.
   - Examples: `release/v0.0.15`, `release/v0.0.15-beta.1`
- Merge flow for every release:
   1. `release/*` -> `dev` (verify CI passes)
   2. `dev` -> `main` (verify CI passes)
   3. GitHub Actions automatically publishes to npm
   4. After npm publish succeeds, create git tag and GitHub Release locally
- **Important**: npm publish is automatic on `main` push. Do not create tags before npm publish succeeds.

## npm Distribution Tag Behavior

- Stable versions (for example `0.0.15`) are published with npm dist-tag `latest`.
- Pre-release versions (for example `0.0.15-beta.1`, `0.0.15-alpha.1`) are published with npm dist-tag `next` by default.
- You can override the pre-release dist-tag by setting repository variable `NPM_PRERELEASE_DIST_TAG`.
   - Example values: `next`, `beta`, `alpha`.
- Install pre-release builds with:

```bash
npm install algolia-uploader@next
```

## Current Standard Flow (Release Branch → dev → main with CI Verification)

1. Create a release branch from `dev`.
   - Example: `release/v0.0.13`
2. Bump version on the release branch only.
   - `npm version 0.0.13 --no-git-tag-version`
3. Open a PR from the release branch to `dev`.
4. **Wait for GitHub Actions CI to pass** on the release branch PR.
   - Check: https://github.com/htnabe/algolia-uploader/actions/workflows/test.yml
   - All jobs (`test`, `package-build`, `runtime-smoke`) must succeed
5. Merge PR to `dev` (verify CI passes on merge).
6. **Wait for GitHub Actions CI to pass** on `dev` after merge.
7. Open a PR from `dev` to `main`.
8. **Verify CI passes** on the `dev → main` PR before merging.
   - Do not merge if any test fails
9. Merge PR to `main`.
10. **Wait for GitHub Actions CI to pass** on `main` after merge.
11. Verify npm publish completed successfully (check npm registry for new version).
12. After npm publish succeeds, create git tag and GitHub Release locally:
    - `git tag -a v0.0.13 -m "v0.0.13"`
    - `git push origin v0.0.13`
    - `gh release create v0.0.13 --target main --title "v0.0.13" --generate-notes`

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

### 2) Open pull requests and verify CI passes before merge

```bash
# Create PR from release branch to dev
gh pr create --base dev --head release/v0.0.13 --title "chore(release): 0.0.13"

# WAIT for CI to pass on this PR
# Check: https://github.com/htnabe/algolia-uploader/actions/workflows/test.yml
# Do not proceed until all jobs pass

# After CI passes, merge to dev
gh pr merge --squash <RELEASE_PR_NUMBER>

# WAIT for CI to pass on dev after merge

# Create PR from dev to main
gh pr create --base main --head dev --title "chore(release): merge dev to main"

# WAIT for CI to pass on this PR before merging
# Do not merge if tests fail

# After CI passes, merge to main
gh pr merge --squash <DEV_MAIN_PR_NUMBER>

# WAIT for CI to pass on main after merge
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

## Troubleshooting: npm Publish Failure

If npm publish fails after merging to `main`:

1. **Do not create a git tag** for the failed version.
2. Fix the issues in a new commit on `main` (or revert and retry).
3. Bump version in `package.json` and `package-lock.json`.
4. Push the fix to `main` — npm publish will automatically retry.
5. After npm publish succeeds, create the git tag.

This approach prevents orphaned git tags that don't match released npm versions.

## v0.0.13 Execution Record (Reference)

- `release/v0.0.13 -> dev`: PR #139
- `dev -> main`: PR #140
- npm publish (automatic): success
- tag/release (local): `v0.0.13` created after npm publish

## Operational Notes

- `npm version patch` normally creates a tag automatically; use `--no-git-tag-version` on release branches.
- Do not use `gh pr merge --delete-branch` on `dev -> main` PRs.
  - It can unintentionally delete the `dev` branch.
- **Tag creation is now a local, manual step** — only create after verifying npm publish succeeded.
- Always create the release tag on the exact `main` commit from which npm publish ran.
- **CI must pass before merging** — npm publish should never run if tests fail.
- Check npm registry directly: `npm view algolia-uploader@<version>` or https://www.npmjs.com/package/algolia-uploader
- **CI must pass before any merge**: Never merge a release PR if GitHub Actions tests fail.
  - Failing CI indicates package or code issues that must be resolved first.
  - Failed CI on `main` invalidates the release flow
- **Verify all CI jobs pass**:
  - `test` job (vitest, typecheck)
  - `package-build` job (npm ci, npm run build)
  - `runtime-smoke` job (CLI execution test)
- **Tag and Release only after npm publish**: Create git tags and GitHub Releases only after confirming the new version is available on npm.
  - This prevents git/npm version mismatches
  - If npm publish fails, no orphaned tags remain

## Troubleshooting Checklist

- Is the GitHub Release published (not left as a draft)?
- Does the tag name match package version format (e.g., `v0.0.13` or `v0.0.15-beta.1`)?
- Did the `publish.yml` workflow start from the `release` event?
- Did the tag/version consistency check pass?
