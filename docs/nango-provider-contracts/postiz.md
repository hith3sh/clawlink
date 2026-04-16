# Postiz Nango Provider Contract

This document defines the contract between **ClawLink** and the future **ClawLink-maintained Nango provider** for Postiz.

The goal is to keep the boundary clean:

- **Nango owns auth lifecycle**
- **ClawLink owns product UX and tool execution**

## Status

ClawLink-side scaffolding is already implemented.

Expected integration slug in ClawLink:

- `postiz`

Expected Nango provider config key:

- `postiz`

## High-level flow

1. User clicks Connect Postiz in ClawLink.
2. ClawLink creates a Nango-backed connect session.
3. Hosted connect UI opens Nango for provider config key `postiz`.
4. User completes Postiz auth.
5. Nango stores access/refresh credentials.
6. ClawLink reconciles the completed connection from Nango.
7. ClawLink worker loads credentials through the Nango connection API when executing tools.

## Required Nango-side behavior

The Postiz provider implementation in `clawlink-nango` must support:

- provider config key registration as `postiz`
- successful OAuth authorization flow
- token exchange for access token
- refresh behavior if Postiz supports refresh tokens
- retrieval of the latest connection credentials from the Nango connection API
- stable connection metadata sufficient for labeling in ClawLink

## Required connection API shape from Nango

ClawLink already relies on Nango's connection retrieval flow and maps the returned payload into local runtime credentials.

At minimum, the resolved connection must yield an access token via one of the standard fields Nango exposes.

ClawLink expects the Nango connection payload to make these values available, directly or via the standard credential object:

- `access_token` or equivalent mapped access token
- optional `refresh_token`
- optional expiry / expiration timestamp
- optional raw metadata payload

## Required identifiers

### Provider config key

Must be exactly:

- `postiz`

This is what ClawLink maps via `NANGO_PROVIDER_CONFIG_KEYS`.

### Connection id

Nango must produce a stable per-connection identifier that ClawLink stores as:

- `nango_connection_id`

### Auth backend marker

ClawLink stores Postiz connections as:

- `auth_provider = nango`

## Metadata contract for labeling

ClawLink can label the saved Postiz connection better if Nango exposes usable metadata.

Preferred metadata fields, in descending usefulness:

- `workspace_name`
- `workspace_id`
- `account_id`
- `display_name`
- `email`

Current ClawLink labeling logic for Postiz prefers:

- account label: `workspaceName ?? displayName ?? accountId ?? "Postiz workspace"`
- connection label: `workspaceName ?? displayName ?? accountId ?? "Postiz account"`
- external account id: `workspaceId ?? accountId ?? null`

So the Nango provider should populate metadata in a way that makes at least one of those fields available after auth.

## Auth assumptions

This contract assumes Postiz is treated as an OAuth-managed provider inside Nango.

If Postiz turns out not to support a proper refresh flow, the provider must still:

- surface the access token through Nango
- preserve whatever expiration semantics Postiz uses
- let Nango return a meaningful reauth failure when the token is no longer valid

ClawLink already handles a Nango-driven reauth state by marking the local connection as needing reauthorization.

## Error and reauth expectations

If Nango cannot fetch or refresh the Postiz connection, it should return a standard error response from the connection endpoint.

ClawLink expects this to result in:

- connection marked `needs_reauth`
- user-facing message that Postiz needs to be reconnected through Nango

Good provider behavior includes:

- clear error messages for revoked credentials
- clear error messages for expired/invalid refresh token cases
- no silent fallback to stale credentials

## Proxy expectations

For the initial ClawLink integration, the worker currently calls Postiz directly using credentials retrieved from Nango.

Current Postiz API base URL assumption:

- `https://api.postiz.com/public/v1`

Useful base URLs for future Nango proxy support:

- API base URL: `https://api.postiz.com/public/v1`
- auth endpoints: provider implementation specific

## Minimum viable provider definition

The first working `postiz` provider in `clawlink-nango` should define at least:

- display name: `Postiz`
- auth mode: whichever Postiz officially supports for third-party app auth
- authorization URL
- token URL
- grant type parameters
- refresh parameters if supported
- base API URL for authenticated requests
- verification endpoint for confirming a valid connection if available

## Validation checklist

Before calling the provider done, verify all of these:

1. Nango can create a Postiz integration with provider config key `postiz`
2. Nango connect UI can complete the Postiz auth flow
3. Nango connection retrieval returns an access token
4. ClawLink stores the Nango connection under the `postiz` integration
5. `postiz_list_integrations` succeeds from ClawLink worker runtime
6. invalid credentials trigger a clean reauth path

## Non-goals for ClawLink

ClawLink should **not** do any of the following for Postiz if it is Nango-managed:

- implement direct OAuth code exchange
- store or rotate refresh tokens itself
- maintain bespoke token refresh jobs
- invent a second auth path parallel to Nango

## Next implementation home

The actual provider work belongs in:

- `hith3sh/clawlink-nango`

Likely file areas based on upstream Nango layout:

- `packages/providers/providers.yaml`
- related validation scripts and provider docs

## Operational note

This contract is intentionally strict about the `postiz` provider key. If the Nango-side key differs, ClawLink runtime configuration must change too. Prefer keeping the provider key as `postiz` to avoid unnecessary mapping drift.
