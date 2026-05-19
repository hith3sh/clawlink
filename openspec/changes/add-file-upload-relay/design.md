## Context

ClawLink runs as a single Cloudflare Worker (`clawlink-web`) that exposes ~100 Composio-backed tools to OpenClaw plugin users. Tool execution flows:

1. OpenClaw plugin (`packages/openclaw-clawlink/index.js`) on the user's machine receives a `clawlink_call_tool` invocation with `tool` and `arguments` from OpenClaw's LLM.
2. Plugin POSTs to `/api/tools/<tool>/execute` with `{ arguments, connectionId?, confirmed }`.
3. Worker route handler reads the body, calls `executeToolForUser` in `src/lib/server/executor.ts`.
4. Executor: routes the request → loads credentials → validates args (`prepareToolArguments` → `detectPlaceholderArgs` → `validateFieldArgs`) → calls `executeComposioTool` → forwards to `POST https://backend.composio.dev/api/v3.1/tools/execute/<TOOL_SLUG>` with `{ connected_account_id, user_id, version, arguments }`.
5. Composio's Mercury runtime executes the tool. For FileUploadable inputs, Mercury calls its internal `_download_using_apollo` to materialize the file from its s3key before calling the upstream provider API.

Composio's tool catalog publishes raw schemas via `GET /api/v3.1/tools?toolkit_slug=<slug>`. For tools that accept files, the schema marks each affected property with `file_uploadable: true` and declares the property shape as a `FileUploadable` object with required `name`, `mimetype`, `s3key`. The schema field's `s3key` description states: *"The S3 key of a publicly accessible file, typically returned from a previous download action that stored the file in S3. This key references an existing file that can be uploaded to another service."*

Composio also publishes `POST /api/v3.1/files/upload/request`, which accepts `{ toolkit_slug, tool_slug, filename, mimetype, md5 }` and returns `{ id, key, new_presigned_url, type: "new" | "existing", metadata }`. The presigned URL is an S3-compatible PUT URL with a 1-hour expiry and a fixed `Content-Type` query parameter; the upload happens with a single `PUT` of the raw bytes. The returned `key` has format `<project_id>/<TOOLKIT>/<TOOL>/request/<md5>`. Both `request/<md5>` and `response/<id>` keys are resolvable by Mercury's `_download_using_apollo`.

Pre-existing self-correction layers in the executor:

- `prepareToolArguments` validates against the (now-hydrated) JSON schema. Catches missing required fields and type mismatches.
- `detectPlaceholderArgs` rejects obvious placeholders (`<user_id>`, `YOUR_API_KEY`, etc.).
- `validateFieldArgs` applies per-tool field rules from `config/composio-tool-overrides.mjs`.
- Schema hydration in `src/lib/composio/manifest-registry.ts` populates each tool's `inputSchema` from Composio's `/tools` API.

The simplification in `src/lib/composio/backend-client.ts::simplifySchemaNode` currently preserves only `type`, `description`, `enum`, and `examples` per property. It strips `file_uploadable: true` because that key is not in the allowlist.

## Goals / Non-Goals

**Goals:**

- Make `*_file` arguments work end-to-end on every Composio tool whose schema declares `file_uploadable: true`. Empirical worked example: `INSTAGRAM_POST_IG_USER_MEDIA.image_file` and `.video_file`.
- One executor stage covers every uploadable field in the catalog. No per-tool special-casing.
- Bytes flow plugin → ClawLink worker → Composio presigned URL with no intermediate ClawLink-side persistence. Lower cost, simpler, no cleanup job, no public bucket.
- Failure modes produce clean `type: "validation"` or `type: "provider"` errors with hints the LLM can self-correct from.
- Plugin change is small and invisible to authors of new tools — the relay is schema-driven.
- No new infrastructure (no R2 bucket, no D1 migration, no env var).

**Non-Goals:**

- R2 staging or per-file TTL caching. Punted to a follow-up if log mining shows the same file uploaded repeatedly within minutes.
- Public-URL convenience (rewriting `image_url`/`video_url` from local file references). Those already work via direct URL pass-through.
- Cross-tool file caching by content hash. Composio's upload API already deduplicates on md5 (`type: "existing"` response), which is sufficient.
- Multi-part / chunked uploads for files larger than 25 MB. Punted until a customer hits the limit.
- Streaming uploads from the worker without buffering. Cloudflare Workers can pass through ReadableStreams to outbound fetches, but the plugin → worker hop is JSON, so the bytes are buffered as base64 in the worker anyway. Optimizing the worker → Composio hop alone doesn't move the needle for files under 25 MB.

## Decisions

### 1. Bytes inline in the tool-call payload (option A from the design exploration)

