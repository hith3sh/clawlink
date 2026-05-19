import "server-only";

import {
  putComposioFile,
  requestComposioFileUpload,
} from "@/lib/composio/backend-client";
import { IntegrationRequestError } from "../../../worker/integrations/base";

// ---------------------------------------------------------------------------
// Wire-protocol shapes
// ---------------------------------------------------------------------------

/**
 * One entry in the `files` envelope on a tool-execute request body.
 *
 * The plugin attaches one entry per FileUploadable it finds in the agent's
 * arguments. `pointer` matches the FileUploadable's `s3key` value as the
 * agent provided it (typically an OpenClaw local path like
 * `/data/.openclaw/media/inbound/<uuid>.jpg`); the executor matches pointers
 * to schema paths by walking the args at every `file_uploadable: true` path
 * and looking for a `files[].pointer === args.<path>.s3key`.
 */
export interface FileUploadAttachment {
  pointer: string;
  name: string;
  mimetype: string;
  md5: string;
  /** Raw bytes encoded as base64 (no data-URL prefix). */
  dataBase64: string;
}

export interface UploadedFileMetadata {
  schemaPath: string;
  apolloKey: string;
  md5: string;
  sizeBytes: number;
}

export interface ResolveFileUploadablesParams {
  toolSlug: string;
  toolkitSlug: string;
  args: Record<string, unknown>;
  files: FileUploadAttachment[];
  schema: Record<string, unknown>;
  env?: Record<string, unknown>;
}

export interface ResolveFileUploadablesResult {
  rewrittenArgs: Record<string, unknown>;
  uploadedFiles: UploadedFileMetadata[];
}

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

/** Max raw byte length per attachment. Base64 inflates by ~33%. */
const MAX_FILE_BYTES = 25 * 1024 * 1024;

/**
 * Apollo s3key shape: `<project_id>/<TOOLKIT>/<TOOL>/(request|response)/<id>`.
 *
 * Matches both `request/<md5>` (returned by the upload-request API) and
 * `response/<id>` (returned by Composio download tools). When an agent's
 * FileUploadable already carries an Apollo-shaped s3key, the relay passes
 * through unchanged — that flow is the upload-then-reuse pattern Composio's
 * own examples document.
 */
const APOLLO_S3KEY_PATTERN =
  /^\d+\/[A-Z0-9_]+\/[A-Z0-9_]+\/(request|response)\/[A-Za-z0-9_-]+$/;

// ---------------------------------------------------------------------------
// Schema walking
// ---------------------------------------------------------------------------

/**
 * Walk a simplified JSON schema and return the dot-paths of every property
 * marked `file_uploadable: true`. Array nodes use `[]` in their path
 * (e.g. `children[].file`). Returns an empty array when the schema has no
 * uploadable paths or when the schema is malformed.
 */
export function collectFileUploadablePaths(
  schema: unknown,
): string[] {
  const paths: string[] = [];

  function hasFileUploadableShape(record: Record<string, unknown>): boolean {
    if (!record.properties || typeof record.properties !== "object") return false;
    const properties = record.properties as Record<string, unknown>;
    return ["name", "mimetype", "s3key"].every((field) => {
      const property = properties[field];
      return property && typeof property === "object";
    });
  }

  function walk(node: unknown, prefix: string): void {
    if (!node || typeof node !== "object") return;

    const record = node as Record<string, unknown>;

    if ((record.file_uploadable === true || hasFileUploadableShape(record)) && prefix) {
      paths.push(prefix);
      // We do not descend into a node we have already flagged as
      // file_uploadable — the FileUploadable shape itself contains
      // `s3key`/`name`/`mimetype` as ordinary string properties, not nested
      // uploadables.
      return;
    }

    if (record.type === "array" || record.items !== undefined) {
      const childPrefix = prefix ? `${prefix}[]` : "[]";
      walk(record.items, childPrefix);
    }

    if (record.properties && typeof record.properties === "object") {
      for (const [key, value] of Object.entries(
        record.properties as Record<string, unknown>,
      )) {
        const childPrefix = prefix ? `${prefix}.${key}` : key;
        walk(value, childPrefix);
      }
    }
  }

  walk(schema, "");
  return paths;
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isApolloS3Key(value: unknown): boolean {
  return typeof value === "string" && APOLLO_S3KEY_PATTERN.test(value);
}

function isFileUploadable(value: unknown): value is {
  s3key: string;
  name?: string;
  mimetype?: string;
} {
  if (!isPlainObject(value)) return false;
  const { s3key } = value;
  return typeof s3key === "string" && s3key.length > 0;
}

function decodeBase64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i += 1) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

function approxByteLengthFromBase64(base64: string): number {
  // base64 length × 0.75, minus padding. Good enough for cap enforcement.
  const trimmed = base64.replace(/=+$/, "");
  return Math.floor((trimmed.length * 3) / 4);
}

// ---------------------------------------------------------------------------
// Args walking
// ---------------------------------------------------------------------------

