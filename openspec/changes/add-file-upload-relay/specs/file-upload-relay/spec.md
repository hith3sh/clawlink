## ADDED Requirements

### Requirement: ClawLink relays file bytes attached by the plugin to Composio's upload API before forwarding tool calls

When a Composio tool's hydrated input schema declares one or more properties with `file_uploadable: true`, the executor SHALL run a relay stage that walks the agent's arguments at every uploadable path, looks up the matching file bytes in the request's `files` envelope, uploads each file to Composio's `POST /api/v3.1/files/upload/request` + presigned-URL PUT pair, and rewrites the FileUploadable's `s3key` value with the returned Apollo key (`<project_id>/<TOOLKIT>/<TOOL>/request/<md5>`) before forwarding the call to Composio's `/tools/execute/<TOOL_SLUG>`. The relay SHALL run after `validateFieldArgs` and before the upstream tool-execute call. The relay SHALL be a no-op when the schema has no `file_uploadable: true` paths or when the request payload contains no `files` envelope and no FileUploadable arguments require resolution.

#### Scenario: Relay rewrites s3key with the returned Apollo key
- **WHEN** an agent calls `INSTAGRAM_POST_IG_USER_MEDIA` with `image_file: { name: "x.jpg", mimetype: "image/jpeg", s3key: "/data/.openclaw/media/inbound/x.jpg" }` AND the request payload's `files` array contains an entry with `pointer: "/data/.openclaw/media/inbound/x.jpg"`
- **THEN** the executor SHALL call Composio's upload-request API with the file's md5, PUT the bytes to the returned presigned URL, and forward the tool execution with `image_file.s3key` rewritten to the returned Apollo key

#### Scenario: Pass-through when s3key is already an Apollo key
- **WHEN** an agent calls a file-uploadable tool with a FileUploadable whose `s3key` matches the regex `^\d+/[A-Z0-9_]+/[A-Z0-9_]+/(request|response)/[A-Za-z0-9_-]+$`
- **THEN** the relay SHALL pass the value through unchanged and SHALL NOT issue any Composio upload-request call

#### Scenario: Skip silently when uploadable field is absent from args
- **WHEN** a tool schema declares `image_file` and `video_file` as `file_uploadable: true` and an agent calls the tool with `image_file` but no `video_file`
- **THEN** the relay SHALL upload only the `image_file` bytes and SHALL NOT raise an error for the absent `video_file`

#### Scenario: Use Composio's md5 dedup when the same file is re-uploaded
- **WHEN** the relay calls `/files/upload/request` and Composio responds with `type: "existing"`
- **THEN** the relay SHALL skip the presigned-URL PUT step and use the returned `key` directly to rewrite the FileUploadable

### Requirement: Missing file bytes for a FileUploadable produce a self-correctable validation error

When the agent provides a FileUploadable whose `s3key` is NOT an Apollo key shape AND no entry in the request's `files` envelope has a `pointer` string-equal to that s3key, the relay SHALL refuse the call with `error.type === "validation"`, `error.code === "missing_file_bytes"`, populate `invalidFields` with the offending schema path, and produce a `hint` that names: (a) the field path, (b) any public-URL alternative declared on the same tool (e.g. `image_url` when the tool also declares `image_file`), and (c) an instruction for the user to re-attach the file in OpenClaw if the public-URL alternative is unavailable.

#### Scenario: Plugin omits the files envelope but agent sends a FileUploadable
- **WHEN** an agent calls `INSTAGRAM_POST_IG_USER_MEDIA` with `image_file: { name: "x.jpg", mimetype: "image/jpeg", s3key: "/data/.openclaw/media/inbound/x.jpg" }` AND the request body has no `files` field (e.g. an old plugin version)
- **THEN** the executor SHALL respond with `error.code === "missing_file_bytes"` and a hint mentioning that `image_url` is a workaround when the local file cannot be relayed

#### Scenario: Pointer mismatch between args and files envelope
- **WHEN** an agent calls `INSTAGRAM_POST_IG_USER_MEDIA` with `image_file.s3key === "/data/.openclaw/media/a.jpg"` and the request `files` array only contains `{ pointer: "/data/.openclaw/media/b.jpg", ... }`
- **THEN** the executor SHALL respond with `error.code === "missing_file_bytes"`, `invalidFields: ["arguments.image_file.s3key"]`

### Requirement: File-too-large rejection enforces a 25 MB cap per attachment

The relay SHALL enforce a hard 25 MB cap on each individual file attachment's raw byte length (computed from the base64 payload as `length × 0.75`). When an attachment exceeds the cap, the relay SHALL refuse the call with `error.type === "validation"`, `error.code === "file_too_large"`, an `error.message` stating the actual size and the cap, and a `hint` pointing the agent at the public-URL alternative when available.

#### Scenario: Reject 30 MB attachment
- **WHEN** an agent calls a file-uploadable tool with an attachment whose decoded byte length is greater than 26_214_400 (25 × 1024 × 1024)
- **THEN** the relay SHALL respond with `error.code === "file_too_large"` and SHALL NOT call Composio's upload-request API

#### Scenario: Total request body cap protects the worker
- **WHEN** a single tool-execute request carries multiple attachments whose combined raw byte length exceeds 100 MB
- **THEN** the API route SHALL reject the request with HTTP 413 before invoking the executor