The plugin attaches a top-level `files: FileUploadAttachment[]` field on the `/api/tools/<tool>/execute` request body. Each entry has shape `{ pointer: string, name: string, mimetype: string, md5: string, dataBase64: string }`, where `pointer` matches the FileUploadable's `s3key` value as the agent provided it (e.g. the OpenClaw local path). The executor matches pointers to schema paths by walking the args at every `file_uploadable: true` path and looking for a `files[].pointer` equal to the value's `s3key`.

Alternatives considered:

- **(B) Pre-upload to ClawLink with a `clawlink://` handle.** Cleaner separation between attach-time and call-time, but requires plugin lifecycle hooks (`on_attach` events) we don't have today, plus a ClawLink-side staging surface. Adds two new plugin SDK integration points and an R2 bucket. Higher implementation cost; deferred until v2 if we discover a use case where a single attached file is reused across multiple tool calls in a session.
- **(C) Plugin advertises a local HTTP endpoint, ClawLink fetches.** Breaks behind NAT, breaks for headless plugin runtimes, breaks ClawLink's hosted-runtime story. Not viable.

For v1, base64 in JSON caps practical payload at ~25 MB (Workers request body limit is 100 MB but base64 inflates by 33%, plus we want headroom for arguments and other fields). Instagram's image limit is 8 MB; Slack's is 1 GB but typical attachments are <10 MB; Gmail attachments are capped at 25 MB. The 25 MB ceiling covers the empirical 99th percentile.

### 2. Schema-driven detection (preserve `file_uploadable` through simplification)

`simplifySchemaNode` adds `file_uploadable` to its output allowlist when the input record has `file_uploadable === true`. The executor's new `collectFileUploadablePaths(schema)` walks the simplified schema and returns the dot-paths of every `file_uploadable: true` property (e.g. `["image_file", "video_file", "children[].file"]`).

Alternative considered:

- **Hardcode the path list per tool slug.** Rejected — couples the relay to manifest churn. Composio adds new file-uploadable tools every month; the relay should adopt them without code changes.

The walker handles array shapes (`{type: "array", items: { file_uploadable: true }}`) and nested objects. `anyOf`/`oneOf` are not currently traversed because (a) `simplifySchemaNode` collapses unions to a representative branch and (b) no FileUploadable in the catalog appears under a union as of 2026-05-19. If that changes, the walker extends to descend into all branches.

### 3. Pointer-based matching, not positional

The plugin attaches `pointer: <s3key value the agent provided>`. The executor matches by string equality between the args-walked FileUploadable's `s3key` field and `files[i].pointer`. This is robust to:

- Multi-file tools (Instagram carousels with one file per child slot).
- Argument reordering by the LLM between preview and execute.
- Optional FileUploadables where the agent provides only some.

Alternative considered:

- **Match by `name`.** Rejected — `name` is not unique (two attachments could both be `image.jpg`), and the agent is allowed to rename `name` independent of the underlying file.
- **Match by md5.** Rejected — md5 is computed at upload time, not visible in the args. Forces the executor to re-hash every byte on the worker just to do the match.

### 4. Executor stage placement: after `validateFieldArgs`, before the Composio call

The new `resolveFileUploadables` stage runs after all argument validation completes successfully. Order rationale:

- Running before validation would waste Composio upload-request calls on requests that fail schema validation anyway.
- Running after validation means a missing-required-FileUploadable case has already been caught by `prepareToolArguments` (the schema marks `s3key` as required inside the FileUploadable).
- Running before credential load would double-roundtrip on auth failures.

The stage produces either `{ rewrittenArgs, uploadedFiles: { schemaPath, apolloKey, md5, sizeBytes }[] }` or a `ResolveFileUploadablesError` that the executor maps to the standard `ToolExecutionPayload` failure shape. The successful uploads are logged to the existing tool-execution log under a new `uploadedFiles` JSON field for observability.

### 5. No ClawLink-side persistence (no R2 staging) for v1

Bytes flow:

```
plugin (local fs)
  → POST /api/tools/<tool>/execute  { arguments, files: [{ pointer, name, mimetype, md5, dataBase64 }] }
  → worker decodes base64 to ArrayBuffer
  → POST https://backend.composio.dev/api/v3.1/files/upload/request → presigned URL
  → PUT <presigned URL> bytes
  → rewritten args.image_file.s3key = response.key
  → POST https://backend.composio.dev/api/v3.1/tools/execute/<TOOL_SLUG> { arguments: rewritten }
```

No R2 binding. No worker-side storage. Composio's upload API already does md5-keyed dedup (`type: "existing"` skips the PUT step), which gives us cross-call caching for free without managing TTLs ourselves.