interface FileUploadableMatch {
  schemaPath: string;
  /** Path components for the args tree (e.g. `["children", 0, "file"]`). */
  argPath: Array<string | number>;
  value: { s3key: string; name?: string; mimetype?: string };
}

/**
 * Resolve schema paths against the args tree, expanding `[]` segments to
 * concrete array indices. Returns one match per actual FileUploadable found
 * in the args. Skips paths whose value is null/undefined or not a
 * FileUploadable shape.
 */
function resolveArgPaths(
  args: Record<string, unknown>,
  schemaPaths: string[],
): FileUploadableMatch[] {
  const matches: FileUploadableMatch[] = [];

  for (const schemaPath of schemaPaths) {
    const segments = schemaPath.split(/(\.|\[\])/).filter((s) => s.length > 0);

    function traverse(
      current: unknown,
      argPath: Array<string | number>,
      remaining: string[],
    ): void {
      if (remaining.length === 0) {
        if (isFileUploadable(current)) {
          matches.push({
            schemaPath,
            argPath: [...argPath],
            value: current,
          });
        }
        return;
      }

      const [head, ...rest] = remaining;

      if (head === ".") {
        traverse(current, argPath, rest);
        return;
      }

      if (head === "[]") {
        if (!Array.isArray(current)) return;
        for (let i = 0; i < current.length; i += 1) {
          traverse(current[i], [...argPath, i], rest);
        }
        return;
      }

      if (!isPlainObject(current)) return;
      if (!(head in current)) return;
      traverse(current[head], [...argPath, head], rest);
    }

    traverse(args, [], segments);
  }

  return matches;
}

function setValueAtPath(
  root: Record<string, unknown>,
  path: Array<string | number>,
  value: unknown,
): void {
  if (path.length === 0) return;
  let current: unknown = root;
  for (let i = 0; i < path.length - 1; i += 1) {
    const segment = path[i];
    if (typeof segment === "number") {
      if (!Array.isArray(current)) return;
      current = current[segment];
    } else if (isPlainObject(current)) {
      current = current[segment];
    } else {
      return;
    }
  }
  const last = path[path.length - 1];
  if (typeof last === "number") {
    if (Array.isArray(current)) {
      (current as unknown[])[last] = value;
    }
  } else if (isPlainObject(current)) {
    (current as Record<string, unknown>)[last] = value;
  }
}

function deepCloneArgs<T>(value: T): T {
  // structuredClone is available in Cloudflare Workers and Node ≥17.
  // Falls back to JSON round-trip for environments without it.
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value)) as T;
}

function buildArgPathString(argPath: Array<string | number>): string {
  let result = "arguments";
  for (const segment of argPath) {
    if (typeof segment === "number") {
      result += `[${segment}]`;
    } else {
      result += `.${segment}`;
    }
  }
  return result;
}

// ---------------------------------------------------------------------------
// Public hint helpers
// ---------------------------------------------------------------------------

/**
 * Compute the public-URL alternative field name for a given FileUploadable
 * field name. Composio's convention is to suffix file-uploadable inputs with
 * `_file` and the public-URL alternative with `_url` — so `image_file` →
 * `image_url`, `video_file` → `video_url`. Returns null when the path
 * doesn't follow this convention or when the alternative isn't declared on
 * the schema.
 */
function suggestUrlAlternative(
  schemaPath: string,
  schema: Record<string, unknown>,
): string | null {
  const lastSegment = schemaPath.split(/[.[\]]+/).filter(Boolean).pop();
  if (!lastSegment || !lastSegment.endsWith("_file")) return null;
  const alternative = `${lastSegment.slice(0, -"_file".length)}_url`;

  const properties = (schema as { properties?: Record<string, unknown> }).properties;
  if (!properties || typeof properties !== "object") return alternative;

  return alternative in properties ? alternative : null;
}

// ---------------------------------------------------------------------------
// Resolver
// ---------------------------------------------------------------------------

/**
 * Walk the args at every `file_uploadable: true` schema path. For each
 * FileUploadable found:
 *
 * - If `s3key` is already an Apollo key, pass through unchanged.
 * - Otherwise, look up `files[].pointer === s3key`. If found, upload bytes
 *   to Composio and rewrite `s3key` with the returned Apollo key.
 * - If not found, throw `IntegrationRequestError` with kind=validation.
 *
 * Returns the rewritten args and metadata about every successful upload.
 *
 * The function is idempotent against retry: a second call with the same
 * args + files will detect the now-rewritten Apollo keys and pass through.
 * Callers SHOULD invoke this only once per request and reuse `rewrittenArgs`
 * for any retry path.
 */
