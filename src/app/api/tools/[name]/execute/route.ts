import { NextResponse } from "next/server";

import { toCanonicalExecutionSummary } from "@/lib/clawlink-spec/compat";
import { resolveRequestActor } from "@/lib/server/request-auth";
import { executeToolForUser } from "@/lib/server/tooling";
import type { FileUploadAttachment } from "@/lib/server/file-upload-relay";

export const dynamic = "force-dynamic";

const MAX_TOTAL_FILE_BYTES = 100 * 1024 * 1024;

interface ExecuteToolRequestBody {
  arguments?: Record<string, unknown>;
  connectionId?: number | string;
  confirmed?: boolean;
  files?: unknown;
}

function normalizeArgs(payload: unknown): {
  args: Record<string, unknown>;
  connectionId?: number;
  confirmed?: boolean;
  files: FileUploadAttachment[];
  fileError?: { message: string; status: number };
} {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { args: {}, files: [] };
  }

  const body = payload as ExecuteToolRequestBody & Record<string, unknown>;
  const parsedFiles = parseFilesEnvelope(body.files);
  if (parsedFiles.error) {
    return {
      args: {},
      files: [],
      fileError: parsedFiles.error,
    };
  }

  const rawConnectionId = body.connectionId;
  const parsedConnectionId =
    typeof rawConnectionId === "number"
      ? rawConnectionId
      : typeof rawConnectionId === "string"
        ? Number.parseInt(rawConnectionId, 10)
        : Number.NaN;
  const connectionId = Number.isFinite(parsedConnectionId) ? parsedConnectionId : undefined;

  if (body.arguments && typeof body.arguments === "object" && !Array.isArray(body.arguments)) {
    return {
      args: body.arguments,
      connectionId,
      confirmed: body.confirmed === true,
      files: parsedFiles.files,
    };
  }

  const args = { ...body };
  delete args.connectionId;
  delete args.confirmed;
  delete args.files;
  return {
    args,
    connectionId,
    confirmed: body.confirmed === true,
    files: parsedFiles.files,
  };
}

function approxByteLengthFromBase64(base64: string): number {
  const trimmed = base64.replace(/=+$/, "");
  return Math.floor((trimmed.length * 3) / 4);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function parseFilesEnvelope(value: unknown): {
  files: FileUploadAttachment[];
  error?: { message: string; status: number };
} {
  if (value === undefined || value === null) {
    return { files: [] };
  }

  if (!Array.isArray(value)) {
    return {
      files: [],
      error: { status: 400, message: "`files` must be an array when provided." },
    };
  }

  const files: FileUploadAttachment[] = [];
  let totalBytes = 0;

  for (let index = 0; index < value.length; index += 1) {
    const item = value[index];
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      return {
        files: [],
        error: { status: 400, message: `files[${index}] must be an object.` },
      };
    }

    const record = item as Record<string, unknown>;
    const missing = ["pointer", "name", "mimetype", "md5", "dataBase64"].filter(
      (field) => !isNonEmptyString(record[field]),
    );

    if (missing.length > 0) {
      return {
        files: [],
        error: {
          status: 400,
          message: `files[${index}] is missing required string field(s): ${missing.join(", ")}.`,
        },
      };
    }

    const dataBase64 = record.dataBase64 as string;
    totalBytes += approxByteLengthFromBase64(dataBase64);
    if (totalBytes > MAX_TOTAL_FILE_BYTES) {
      return {
        files: [],
        error: {
          status: 413,
          message: `The files envelope exceeds the ${MAX_TOTAL_FILE_BYTES}-byte request cap.`,
        },
      };
    }

    files.push({
      pointer: record.pointer as string,
      name: record.name as string,
      mimetype: record.mimetype as string,
      md5: record.md5 as string,
      dataBase64,
    });
  }

  return { files };
}

function getStatusCode(payload: Awaited<ReturnType<typeof executeToolForUser>>): number {
  if (payload.ok) {
    return 200;
  }

  switch (payload.error?.code) {
    case "tool_not_found":
    case "not_found":
      return 404;
    case "ambiguous_connection":
      return 409;
    case "confirmation_required":
      return 412;
    case "needs_connection":
      return 409;
    case "provider_unavailable":
      return 503;
    default:
      break;
  }

  switch (payload.error?.type) {
    case "validation":
      return 400;
    case "reauth_required":
    case "auth":
      return 401;
    case "missing_scopes":
      return 403;
    case "configuration":
      return 422;
    case "rate_limit":
      return 429;
    default:
      break;
  }

  return 500;
}

export async function POST(
  request: Request,
  context: { params: Promise<{ name: string }> },
) {
  try {
    const actor = await resolveRequestActor(request.headers);

    if (!actor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name } = await context.params;
    const payload = await request.json().catch(() => ({}));
    const { args, connectionId, confirmed, files, fileError } = normalizeArgs(payload);
    if (fileError) {
      return NextResponse.json({ error: fileError.message }, { status: fileError.status });
    }

    const execution = await executeToolForUser(
      {
        userId: actor.user.id,
        toolName: decodeURIComponent(name),
        args,
        connectionId,
        confirmed,
        files,
      },
    );

    return NextResponse.json({
      ...execution,
      canonical: toCanonicalExecutionSummary(execution),
    }, {
      status: getStatusCode(execution),
    });
  } catch (error) {
    console.error("Error executing tool:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to execute tool" },
      { status: 500 },
    );
  }
}