Alternatives considered:

- **R2 staging with 24h TTL.** Discussed and rejected for v1. Adds a bucket binding, lifecycle rules, and a re-upload step from R2 → Composio for every call (because Composio still needs the bytes in its own bucket). Pure overhead until log mining proves the same file is sent repeatedly within minutes.
- **Skip the worker buffer entirely with `fetch.duplex: "half"`.** Worker runtime supports it for outbound but the plugin → worker leg is JSON, so we already have the full base64 in memory. The Composio leg can use `Body: ArrayBuffer` directly without further buffering.

### 6. Plugin path-safety guard

The plugin reads `s3key` directly from the agent's tool argument before sending bytes. To prevent path traversal or arbitrary file reads, the plugin SHALL only read files whose absolute path starts with one of OpenClaw's known attachment roots. Empirically those are `/data/.openclaw/media/`, `~/.openclaw/media/`, and the workspace's `<workspace>/.openclaw/media/`. The plugin SHALL refuse to send bytes for any path outside this allowlist, returning the FileUploadable to the agent for relay-by-public-URL instead.

The same s3key value is forwarded to ClawLink as the pointer, so even if a malicious plugin upstream bypassed the path check, the worker would still upload the bytes the plugin sent (not the bytes at the s3key path) — there is no privileged file-read happening in the worker.

### 7. Plugin version bump strategy

This change adds a new field (`files`) to the tool-execute request body. Old plugins continue to work — the executor's relay stage is a no-op when `files` is absent or empty. New plugins succeed on file-attaching tools that old plugins fail on. That's a backward-compatible additive change at the wire-protocol level, but it's a user-visible new capability, so a minor bump (0.1.42 → 0.2.0) is appropriate.

CI publishes the new plugin version to both npm (`@useclawlink/openclaw-plugin@0.2.0`) and ClawHub (`clawlink-plugin@0.2.0`) on tag push (`openclaw-plugin-v0.2.0`), per the existing release workflow in `AGENTS.md`.

## Risks / Trade-offs

- **[Risk] Base64 inflation hits the worker request body limit on large files.** → Mitigation: plugin enforces a 25 MB raw-byte cap (33 MB base64) before sending. Composio's individual tool limits (Instagram 8 MB images, Gmail 25 MB attachments) are tighter, so any payload that fits the upstream provider fits our cap.
- **[Risk] Composio's `/files/upload/request` outage stalls every file-using tool.** → Mitigation: the upload-request call is wrapped in the same `composioFetch` that handles retries and error classification. A 5xx from Composio becomes `type: "provider"`, `retryable: true`, which the executor's existing `MAX_TRANSIENT_RETRIES` loop already handles.
- **[Risk] LLM doesn't know it must include a FileUploadable shape and instead passes a bare string.** → Mitigation: the existing `prepareToolArguments` already catches `image_file` declared as `type: "object"` receiving a string. The relay stage doesn't need new validation — schema validation runs first.
- **[Risk] Plugin sends bytes that don't match the agent's stated mimetype (e.g. agent says `image/jpeg`, file is actually `image/png`).** → Mitigation: low-risk because Composio's upload API doesn't sniff the bytes, and Instagram's downstream API will reject mismatched media. Existing upstream-error classification surfaces this clearly.
- **[Risk] Md5 collision corrupts dedup.** → Mitigation: md5 collisions are vanishingly improbable for file-sized inputs; this is Composio's own dedup mechanism (`type: "existing"` response), and we trust it the same way Composio's other clients do.
- **[Trade-off] No streaming on the plugin → worker leg.** Acceptable for v1. The 25 MB cap means the worker holds a single buffer; Cloudflare's per-request memory limit is 128 MB, comfortably above this.
- **[Trade-off] No path-aware policy ("this user can only upload from these directories").** The relay is per-tool-call; there's no user-level upload quota or directory ACL. If we discover abuse patterns we add them later.

## Migration Plan

This change is additive at the wire-protocol level and the spec level. No state migration. Rollout:

1. Land server-side first: simplifySchemaNode preserves `file_uploadable`, executor stage, backend-client helpers. Old plugins (no `files` field) see no behavior change.
2. Bump plugin to 0.2.0, publish via tag push. New plugins start sending `files` for any FileUploadable arguments. Server-side relay activates.
3. Users on old plugins continue hitting the existing 404-from-Mercury error on file-attaching tools. Dashboard can surface a "update your OpenClaw plugin to use file uploads" hint when we detect a tool-execute request that returned the Mercury 404 against a file_uploadable schema.

No D1 schema changes. No revert-blocking work — disabling the relay is a single-commit revert of the executor stage; bytes simply pass through unchanged again (failing the same way they fail today).