export async function resolveFileUploadables(
  params: ResolveFileUploadablesParams,
): Promise<ResolveFileUploadablesResult> {
  const schemaPaths = collectFileUploadablePaths(params.schema);

  if (schemaPaths.length === 0) {
    return { rewrittenArgs: params.args, uploadedFiles: [] };
  }

  const matches = resolveArgPaths(params.args, schemaPaths);

  if (matches.length === 0) {
    return { rewrittenArgs: params.args, uploadedFiles: [] };
  }

  const rewrittenArgs = deepCloneArgs(params.args);
  const uploadedFiles: UploadedFileMetadata[] = [];

  for (const match of matches) {
    const argPathString = buildArgPathString([...match.argPath, "s3key"]);

    if (isApolloS3Key(match.value.s3key)) {
      // Agent provided a real Apollo key (e.g. carried over from a prior
      // download tool). Pass through unchanged.
      continue;
    }

    const attachment = params.files.find(
      (file) => file.pointer === match.value.s3key,
    );

    if (!attachment) {
      const urlAlternative = suggestUrlAlternative(
        match.schemaPath,
        params.schema,
      );
      const hintParts = [
        `The "${match.schemaPath}" field requires the OpenClaw plugin to attach the file's bytes,`,
        `but no matching file was found for s3key="${match.value.s3key}".`,
      ];
      if (urlAlternative) {
        hintParts.push(
          `As an immediate workaround, retry the call with "${urlAlternative}" set to a public HTTP(S) URL pointing at the same media instead of "${match.schemaPath}".`,
        );
      }
      hintParts.push(
        `Otherwise, ask the user to re-attach the file in OpenClaw and retry — the plugin will include the bytes automatically.`,
      );

      throw new IntegrationRequestError(
        `File bytes are missing for ${match.schemaPath}. The OpenClaw plugin did not attach the file referenced by s3key="${match.value.s3key}".`,
        {
          status: 400,
          kind: "validation",
          code: "missing_file_bytes",
          invalidFields: [argPathString],
          hint: hintParts.join(" "),
        },
      );
    }

    const sizeBytes = approxByteLengthFromBase64(attachment.dataBase64);

    if (sizeBytes > MAX_FILE_BYTES) {
      throw new IntegrationRequestError(
        `File at ${match.schemaPath} is ${sizeBytes} bytes, exceeding the ${MAX_FILE_BYTES}-byte cap (${(MAX_FILE_BYTES / (1024 * 1024)).toFixed(0)} MB).`,
        {
          status: 413,
          kind: "validation",
          code: "file_too_large",
          invalidFields: [argPathString],
          hint:
            suggestUrlAlternative(match.schemaPath, params.schema) !== null
              ? `Retry with a public HTTP(S) URL in "${suggestUrlAlternative(match.schemaPath, params.schema)}" instead of uploading "${match.schemaPath}".`
              : `Ask the user for a smaller file under ${(MAX_FILE_BYTES / (1024 * 1024)).toFixed(0)} MB and retry.`,
        },
      );
    }

    let bytes: ArrayBuffer;
    try {
      bytes = decodeBase64ToArrayBuffer(attachment.dataBase64);
    } catch {
      throw new IntegrationRequestError(
        `File at ${match.schemaPath} could not be decoded from base64.`,
        {
          status: 400,
          kind: "validation",
          code: "invalid_file_encoding",
          invalidFields: [argPathString],
          hint: `Ask the user to re-attach the file in OpenClaw and retry "${match.schemaPath}".`,
        },
      );
    }

    // Prefer the agent-supplied name and mimetype on the FileUploadable when
    // present; fall back to the plugin-supplied attachment metadata. Either
    // path produces the same upstream — the values were filled in by the same
    // plugin walk.
    const filename = match.value.name ?? attachment.name;
    const mimetype = match.value.mimetype ?? attachment.mimetype;

    if (
      typeof match.value.mimetype === "string" &&
      match.value.mimetype.length > 0 &&
      attachment.mimetype.length > 0 &&
      match.value.mimetype !== attachment.mimetype
    ) {
      throw new IntegrationRequestError(
        `File at ${match.schemaPath} has mimetype "${match.value.mimetype}" in arguments but "${attachment.mimetype}" in the attached file envelope.`,
        {
          status: 400,
          kind: "validation",
          code: "file_mimetype_mismatch",
          invalidFields: [buildArgPathString([...match.argPath, "mimetype"])],
          hint: `Retry with matching mimetype metadata for "${match.schemaPath}", or re-attach the file in OpenClaw so the plugin can rebuild the file envelope.`,
        },
      );
    }

    const upload = await requestComposioFileUpload({
      env: params.env,
      toolkitSlug: params.toolkitSlug,
      toolSlug: params.toolSlug,
      filename,
      mimetype,
      md5: attachment.md5,
    });

    if (upload.type === "new") {
      await putComposioFile(upload.presignedUrl, mimetype, bytes);
    }

    setValueAtPath(rewrittenArgs, [...match.argPath, "s3key"], upload.key);
    uploadedFiles.push({
      schemaPath: match.schemaPath,
      apolloKey: upload.key,
      md5: attachment.md5,
      sizeBytes,
    });
  }

  return { rewrittenArgs, uploadedFiles };
}
