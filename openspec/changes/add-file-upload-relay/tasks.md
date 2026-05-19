## 1. Schema simplification preserves file_uploadable marker

- [x] 1.1 In `src/lib/composio/backend-client.ts::simplifySchemaNode`, propagate `file_uploadable: true` to the simplified node when the input record has `file_uploadable === true`. Apply the same propagation at every node depth (object properties, array items, union variants).
- [ ] 1.2 Add a unit-style smoke test in `scripts/test-file-uploadable-schema.mjs` (or inline within the existing schema-cache test if one exists): given the live `INSTAGRAM_POST_IG_USER_MEDIA` raw input_parameters, verify the simplified schema has `properties.image_file.file_uploadable === true` and `properties.video_file.file_uploadable === true`. Use a fixture committed under `test-fixtures/composio-instagram-raw-schema.json`.
- [ ] 1.3 No behavior change for tools without `file_uploadable` markers — confirmed by re-running the existing schema-cache test suite.

## 2. Backend client helpers for the upload contract

- [x] 2.1 Add `requestComposioFileUpload(env, params: { toolkitSlug, toolSlug, filename, mimetype, md5 })` that POSTs to `/files/upload/request` and returns `{ id, key, presignedUrl, type }`. Reuses `composioFetch` for auth + error classification.
- [x] 2.2 Add `putComposioFile(presignedUrl, mimetype, bytes: ArrayBuffer)` that issues a PUT with the matching `Content-Type` header and verifies the response is 2xx. Map non-2xx to `IntegrationRequestError` with `kind: "transient"` (presigned URLs occasionally 5xx) so the executor's transient-retry loop applies.
- [x] 2.3 Both helpers handle the `type: "existing"` response (md5 dedup hit) — when `type === "existing"`, skip the PUT and return the key directly.

## 3. File upload relay stage

- [x] 3.1 Create `src/lib/server/file-upload-relay.ts` with: `FileUploadAttachment` shape, `FileUploadablePointer` shape, `collectFileUploadablePaths(schema): string[]`, and `resolveFileUploadables({ toolSlug, toolkitSlug, args, files, env })`.
- [ ] 3.2 `collectFileUploadablePaths` walks a simplified JSON schema and returns dot-path strings for every property where `file_uploadable === true`. Handle nested objects (`children.file`) and arrays (`children[].file`). Use a fixture-driven test for `INSTAGRAM_POST_IG_USER_MEDIA` returning `["image_file", "video_file"]`.
- [x] 3.3 `resolveFileUploadables` walks the args at each collected path. For each FileUploadable found:
  - If `args.<path>` is `null`/`undefined`, skip silently.
  - If the FileUploadable's `s3key` matches an Apollo key shape (`/^\d+\/[A-Z0-9_]+\/[A-Z0-9_]+\/(request|response)\/[A-Za-z0-9_-]+$/`), pass through unchanged — the agent already provided a real Apollo key.
  - Otherwise, find a matching pointer in `files` via `files[].pointer === args.<path>.s3key`. If no match, return a `type: "validation"` error with `code: "missing_file_bytes"` and a hint instructing the agent that this field requires either a public URL alternative (e.g. `image_url`) or that the user re-attach the file via OpenClaw.
  - Found a match: call `requestComposioFileUpload`, decode `dataBase64` to ArrayBuffer, call `putComposioFile`. Replace `args.<path>.s3key` with the returned key. Preserve `name` and `mimetype` from the original FileUploadable.
- [x] 3.4 Enforce a 25 MB raw-byte cap on each attachment. If exceeded, return `type: "validation"`, `code: "file_too_large"` with the actual size and the cap in the message.
- [x] 3.5 Return `{ rewrittenArgs, uploadedFiles: { schemaPath, apolloKey, md5, sizeBytes }[] }` on success.

## 4. Executor wiring

