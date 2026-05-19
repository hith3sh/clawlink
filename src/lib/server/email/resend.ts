import "server-only";

import { getRuntimeEnv } from "@/lib/server/integration-store";

import type { RenderedSupportEmail } from "./support-template";

export interface SendSupportEmailParams {
  to: string;
  email: RenderedSupportEmail;
  from?: string;
  replyTo?: string;
}

export interface SendSupportEmailResult {
  id: string;
}

function readRequiredEnv(env: Record<string, unknown>, key: string): string {
  const value = typeof env[key] === "string" ? env[key].trim() : "";

  if (!value) {
    throw new Error(`${key} is not configured`);
  }

  return value;
}

function normalizeEmailAddress(value: string): string {
  const trimmed = value.trim();

  if (!trimmed || !trimmed.includes("@")) {
    throw new Error("A valid recipient email is required");
  }

  return trimmed;
}

export async function sendSupportEmail({
  to,
  email,
  from,
  replyTo,
}: SendSupportEmailParams): Promise<SendSupportEmailResult> {
  const env = getRuntimeEnv();
  const apiKey = readRequiredEnv(env, "RESEND_API_KEY");
  const resolvedFrom =
    from?.trim() ||
    (typeof env.SUPPORT_EMAIL_FROM === "string" && env.SUPPORT_EMAIL_FROM.trim()) ||
    "ClawLink <hello@claw-link.dev>";
  const resolvedReplyTo =
    replyTo?.trim() ||
    (typeof env.SUPPORT_EMAIL_REPLY_TO === "string" && env.SUPPORT_EMAIL_REPLY_TO.trim()) ||
    "hello@claw-link.dev";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: resolvedFrom,
      to: [normalizeEmailAddress(to)],
      reply_to: resolvedReplyTo,
      subject: email.subject,
      html: email.html,
      text: email.text,
    }),
  });

  const payload = (await response.json().catch(() => null)) as
    | { id?: string; message?: string; name?: string }
    | null;

  if (!response.ok) {
    throw new Error(
      payload?.message || payload?.name || `Resend returned HTTP ${response.status}`,
    );
  }

  if (!payload?.id) {
    throw new Error("Resend did not return an email id");
  }

  return { id: payload.id };
}
