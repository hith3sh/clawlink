# Nango Fork Plan for ClawLink

This document lays out how ClawLink should manage custom OAuth/API providers in Nango without mixing Nango server internals into the main ClawLink app repo.

## Decision

Use **two repos**:

1. **`clawlink`** (this repo)
   - Product UI
   - Hosted connect/session flow
   - Integration catalog
   - Worker tools/handlers
   - Credential bridge that treats OAuth providers as Nango-managed
   - Docs for the provider contract

2. **`clawlink-nango`** (new repo)
   - Fork or mirror of Nango with ClawLink-specific custom providers
   - Custom provider definitions for unsupported services like Postiz
   - Docker build/publish pipeline for the customized Nango server image
   - Optional deployment manifests if we want to keep Nango infra alongside the fork

## Why keep them separate

Keeping the Nango customization separate avoids:

- pulling auth-server internals into the ClawLink application repo
- coupling ClawLink deploys to Nango server rebuilds
- making upstream Nango upgrades harder to reason about
- bloating this repo with vendored server code

The ClawLink repo should consume Nango as infrastructure, not contain Nango itself.

## Recommended repo layout

### Current repo: `clawlink`

Keep these responsibilities here:

```text
clawlink/
  docs/
    nango-self-hosting.md
    nango-fork-plan.md
    nango-provider-contracts/
      postiz.md
  infra/
    nango/
      docker-compose.yml
      .env.example
  src/
    app/api/connect/
    lib/nango/
    lib/server/nango.ts
    data/integrations.ts
  worker/
    credentials.ts
    integrations/
      postiz.ts
```

Notes:
- `infra/nango/` in this repo is only the **deployment scaffold / consumer side**.
- It should point at a published custom image tag, not own the Nango source tree.

### New repo: `clawlink-nango`

Recommended structure:

```text
clawlink-nango/
  README.md
  Dockerfile
  docker-compose.dev.yml
  .github/
    workflows/
      docker-publish.yml
      sync-upstream.yml
  upstream/
    # optional: notes/scripts for syncing from upstream Nango
  patches/
    # optional: patch files if we keep a shallow customization model
  providers/
    postiz/
      README.md
      contract.md
      fixtures/
  scripts/
    sync-upstream.sh
    validate-provider.sh
  docs/
    architecture.md
    release.md
```

## Repo model options

There are three realistic ways to maintain the Nango customization.

### Option A — full fork repo

- Create `clawlink-nango` as a GitHub fork of the Nango repo.
- Add custom provider code directly in the fork.
- Build and publish an image from that fork.

**Pros**
- Most straightforward mental model
- Easy to diff against upstream
- Simple CI story

**Cons**
- Heavier repo
- Upstream syncs need care

### Option B — mirror + patch layer

- Keep a repo that checks out upstream Nango at a pinned revision.
- Apply a small set of ClawLink patches during build.

**Pros**
- Smaller long-term customization surface
- Forces discipline

**Cons**
- More moving parts in CI/build
- Harder to debug if patches drift

### Option C — vendored source inside ClawLink

Do **not** do this unless forced.

**Why not**
- mixes app and infrastructure concerns
- makes deploy/release boundaries blurry
- encourages shortcuts that become maintenance debt

## Recommendation

Start with **Option A: a separate GitHub fork repo**, then move toward a thinner patch model later only if needed.

That gives us the cleanest path to shipping the first custom providers quickly.

## Docker image strategy

We should publish our own image because upstream hosted images will not contain our custom providers.

Recommended image naming:

- `ghcr.io/hith3sh/clawlink-nango:<tag>`

Suggested tags:

- `postiz-v1`
- `2026-04-16-postiz`
- `sha-<gitsha>`
- `main`

For production, pin a non-floating tag in deploy config.

## ClawLink infra changes

Once the custom image exists, update `infra/nango/.env` in the ClawLink deployment environment to use a custom image tag.

Current env example:

```env
NANGO_IMAGE_TAG=hosted
```

Recommended future shape:

```env
NANGO_IMAGE_REGISTRY=ghcr.io/hith3sh/clawlink-nango
NANGO_IMAGE_TAG=postiz-v1
```

Then update the Docker Compose image reference to:

```yaml
image: ${NANGO_IMAGE_REGISTRY:-nangohq/nango-server}:${NANGO_IMAGE_TAG:-hosted}
```

That preserves the ability to fall back to upstream images for local testing while letting production pin the custom image.

## First provider target: Postiz

Postiz is the first custom-provider proving ground for the architecture.

### What the Nango fork must own

- OAuth provider definition / auth flow
- token exchange and refresh behavior
- provider config key registration (expected key: `postiz`)
- normalized connection metadata mapping where possible
- any provider-specific profile/account lookup needed after auth

### What ClawLink expects

ClawLink expects a completed Nango connection with:

- `provider_config_key = postiz`
- a stable Nango `connection_id`
- an access token retrievable through the Nango connection API
- optional refresh token and expiry managed by Nango internally
- enough metadata to label the connection cleanly in ClawLink

## Contract boundary

Keep this rule sharp:

- **Nango owns authentication lifecycle**
- **ClawLink owns product UX, connection sessions, tool execution, and user-facing integration behavior**

ClawLink should not reimplement token refresh/rotation logic for providers managed by Nango.

## Suggested documentation split

In `clawlink`:
- `docs/nango-self-hosting.md` → how to run Nango for ClawLink
- `docs/nango-fork-plan.md` → architecture and repo split
- `docs/nango-provider-contracts/postiz.md` → exact provider contract expected by ClawLink

In `clawlink-nango`:
- `docs/architecture.md` → how the fork stays close to upstream
- `providers/postiz/contract.md` → provider internals and field mapping
- `docs/release.md` → how to publish images and roll forward/back

## Rollout plan

### Phase 1 — completed or in progress
- ClawLink integration metadata for Postiz
- ClawLink worker handler scaffold for Postiz
- ClawLink Nango provider key mapping for `postiz`

### Phase 2 — next
- Create `clawlink-nango`
- Add custom Postiz provider
- Build and publish custom Docker image
- Point the deployed Nango stack at that image

### Phase 3
- Validate end-to-end auth connection from ClawLink hosted connect flow
- Test token refresh behavior through Nango APIs
- Verify connection labeling and reauth handling in ClawLink

### Phase 4
- Add more unsupported providers using the same pattern
- Keep ClawLink-side additions mostly limited to:
  - integration metadata
n  - worker handler/tool definitions
  - provider-specific UX if needed

## Minimal initial deliverables for the new repo

If we create `clawlink-nango` today, the minimum useful contents are:

```text
clawlink-nango/
  README.md
  Dockerfile
  .github/workflows/docker-publish.yml
  docs/architecture.md
  docs/release.md
  providers/postiz/README.md
```

That is enough to make the repo real and keep the next steps organized.

## Recommended next step

After this plan doc, the next artifact should be:

- `docs/nango-provider-contracts/postiz.md` in the ClawLink repo

That document should define the exact interface between the ClawLink integration and the future Nango fork implementation.
