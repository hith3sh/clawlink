import { NextResponse } from "next/server";

import { requireAdminAccess } from "@/lib/server/admin";
import {
  renderClawLinkSupportEmail,
  type ClawLinkSupportEmailInput,
} from "@/lib/server/email/support-template";
import { sendSupportEmail } from "@/lib/server/email/resend";

export const dynamic = "force-dynamic";

interface SendSupportEmailBody extends Partial<ClawLinkSupportEmailInput> {
  to?: string;
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : undefined;
}

function readStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  return value
    .map((entry) => (typeof entry === "string" ? entry.trim() : ""))
    .filter(Boolean);
}

function buildEmailInput(body: SendSupportEmailBody): ClawLinkSupportEmailInput {
  const subject = readString(body.subject);
  const headline = readString(body.headline);
  const intro = readString(body.intro);

  if (!subject) {
    throw new Error("subject is required");
  }

  if (!headline) {
    throw new Error("headline is required");
  }

  if (!intro) {
    throw new Error("intro is required");
  }

  return {
    customerName: readString(body.customerName) ?? "there",
    subject,
    headline,
    intro,
    issueSummary: readString(body.issueSummary),
    nextSteps: readStringArray(body.nextSteps),
    ctaLabel: readString(body.ctaLabel),
    ctaUrl: readString(body.ctaUrl),
    closingNote: readString(body.closingNote),
    signatureName: readString(body.signatureName),
    signatureRole: readString(body.signatureRole),
    referenceId: readString(body.referenceId),
    replyHint: readString(body.replyHint),
  };
}

export async function POST(request: Request) {
  await requireAdminAccess();

  try {
    const body = (await request.json().catch(() => ({}))) as SendSupportEmailBody;
    const to = readString(body.to);

    if (!to) {
      return NextResponse.json({ error: "to is required" }, { status: 400 });
    }

    const input = buildEmailInput(body);
    const email = renderClawLinkSupportEmail(input);
    const result = await sendSupportEmail({ to, email });

    return NextResponse.json({
      ok: true,
      id: result.id,
      to,
      subject: email.subject,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send support email";
    const status =
      message.includes("required") || message.includes("valid recipient") ? 400 : 500;

    console.error("[api/admin/support-email/send] failed", {
      message,
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json({ error: message }, { status });
  }
}
