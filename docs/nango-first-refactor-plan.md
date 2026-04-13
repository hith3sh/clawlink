# Nango-first refactor plan

## Goal

Make ClawLink treat Nango as the single OAuth backend for supported providers. ClawLink should keep only:

- connection session creation
- Nango connect session bootstrap
- session/webhook reconciliation
- connection metadata persistence
- tool execution using Nango-backed credentials

ClawLink should stop owning provider-specific OAuth start/callback flows for Nango-managed integrations.

## Phase 1

- Fix Nango tag/session reconciliation bugs
- Make webhook completion use session ids consistently
- Make hosted connect page explicitly Nango-first
- Surface clear error when OAuth integration is marked available but Nango is not configured

## Phase 2

- [x] Remove legacy `/api/oauth/{gmail,notion,outlook}/start` routes
- [x] Remove legacy `/api/oauth/{gmail,notion,outlook}/callback` routes
- [x] Remove obsolete provider-specific OAuth helper implementations once unused
- [x] Simplify worker/server credential refresh logic so OAuth integrations are treated as Nango-managed at runtime

## Phase 3

- [~] Audit docs/README/runtime status for truthfulness
- [~] Mark Nango-supported integrations separately from manual/API-key integrations
- [x] Delete dead provider OAuth config/helpers that were only supporting legacy flows
- [x] Remove now-empty legacy OAuth helper files from the repo
- Add tests for:
  - webhook success completion
  - webhook failure handling
  - reconnect flow
  - session polling reconciliation