- [x] 4.1 Extend `ExecuteToolRequest` in `src/lib/server/executor.ts` with `files?: FileUploadAttachment[]`.
- [x] 4.2 Insert the new stage between `validateFieldArgs` and the `runToolWithRetries` block. Only invoke when (a) `decision.tool.execution.kind === "composio_tool"`, (b) `decision.tool.schemaHydrated === true`, AND (c) `collectFileUploadablePaths(decision.tool.inputSchema).length > 0`.
- [x] 4.3 On `resolveFileUploadables` error, build a `ToolExecutionPayload` with the error shape directly (matching the existing `placeholder_argument` and `invalid_field_value` patterns) and call `logExecutionResult` before returning.
- [x] 4.4 On success, replace `mergedArgs` with `rewrittenArgs` for the rest of the execute path and store `uploadedFiles` metadata on the eventual log payload (new optional column or stuff into `requestJson` for now — no migration).
- [x] 4.5 The new stage runs at most once per request; auth-failure retry path keeps the rewritten args (don't re-upload on retry).

## 5. API route accepts the files envelope

- [x] 5.1 In `src/app/api/tools/[tool]/execute/route.ts`, parse `files` from the JSON body. Validate it is an array of `{ pointer: string, name: string, mimetype: string, md5: string, dataBase64: string }`. Reject any malformed entry with a 400.
- [x] 5.2 Enforce a per-request total cap of 100 MB across all attachments (sum of base64 lengths × 0.75) to protect the worker.
- [x] 5.3 Thread the parsed `files` into `executeToolForUser`.
- [x] 5.4 Same change for `src/app/api/tools/[tool]/preview/route.ts` — preview mode SHALL skip the relay stage entirely (no upload happens for previews) but SHALL accept the `files` field without erroring.

## 6. Plugin: detect FileUploadable and attach bytes

- [x] 6.1 In `packages/openclaw-clawlink/index.js`, add `isFileUploadableShape(value)` that returns true when `value` is a plain object with non-empty string `name`, `mimetype`, and `s3key`.
- [x] 6.2 Add `walkAndCollectFileUploadables(args)` that returns `[{ path, value }]` for every FileUploadable shape found anywhere in the args tree. Handles arrays.
- [x] 6.3 Add `OPENCLAW_MEDIA_ROOT_PREFIXES` const list: `["/data/.openclaw/media/", "/.openclaw/media/", "/openclaw/media/"]` and a helper `isPermittedMediaPath(s3key)` that resolves the path and rejects anything outside those prefixes (and rejects path components containing `..`).
- [x] 6.4 `readFileForUpload(s3key)` reads the file with `fs.readFileSync`, computes md5 with Node's `crypto.createHash("md5")`, base64-encodes, returns `{ name, mimetype, dataBase64, md5, sizeBytes }`. Enforces the 25 MB raw-byte cap; throws a structured `ClawLinkPluginError` if exceeded.
- [x] 6.5 Modify the `clawlink_call_tool` execute function to: walk args for FileUploadables → for each, validate path + read bytes → if any fail validation, return a textResult with the same error shape ClawLink uses for validation errors (so the agent gets a useful retry signal without round-tripping to ClawLink) → otherwise attach `files: [...]` alongside `arguments` in the request body.
- [x] 6.6 Same wiring for `clawlink_preview_tool` (no upload happens server-side, but the field is accepted).
- [x] 6.7 Bump version: `packages/openclaw-clawlink/package.json` to `0.2.0`, `packages/openclaw-clawlink/openclaw.plugin.json` to `0.2.0`, `public/skill.md` frontmatter `version: 0.2.0`, `USER_AGENT` const to `@useclawlink/openclaw-plugin/0.2.0`.
- [x] 6.8 Update the `User-Agent` assertion in `packages/openclaw-clawlink/index.test.mjs` to match `0.2.0`.
- [x] 6.9 Add plugin-side smoke tests for: (a) FileUploadable detection on nested args, (b) path-traversal rejection (`s3key: "/etc/passwd"`), (c) size cap rejection, (d) clean attach-and-forward path with a small fixture file.

## 7. Plugin contract test

- [x] 7.1 Update `npm run test:openclaw-plugin-contract` to assert the new wire-protocol field. Specifically: when `clawlink_call_tool` is invoked with `arguments` that contain a FileUploadable shape, the body sent to `/api/tools/<tool>/execute` MUST include a `files` array whose entries match each detected FileUploadable's `s3key`.
- [x] 7.2 Document the contract in `packages/openclaw-clawlink/README.md` under a "File arguments" section.

## 8. End-to-end testing before publish

- [ ] 8.1 Local dev run with `npm run dev:web` (or whatever the project's local web dev command is — confirm before running). Verify the tool-execute route accepts `files` and successfully relays.
- [x] 8.2 Manual MVP smoke against `INSTAGRAM_POST_IG_USER_MEDIA` using the user's existing Instagram connection: post the `new_product.jpg` file from the failing-trace report. Expected: tool succeeds, returns a `creation_id`. Then chain to `INSTAGRAM_POST_IG_USER_MEDIA_PUBLISH` to confirm end-to-end.
- [ ] 8.3 Negative cases (verified locally before publish):
  - File too large (~30 MB) → `code: "file_too_large"`, no upload attempted.
  - Path traversal (`s3key: "/etc/passwd"`) → plugin-side refusal, never reaches ClawLink.
  - Missing bytes (plugin sends args without the `files` envelope despite a `file_uploadable` field) → `code: "missing_file_bytes"`, hint mentions `image_url` alternative.
  - Already-Apollo s3key (agent passed `<int>/instagram/INSTAGRAM_POST_IG_USER_MEDIA/response/<id>`) → relay passes through, no upload-request call issued.
- [x] 8.4 Re-run `npm run test:openclaw-plugin-contract` after the version bump and assertion update — must pass.

## 9. Validation and deploy

- [x] 9.1 `npx tsc --noEmit` exits 0 across all changes.
- [ ] 9.2 `npx eslint` clean on touched files.
- [x] 9.3 `npm run build:web` succeeds.
- [x] 9.4 Server-side: `npm run deploy:web` (operator confirms before production deploy).
- [ ] 9.5 Plugin side: bump versions per task 6.7, commit, push to `main`, then `git tag openclaw-plugin-v0.2.0 && git push origin openclaw-plugin-v0.2.0`. CI publishes to npm + ClawHub automatically per `AGENTS.md` release workflow.
- [ ] 9.6 Post-deploy verification: confirm `npx clawhub package inspect clawlink-plugin --json` and `npm view @useclawlink/openclaw-plugin@0.2.0` both show the new version live.

## 10. Post-deploy monitoring (follow-up)

- [ ] 10.1 Watch D1 `tool_executions` for 7 days for: tools whose name pattern matches `*_post_*_media`, `*_send_email`, `*_create_attachment`, `*_upload_*`. Expect zero `Failed to download file with s3key` errors after the rollout date for users on plugin 0.2.0+.
- [ ] 10.2 If log mining shows the same md5 uploaded multiple times within a 30-minute window from the same connection, re-open the R2-staging trade-off in the design doc and consider implementing it.