### Requirement: Composio upload-request and PUT failures map to retryable provider errors

Composio's `/files/upload/request` 5xx responses, presigned-URL PUT 5xx responses, and network-level errors during either call SHALL be classified as `error.type === "provider"` with `retryable: true` so the executor's existing transient-retry loop applies. Composio's 4xx responses on the upload-request call SHALL be classified per the standard `composioFetch` rules (4xx → `validation` or `account_inactive` as appropriate).

#### Scenario: Upload-request 503 retries
- **WHEN** Composio's `/files/upload/request` returns HTTP 503 on the first attempt and HTTP 200 on the retry
- **THEN** the executor SHALL successfully complete the tool execution after the transient retry

#### Scenario: Presigned PUT 5xx retries
- **WHEN** the presigned-URL PUT returns HTTP 502 on the first attempt and HTTP 200 on the retry
- **THEN** the executor SHALL successfully complete the tool execution

#### Scenario: Upload-request 401 fails fast
- **WHEN** Composio's `/files/upload/request` returns HTTP 401
- **THEN** the executor SHALL return `error.type === "auth"` without retrying

### Requirement: Plugin attaches file bytes and md5 for every FileUploadable shape it forwards

The OpenClaw plugin SHALL detect FileUploadable shapes in the `arguments` of every `clawlink_call_tool` and `clawlink_preview_tool` invocation. A FileUploadable shape is any plain object containing non-empty string properties `name`, `mimetype`, AND `s3key`. For each detected FileUploadable, the plugin SHALL: (a) refuse to read the file when `s3key` does not start with one of OpenClaw's permitted media-root prefixes (`/data/.openclaw/media/`, `~/.openclaw/media/`, or a workspace `<workspace>/.openclaw/media/`) OR contains `..` path traversal segments, (b) read the file bytes from disk, (c) refuse to read when the raw byte length exceeds the 25 MB cap, (d) compute the md5 of the bytes, (e) base64-encode the bytes, and (f) attach an entry to a top-level `files` array on the request body of shape `{ pointer: <the s3key string the agent provided>, name, mimetype, md5, dataBase64 }`. The plugin SHALL emit a structured plugin-side error result (no round-trip to ClawLink) when (a), (c), or any read-time exception fires.

#### Scenario: Plugin attaches bytes for a permitted path
- **WHEN** OpenClaw invokes `clawlink_call_tool` with `arguments.image_file = { name, mimetype, s3key: "/data/.openclaw/media/inbound/x.jpg" }` AND the file exists, AND its size is below the cap
- **THEN** the plugin SHALL POST `/api/tools/<tool>/execute` with a `files` array containing one entry whose `pointer` equals `/data/.openclaw/media/inbound/x.jpg`

#### Scenario: Plugin refuses path traversal
- **WHEN** OpenClaw invokes `clawlink_call_tool` with `arguments.image_file.s3key === "/data/.openclaw/media/../../../etc/passwd"`
- **THEN** the plugin SHALL refuse to read the file and SHALL return a textResult error mentioning that the path is outside the permitted attachment roots, AND SHALL NOT POST to ClawLink

#### Scenario: Plugin refuses oversize files locally
- **WHEN** OpenClaw invokes `clawlink_call_tool` with a FileUploadable pointing at a 30 MB file under a permitted root
- **THEN** the plugin SHALL refuse to send and SHALL return a textResult error naming the file size and the cap, AND SHALL NOT POST to ClawLink

#### Scenario: Plugin handles tools with no FileUploadables unchanged
- **WHEN** OpenClaw invokes `clawlink_call_tool` for a tool whose arguments contain no FileUploadable shape
- **THEN** the plugin SHALL omit the `files` field entirely from the request body (preserving wire-protocol compatibility with older ClawLink server versions)

### Requirement: Tool-execute and tool-preview API routes accept the `files` envelope

The `POST /api/tools/<tool>/execute` and `POST /api/tools/<tool>/preview` routes SHALL accept an optional `files` field on the JSON request body of shape `Array<{ pointer: string, name: string, mimetype: string, md5: string, dataBase64: string }>`. The routes SHALL validate that each entry has all five string fields populated; malformed entries SHALL produce HTTP 400 with a clear validation message. The preview route SHALL accept the field but SHALL NOT trigger any Composio upload-request call (the relay stage runs only on the execute path).

#### Scenario: Execute route accepts well-formed files envelope
- **WHEN** a request to `/api/tools/instagram_post_ig_user_media/execute` includes a body with a valid `files` array
- **THEN** the route SHALL forward the parsed array to `executeToolForUser`

#### Scenario: Execute route rejects malformed files envelope
- **WHEN** a request to `/api/tools/<tool>/execute` includes `files: [{ pointer: "x", dataBase64: "y" }]` (missing required fields)
- **THEN** the route SHALL respond with HTTP 400 and a message naming the missing fields

#### Scenario: Preview route accepts files but skips relay
- **WHEN** a request to `/api/tools/<tool>/preview` includes a `files` array with one entry
- **THEN** the route SHALL accept the field, SHALL NOT call Composio's `/files/upload/request`, and SHALL return the standard preview payload
