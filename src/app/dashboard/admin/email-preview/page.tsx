import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdminAccess } from "@/lib/server/admin";
import {
  renderClawLinkSupportEmail,
  type ClawLinkSupportEmailInput,
} from "@/lib/server/email/support-template";

export const dynamic = "force-dynamic";

interface EmailPreviewPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

function readParam(
  value: string | string[] | undefined,
  fallback: string,
): string {
  if (Array.isArray(value)) {
    return value[0] ?? fallback;
  }

  return value?.trim() || fallback;
}

function buildPreviewInput(
  params: Record<string, string | string[] | undefined>,
): ClawLinkSupportEmailInput {
  return {
    customerName: readParam(params.name, "Ava"),
    subject: readParam(params.subject, "Quick update on your ClawLink issue"),
    headline: readParam(params.headline, "I looked into this personally"),
    intro: readParam(
      params.intro,
      "Thanks for flagging the issue. I checked your report and I wanted to send a direct update instead of leaving you guessing.\n\nThe main goal here is to get you back to a clean connection flow with as little back-and-forth as possible.",
    ),
    issueSummary: readParam(
      params.issue,
      "Your integration session completed, but the connected tool did not appear in the expected workflow immediately after setup.",
    ),
    nextSteps: [
      readParam(params.step1, "I’m re-checking the connection session state on our side."),
      readParam(params.step2, "If needed, I’ll have you retry one short step instead of redoing the whole setup."),
      readParam(params.step3, "Once confirmed, I’ll send a final note so you know the issue is closed."),
    ].filter(Boolean),
    ctaLabel: readParam(params.ctaLabel, "Open ClawLink Dashboard"),
    ctaUrl: readParam(params.ctaUrl, "https://claw-link.dev/dashboard"),
    closingNote: readParam(
      params.closing,
      "I know setup issues are frustrating, especially when you just want the integration to work. I’ll keep this simple and stay on it until it’s sorted.",
    ),
    signatureName: readParam(params.signatureName, "Jay"),
    signatureRole: readParam(params.signatureRole, "Founder, ClawLink"),
    referenceId: readParam(params.reference, "CLK-1024"),
    replyHint: readParam(
      params.replyHint,
      "Reply to this email with a screenshot or the exact step that failed and I’ll dig in from there.",
    ),
  };
}

export default async function EmailPreviewPage({
  searchParams,
}: EmailPreviewPageProps) {
  await requireAdminAccess();

  const resolvedParams = (await searchParams) ?? {};
  const preview = renderClawLinkSupportEmail(buildPreviewInput(resolvedParams));

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="space-y-3">
        <Badge variant="outline" className="border-[var(--brand-border)] bg-[var(--brand-bg)] text-[var(--brand-dark)]">
          Admin preview
        </Badge>
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-[-0.03em]">Customer support email template</h1>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            This preview shows the branded HTML version and the plain-text fallback for the
            ClawLink support email template. Use query params to test alternate copy without
            changing code.
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.85fr)]">
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-white/8">
            <CardTitle>{preview.subject}</CardTitle>
            <CardDescription>HTML preview rendered with email-safe inline styles.</CardDescription>
          </CardHeader>
          <CardContent className="bg-[#191919] p-3 md:p-5">
            <div className="overflow-hidden rounded-[28px] ring-1 ring-white/8">
              <div
                className="bg-white"
                dangerouslySetInnerHTML={{ __html: preview.html }}
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="border-b border-white/8">
              <CardTitle>Plain-text fallback</CardTitle>
              <CardDescription>
                Copy this when you need a stripped-down personal reply or need to inspect the
                non-HTML version.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <pre className="overflow-x-auto whitespace-pre-wrap rounded-2xl border border-white/8 bg-black/20 p-4 text-[13px] leading-6 text-muted-foreground">
                {preview.text}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-white/8">
              <CardTitle>Suggested usage</CardTitle>
              <CardDescription>
                Future send flow can call the renderer and pass the result into the Cloudflare
                email binding.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <pre className="overflow-x-auto rounded-2xl border border-white/8 bg-black/20 p-4 text-[13px] leading-6 text-muted-foreground">
{`const email = renderClawLinkSupportEmail({
  customerName: "Ava",
  subject: "Quick update on your ClawLink issue",
  headline: "I looked into this personally",
  intro: "Thanks for flagging this...",
  issueSummary: "Connected flow completed, but tools did not appear.",
  nextSteps: [
    "I am re-checking the connection session state.",
    "If needed, I will ask for one short retry.",
  ],
  ctaLabel: "Open ClawLink Dashboard",
  ctaUrl: "https://claw-link.dev/dashboard",
});

await env.SUPPORT_MAILER.send({
  from: "hello@claw-link.dev",
  to: "customer@example.com",
  subject: email.subject,
  text: email.text,
  html: email.html,
});`}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
