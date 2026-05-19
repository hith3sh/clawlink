import "server-only";

import { DOCS_URL, SITE_URL } from "../../site";

export interface ClawLinkSupportEmailInput {
  customerName: string;
  subject: string;
  headline: string;
  intro: string;
  issueSummary?: string;
  nextSteps?: string[];
  ctaLabel?: string;
  ctaUrl?: string;
  closingNote?: string;
  signatureName?: string;
  signatureRole?: string;
  referenceId?: string;
  replyHint?: string;
}

export interface RenderedSupportEmail {
  subject: string;
  html: string;
  text: string;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function paragraphize(value: string): string[] {
  return value
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function renderParagraphsHtml(value: string): string {
  return paragraphize(value)
    .map(
      (paragraph) =>
        `<p style="margin:0 0 14px;color:#374151;font-size:15px;line-height:1.7;">${escapeHtml(paragraph)}</p>`,
    )
    .join("");
}

function renderParagraphsText(value: string): string {
  return paragraphize(value).join("\n\n");
}

function renderListHtml(items: string[]): string {
  if (items.length === 0) {
    return "";
  }

  const rows = items
    .map(
      (item) => `
        <tr>
          <td style="width:20px;vertical-align:top;padding:0 0 10px;color:#6b7280;font-size:15px;line-height:1.7;">&#8226;</td>
          <td style="padding:0 0 10px;color:#374151;font-size:15px;line-height:1.7;">
            ${escapeHtml(item)}
          </td>
        </tr>`,
    )
    .join("");

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">${rows}</table>`;
}

function renderListText(items: string[]): string {
  return items.map((item) => `- ${item}`).join("\n");
}

export function renderClawLinkSupportEmail(
  input: ClawLinkSupportEmailInput,
): RenderedSupportEmail {
  const customerName = input.customerName.trim() || "there";
  const nextSteps = (input.nextSteps ?? []).map((step) => step.trim()).filter(Boolean);
  const closingNote =
    input.closingNote?.trim() ||
    "If anything still feels off, reply directly to this email and I’ll keep working through it with you.";
  const signatureName = input.signatureName?.trim() || "Jay";
  const signatureRole = input.signatureRole?.trim() || "Founder, ClawLink";
  const replyHint =
    input.replyHint?.trim() ||
    "Reply here if you want me to look at your exact setup or error message.";

  const eyebrow = input.referenceId?.trim()
    ? `Support reference ${escapeHtml(input.referenceId.trim())}`
    : "ClawLink support";

  const issueCard = input.issueSummary?.trim()
    ? `
      <div style="margin:20px 0;padding:16px;border-left:3px solid #d1d5db;background:#f9fafb;">
        <div style="margin:0 0 6px;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Issue summary</div>
        <div style="color:#374151;font-size:15px;line-height:1.6;">${escapeHtml(input.issueSummary.trim())}</div>
      </div>`
    : "";

  const stepsCard = nextSteps.length
    ? `
      <div style="margin:20px 0 0;padding:16px;background:#f9fafb;border:1px solid #e5e7eb;">
        <div style="margin:0 0 12px;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">What happens next</div>
        ${renderListHtml(nextSteps)}
      </div>`
    : "";

  const cta = input.ctaLabel?.trim() && input.ctaUrl?.trim()
    ? `
      <div style="margin:24px 0 10px;">
        <a href="${escapeHtml(input.ctaUrl.trim())}" style="display:inline-block;padding:10px 20px;background:#111827;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;border-radius:4px;">
          ${escapeHtml(input.ctaLabel.trim())}
        </a>
      </div>`
    : "";

  const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>${escapeHtml(input.subject)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
      ${escapeHtml(input.headline)} ${escapeHtml(replyHint)}
    </div>
    <div style="padding:40px 16px;background:#f4f4f5;">
      <div style="max-width:600px;margin:0 auto;">
        <div style="padding:0 0 20px;">
          <span style="font-size:18px;font-weight:700;color:#111827;letter-spacing:-0.02em;">ClawLink</span>
          <span style="margin-left:12px;color:#9ca3af;font-size:12px;">${eyebrow}</span>
        </div>

        <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
          <div style="padding:32px 28px 28px;">
            <h1 style="margin:0 0 20px;color:#111827;font-size:22px;line-height:1.3;font-weight:700;letter-spacing:-0.02em;">
              ${escapeHtml(input.headline)}
            </h1>
            <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.7;">
              Hi ${escapeHtml(customerName)},
            </p>
            ${renderParagraphsHtml(input.intro)}
            ${issueCard}
            ${stepsCard}
            ${cta}
            <div style="margin:24px 0 0;padding-top:20px;border-top:1px solid #e5e7eb;">
              ${renderParagraphsHtml(closingNote)}
              <p style="margin:16px 0 0;color:#111827;font-size:15px;line-height:1.6;">
                ${escapeHtml(signatureName)}<br />
                <span style="color:#6b7280;font-size:13px;">${escapeHtml(signatureRole)}</span>
              </p>
            </div>
          </div>
        </div>

        <div style="padding:20px 0 0;color:#9ca3af;font-size:12px;line-height:1.7;text-align:center;">
          ${escapeHtml(replyHint)}
          <br />
          <a href="${SITE_URL}/dashboard" style="color:#6b7280;text-decoration:underline;">Dashboard</a>
          &nbsp;&middot;&nbsp;
          <a href="${DOCS_URL}" style="color:#6b7280;text-decoration:underline;">Docs</a>
        </div>
      </div>
    </div>
  </body>
</html>`.trim();

  const textSections = [
    "CLAWLINK SUPPORT",
    input.referenceId?.trim() ? `Reference: ${input.referenceId.trim()}` : null,
    "",
    `Hi ${customerName},`,
    "",
    renderParagraphsText(input.intro),
    input.issueSummary?.trim() ? `Issue summary:\n${input.issueSummary.trim()}` : null,
    nextSteps.length ? `What happens next:\n${renderListText(nextSteps)}` : null,
    input.ctaLabel?.trim() && input.ctaUrl?.trim()
      ? `${input.ctaLabel.trim()}: ${input.ctaUrl.trim()}`
      : null,
    renderParagraphsText(closingNote),
    "",
    `${signatureName}\n${signatureRole}`,
    "",
    replyHint,
    `Dashboard: ${SITE_URL}/dashboard`,
    `Docs: ${DOCS_URL}`,
  ].filter((part): part is string => Boolean(part));

  return {
    subject: input.subject,
    html,
    text: textSections.join("\n\n"),
  };
}
