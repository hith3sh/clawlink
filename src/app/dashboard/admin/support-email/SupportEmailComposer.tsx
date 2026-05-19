"use client";

import { useDeferredValue, useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, MailCheck, Send, Sparkles, TriangleAlert } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

interface SupportEmailFormState {
  to: string;
  subject: string;
  headline: string;
  intro: string;
  issueSummary: string;
  nextSteps: string;
  ctaLabel: string;
  ctaUrl: string;
  closingNote: string;
  signatureName: string;
  signatureRole: string;
  replyHint: string;
}

interface SendResult {
  id: string;
  to: string;
  subject: string;
}

const integrationRetryDraft: SupportEmailFormState = {
  to: "",
  subject: "Please retry your ClawLink integrations",
  headline: "A quick update from ClawLink",
  intro:
    "We noticed from our integration health logs that a few recent ClawLink requests did not complete successfully.\n\nWe've since shipped fixes and upgraded the ClawLink OpenClaw plugin. Please ask OpenClaw to update the ClawLink plugin, then try your integrations again.",
  issueSummary:
    "For WhatsApp, sending requires a WhatsApp phone number that is ready for the WhatsApp Cloud API. If the number is only set up in the WhatsApp Business mobile app, Meta may require additional setup before API sending works.",
  nextSteps:
    "Ask OpenClaw to upgrade the ClawLink plugin.\nRetry the integrations that failed earlier.\nFor WhatsApp, follow Meta's Cloud API setup guide before sending.",
  ctaLabel: "Open WhatsApp Cloud API guide",
  ctaUrl: "https://developers.facebook.com/documentation/business-messaging/whatsapp/get-started",
  closingNote:
    "ClawLink is still early, and your feedback would be very helpful. If anything still feels confusing or doesn't work, please reply to this email. We're listening and improving quickly.",
  signatureName: "Jay",
  signatureRole: "ClawLink",
  replyHint: "Reply to this email if anything still fails or feels confusing.",
};

const blankDraft: SupportEmailFormState = {
  ...integrationRetryDraft,
  to: "",
  subject: "",
  headline: "",
  intro: "",
  issueSummary: "",
  nextSteps: "",
  ctaLabel: "",
  ctaUrl: "",
  closingNote: "",
};

function updateField(
  state: SupportEmailFormState,
  name: keyof SupportEmailFormState,
  value: string,
): SupportEmailFormState {
  return {
    ...state,
    [name]: value,
  };
}

function splitSteps(value: string): string[] {
  return value
    .split("\n")
    .map((step) => step.trim())
    .filter(Boolean);
}

function hasRequiredFields(state: SupportEmailFormState): boolean {
  return Boolean(
    state.to.trim() &&
      state.to.includes("@") &&
      state.subject.trim() &&
      state.headline.trim() &&
      state.intro.trim(),
  );
}

function createPayload(state: SupportEmailFormState) {
  return {
    to: state.to.trim(),
    subject: state.subject.trim(),
    headline: state.headline.trim(),
    intro: state.intro.trim(),
    issueSummary: state.issueSummary.trim() || undefined,
    nextSteps: splitSteps(state.nextSteps),
    ctaLabel: state.ctaLabel.trim() || undefined,
    ctaUrl: state.ctaUrl.trim() || undefined,
    closingNote: state.closingNote.trim() || undefined,
    signatureName: state.signatureName.trim() || undefined,
    signatureRole: state.signatureRole.trim() || undefined,
    replyHint: state.replyHint.trim() || undefined,
  };
}

