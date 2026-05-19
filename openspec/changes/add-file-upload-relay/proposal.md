## Why

Composio-backed tools whose schemas declare `file_uploadable: true` properties (Instagram media, Slack/Discord file shares, Gmail/Outlook attachments, Google Drive uploads, Dropbox uploads, etc.) currently fail at runtime when an OpenClaw agent attaches a local file. The agent's LLM correctly fills the FileUploadable shape (`{ name, mimetype, s3key }`) from OpenClaw's attached-file metadata, but `s3key` carries an OpenClaw local path like `/data/.openclaw/media/inbound/file_3---<uuid>.jpg`. ClawLink's executor forwards this unchanged to Composio, where Mercury's `_download_using_apollo` tries to resolve the s3key against Composio's own object store, fails with `storage returned HTTP 404`, and aborts the tool execution.

Empirical evidence (2026-05-19, Instagram MVP testing):

```
INSTAGRAM_POST_IG_USER_MEDIA, args:
  image_file: { mimetype: "image/jpeg", s3key: "/data/.openclaw/media/inbound/file_3---24566d62-0f52-4d3d-8afb-def87fc99950.jpg", name: "new_product.jpg" }
  ig_user_id: "25801449626198230"
  caption: "..."

→ "Failed to download file with s3key '/data/.openclaw/media/inbound/file_3---24566d62-0f52-4d3d-8afb-def87fc99950.jpg': storage returned HTTP 404."
```

The fix is a relay: when the OpenClaw plugin sees a tool argument shaped like a FileUploadable, it reads the local file bytes and ships them alongside the tool-execute payload. The executor then uses Composio's `POST /api/v3.1/files/upload/request` endpoint to obtain a presigned S3 URL, PUTs the bytes, and rewrites the FileUploadable's `s3key` with the returned Apollo key (format `<project_id>/<TOOLKIT>/<TOOL>/request/<md5>`) before forwarding the tool call. Mercury's `_download_using_apollo` resolves the rewritten key cleanly because the file now lives in Composio's own bucket.

This unblocks every `*_file` field across the catalog with one change. Public-URL alternatives (`image_url`, `video_url`) still work as they do today; the relay only handles the `*_file` branch.

## What Changes

- Plugin (`packages/openclaw-clawlink/index.js`): detect FileUploadable shapes in tool arguments before forwarding. For each detected file, validate the s3key is under OpenClaw's allowed media directory, read the file bytes, compute md5, and attach `{ pointer, name, mimetype, md5, dataBase64 }` to a new top-level `files` array on the `/api/tools/<tool>/execute` request body.
- Schema simplification (`src/lib/composio/backend-client.ts`): preserve the `file_uploadable: true` marker through `simplifySchemaNode` so the executor can find which fields need relay handling.
- Executor (`src/lib/server/executor.ts`): new stage `resolveFileUploadables` runs between `validateFieldArgs` and the upstream Composio call. It walks the hydrated schema for `file_uploadable: true` paths, looks up matching pointers in the `files` envelope, calls Composio's `/files/upload/request` per file, PUTs bytes to the returned presigned URL, and rewrites the FileUploadable value's `s3key` with the returned Apollo key.
- Composio backend client (`src/lib/composio/backend-client.ts`): new exported `requestComposioFileUpload(params)` and `putComposioFile(presignedUrl, mimetype, bytes)` helpers covering the upload-request and upload-bytes calls with consistent error classification.
- Failure-mode handling: file-too-big, mimetype mismatch, missing bytes for a required FileUploadable, presigned-PUT failure, and Composio upload-request 4xx all map to clean `type: "validation"` or `type: "provider"` errors with actionable hints.
- Plugin version bump (`0.1.42` → `0.2.0`) reflecting the new wire-protocol field on tool-execute requests; npm + ClawHub publish on tag.

## Capabilities

### New Capabilities

- `file-upload-relay`: ClawLink relays local file bytes attached by the OpenClaw plugin to Composio's file upload API, rewriting FileUploadable arguments with valid Apollo s3keys before forwarding the tool call. Schema-driven detection (`file_uploadable: true`) walks every uploadable path in the hydrated input schema. The relay deliberately does NOT stage files in ClawLink-side storage; bytes are streamed directly from the plugin payload into Composio's presigned URL.

### Modified Capabilities

- `composio-schema-cache`: schema simplification SHALL preserve the `file_uploadable: true` marker on each property so downstream consumers (the new file relay) can find uploadable paths without re-fetching the raw Composio schema. Adds one ADDED Requirement; does not change existing hydration or caching behavior.

## Impact

- New code:
  - `src/lib/server/file-upload-relay.ts` (`collectFileUploadablePaths(schema)`, `resolveFileUploadables(toolSlug, toolkitSlug, args, files, env)`, `FileUploadablePointer` shape).
  - `src/lib/composio/backend-client.ts` (`requestComposioFileUpload`, `putComposioFile` helpers).
- Modified code:
  - `src/lib/composio/backend-client.ts` `simplifySchemaNode` preserves `file_uploadable` boolean.
  - `src/lib/server/executor.ts`: new `resolveFileUploadables` stage between `validateFieldArgs` and the upstream call; `ExecuteToolRequest` accepts an optional `files: FileUploadAttachment[]` field.
  - `src/app/api/tools/[tool]/execute/route.ts`: parses `files` from the request body and threads it into `executeToolForUser`.
  - `packages/openclaw-clawlink/index.js`: `clawlink_call_tool` and `clawlink_preview_tool` execute functions detect FileUploadable shapes, read bytes, attach to the `files` field.
- Plugin version: `0.1.42` → `0.2.0` in `packages/openclaw-clawlink/package.json`, `packages/openclaw-clawlink/openclaw.plugin.json`, `public/skill.md`, and the `USER_AGENT` constant.
- New env vars: none. Reuses existing `COMPOSIO_API_KEY`.
- D1 migrations: none.
- New dependencies: none. (md5 via Node's `crypto` module; `Buffer` for base64.)
- Storage: no R2 binding required for v1. Bytes flow plugin → ClawLink worker → Composio presigned URL without intermediate persistence.
- Deploy: takes effect on the next `npm run deploy:web`. Plugin tag-push (`openclaw-plugin-v0.2.0`) publishes to npm + ClawHub via existing CI.
- Backward compatibility: requests from old plugin versions (no `files` field) work unchanged — the executor only invokes the relay when both (a) the schema has at least one `file_uploadable: true` path AND (b) the request payload includes a matching pointer. A pre-0.2.0 plugin call against `INSTAGRAM_POST_IG_USER_MEDIA` continues to fail with the existing 404 error; users on the new plugin succeed.