function Field({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor={id}>{label}</Label>
        {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
      </div>
      {children}
    </div>
  );
}

function EmailPreview({ draft }: { draft: SupportEmailFormState }) {
  const steps = splitSteps(draft.nextSteps);
  const greeting = "Hi,";
  const signatureName = draft.signatureName.trim() || "Jay";
  const signatureRole = draft.signatureRole.trim() || "ClawLink";

  return (
    <Card className="sticky top-6 border-white/10 bg-[#111111]/90 shadow-2xl shadow-black/30">
      <CardHeader className="border-b border-white/8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Email preview</CardTitle>
            <CardDescription>Approximate copy preview before Resend delivery.</CardDescription>
          </div>
          <Badge variant="outline" className="border-emerald-400/30 bg-emerald-400/10 text-emerald-200">
            Resend
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        <div className="rounded-2xl border border-white/8 bg-black/25 p-4">
          <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">To</div>
          <div className="mt-1 break-all text-sm text-foreground">
            {draft.to.trim() || "recipient@example.com"}
          </div>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#f4f4f5] text-[#111827] shadow-xl">
          <div className="border-b border-black/10 bg-white px-5 py-4">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6b7280]">
              ClawLink support
            </div>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">
              {draft.headline.trim() || "Email headline"}
            </h2>
          </div>

          <div className="space-y-4 px-5 py-5 text-sm leading-6 text-[#374151]">
            <p>{greeting}</p>
            {(draft.intro.trim() || "Write the main support note here.")
              .split(/\n{2,}/)
              .map((paragraph, index) => (
                <p key={`${paragraph}-${index}`}>{paragraph}</p>
              ))}

            {draft.issueSummary.trim() ? (
              <div className="border-l-4 border-[#d1d5db] bg-[#f9fafb] p-4">
                <div className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#6b7280]">
                  Issue summary
                </div>
                <p>{draft.issueSummary.trim()}</p>
              </div>
            ) : null}

            {steps.length ? (
              <div className="rounded-2xl border border-[#e5e7eb] bg-[#f9fafb] p-4">
                <div className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#6b7280]">
                  What happens next
                </div>
                <ul className="space-y-2">
                  {steps.map((step) => (
                    <li key={step} className="flex gap-2">
                      <span className="text-[#9ca3af]">-</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {draft.ctaLabel.trim() && draft.ctaUrl.trim() ? (
              <div>
                <span className="inline-flex rounded-xl bg-[#111827] px-4 py-2 text-sm font-semibold text-white">
                  {draft.ctaLabel.trim()}
                </span>
              </div>
            ) : null}

            <Separator className="bg-black/10" />

            <p>
              {draft.closingNote.trim() ||
                "Add a closing note that invites the user to reply with feedback."}
            </p>
            <p className="text-[#111827]">
              {signatureName}
              <br />
              <span className="text-xs text-[#6b7280]">{signatureRole}</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SupportEmailComposer() {
  const [draft, setDraft] = useState<SupportEmailFormState>(integrationRetryDraft);
  const deferredDraft = useDeferredValue(draft);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SendResult | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setResult(null);

    if (!hasRequiredFields(draft)) {
      setError("Recipient, subject, headline, and intro are required.");
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch("/api/admin/support-email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createPayload(draft)),
      });
      const payload = (await response.json().catch(() => null)) as
        | { error?: string; id?: string; to?: string; subject?: string }
        | null;

      if (!response.ok) {
        throw new Error(payload?.error || `Send failed with HTTP ${response.status}`);
      }

      if (!payload?.id || !payload.to || !payload.subject) {
        throw new Error("Send completed, but the response was missing email details.");
      }

      setResult({
        id: payload.id,
        to: payload.to,
        subject: payload.subject,
      });
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "Failed to send email.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[32px] border border-white/8 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.24),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-5 shadow-2xl shadow-black/20 md:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <Badge variant="outline" className="border-emerald-400/30 bg-emerald-400/10 text-emerald-100">
              Admin sender
            </Badge>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
                Send a support email
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                Draft a customer-safe message, preview the copy, then send it through the
                Resend-backed ClawLink support email pipeline.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDraft(integrationRetryDraft);
                setError(null);
                setResult(null);
              }}
            >
              <Sparkles />
              Integration retry draft
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setDraft(blankDraft);
                setError(null);
                setResult(null);
              }}
            >
              Clear
            </Button>
          </div>
        </div>
      </div>

      {error ? (
        <Alert variant="destructive" className="border-red-500/20 bg-red-500/10">
          <TriangleAlert />
          <AlertTitle>Email was not sent</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {result ? (
        <Alert className="border-emerald-400/20 bg-emerald-400/10">
          <CheckCircle2 className="text-emerald-300" />
          <AlertTitle>Sent through Resend</AlertTitle>
          <AlertDescription>
            Sent to {result.to} with subject &ldquo;{result.subject}&rdquo;. Resend id:{" "}
            {result.id}
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(380px,0.92fr)]">
        <Card className="border-white/8 bg-card/80">
          <CardHeader className="border-b border-white/8">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-200">
                <MailCheck className="size-5" />
              </div>
              <div>
                <CardTitle>Composer</CardTitle>
                <CardDescription>
                  Keep this factual and privacy-safe: mention operational failures, not private
                  message contents.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 md:p-5">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <Field id="to" label="Recipient" hint="Required">
                  <Input
                    id="to"
                    type="email"
                    placeholder="customer@example.com"
                    value={draft.to}
                    onChange={(event) => setDraft(updateField(draft, "to", event.target.value))}
                  />
                </Field>
                <Field id="subject" label="Subject" hint="Required">
                  <Input
                    id="subject"
                    placeholder="Please retry your ClawLink integrations"
                    value={draft.subject}
                    onChange={(event) =>
                      setDraft(updateField(draft, "subject", event.target.value))
                    }
                  />
                </Field>
              </div>

              <Field id="headline" label="Headline" hint="Required">
                <Input
                  id="headline"
                  placeholder="A quick update from ClawLink"
                  value={draft.headline}
                  onChange={(event) =>
                    setDraft(updateField(draft, "headline", event.target.value))
                  }
                />
              </Field>

              <Field id="intro" label="Intro" hint="Required">
                <Textarea
                  id="intro"
                  rows={6}
                  placeholder="Write the main email copy..."
                  value={draft.intro}
                  onChange={(event) => setDraft(updateField(draft, "intro", event.target.value))}
                />
              </Field>

              <Field id="issueSummary" label="Issue summary" hint="Optional">
                <Textarea
                  id="issueSummary"
                  rows={4}
                  placeholder="Short factual summary of the integration issue..."
                  value={draft.issueSummary}
                  onChange={(event) =>
                    setDraft(updateField(draft, "issueSummary", event.target.value))
                  }
                />
              </Field>

              <Field id="nextSteps" label="Next steps" hint="One per line">
                <Textarea
                  id="nextSteps"
                  rows={4}
                  placeholder="Ask OpenClaw to upgrade the plugin..."
                  value={draft.nextSteps}
                  onChange={(event) =>
                    setDraft(updateField(draft, "nextSteps", event.target.value))
                  }
                />
              </Field>

              <div className="grid gap-4 md:grid-cols-2">
                <Field id="ctaLabel" label="Button label" hint="Optional">
                  <Input
                    id="ctaLabel"
                    placeholder="Open setup guide"
                    value={draft.ctaLabel}
                    onChange={(event) =>
                      setDraft(updateField(draft, "ctaLabel", event.target.value))
                    }
                  />
                </Field>
                <Field id="ctaUrl" label="Button URL" hint="Optional">
                  <Input
                    id="ctaUrl"
                    type="url"
                    placeholder="https://..."
                    value={draft.ctaUrl}
                    onChange={(event) => setDraft(updateField(draft, "ctaUrl", event.target.value))}
                  />
                </Field>
              </div>

              <Field id="closingNote" label="Closing note" hint="Optional">
                <Textarea
                  id="closingNote"
                  rows={4}
                  placeholder="Invite feedback or replies..."
                  value={draft.closingNote}
                  onChange={(event) =>
                    setDraft(updateField(draft, "closingNote", event.target.value))
                  }
                />
              </Field>

              <div className="grid gap-4 md:grid-cols-2">
                <Field id="signatureName" label="Signature name">
                  <Input
                    id="signatureName"
                    value={draft.signatureName}
                    onChange={(event) =>
                      setDraft(updateField(draft, "signatureName", event.target.value))
                    }
                  />
                </Field>
                <Field id="signatureRole" label="Signature role">
                  <Input
                    id="signatureRole"
                    value={draft.signatureRole}
                    onChange={(event) =>
                      setDraft(updateField(draft, "signatureRole", event.target.value))
                    }
                  />
                </Field>
              </div>

              <Field id="replyHint" label="Footer reply hint" hint="Optional">
                <Input
                  id="replyHint"
                  placeholder="Reply to this email if anything still fails."
                  value={draft.replyHint}
                  onChange={(event) =>
                    setDraft(updateField(draft, "replyHint", event.target.value))
                  }
                />
              </Field>

              <div className="flex flex-col gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-muted-foreground">
                  Sends from the configured ClawLink support sender via Resend.
                </div>
                <Button type="submit" disabled={isSending || !hasRequiredFields(draft)}>
                  {isSending ? <Loader2 className="animate-spin" /> : <Send />}
                  {isSending ? "Sending..." : "Send email"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <EmailPreview draft={deferredDraft} />
      </div>
    </div>
  );
}
