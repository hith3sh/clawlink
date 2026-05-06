import type { Metadata } from "next";
import { MarketingContentPage } from "@/components/marketing/MarketingContentPage";

export const metadata: Metadata = {
  title: "Build an OpenClaw sales assistant with Gmail and HubSpot",
  description:
    "A practical ClawLink workflow for turning OpenClaw into a lightweight sales assistant using Gmail and HubSpot.",
  alternates: {
    canonical: "https://claw-link.dev/build-an-openclaw-sales-assistant-with-gmail-and-hubspot",
  },
};

export default function SalesAssistantPage() {
  return (
    <MarketingContentPage
      eyebrow="Sales workflow"
      title="Build an OpenClaw sales assistant with Gmail and HubSpot"
      description="The simplest high-value ClawLink workflow is not abstract AI automation. It is letting OpenClaw read the inbox, understand the pipeline, and help you move deals forward without you copy-pasting context between tools."
      intro="Gmail gives OpenClaw the conversation history. HubSpot gives it the account and deal context. Together, those two integrations are enough to make OpenClaw useful for triage, prep, follow-up drafts, next-step suggestions, and CRM hygiene."
      primaryCtaHref="/sign-up"
      primaryCtaLabel="Set up this workflow"
      secondaryCtaHref="https://docs.claw-link.dev/integrations/openclaw-to-hubspot"
      secondaryCtaLabel="See HubSpot setup"
      sections={[
        {
          title: "What this workflow actually does",
          bullets: [
            "Summarize inbound sales emails before you reply.",
            "Pull account or contact context from HubSpot before calls.",
            "Draft follow-up replies using the actual conversation and CRM state.",
            "Turn rough call notes into structured next actions.",
            "Reduce the stupid manual work between inbox and CRM.",
          ],
        },
        {
          title: "Why Gmail + HubSpot is a strong first use case",
          body: [
            "This setup maps directly to work people already do every day. That matters, because the best early ClawLink workflows are not flashy. They remove friction from things you already have to do anyway.",
            "OpenClaw becomes much more useful when it can see both the conversation and the customer record. Without that, you just get generic sales copy. With it, you get actual context.",
          ],
        },
        {
          title: "A practical day-to-day loop",
          bullets: [
            "Start the morning by asking OpenClaw to summarize new sales emails and flag anything urgent.",
            "Before a call, ask it to pull the latest HubSpot context for the company and contact.",
            "After the call, paste rough notes and ask OpenClaw to draft follow-up plus suggested CRM updates.",
            "At the end of the day, generate a short pipeline summary and next actions list.",
          ],
        },
        {
          title: "Where ClawLink helps most",
          body: [
            "The win is not just that Gmail and HubSpot can both be connected. The win is that ClawLink removes the annoying connection and auth friction so OpenClaw can actually use them in one workflow. That is more valuable than another generic integration catalog page."
          ],
        },
        {
          title: "Best follow-on integrations",
          bullets: [
            "Google Calendar for meeting prep and follow-up scheduling",
            "Slack for pipeline summaries and alerts",
            "Notion for sales playbooks and call writeups",
            "Google Sheets if your sales ops still lives partly in spreadsheets",
          ],
        },
      ]}
      faq={[
        {
          q: "Do I need a big sales team for this to be useful?",
          a: "No. This workflow is especially good for solo founders, agencies, and small sales teams because it removes context-switching without needing a giant RevOps stack.",
        },
        {
          q: "Why not publish this only in docs?",
          a: "Because this page is about workflow value and conversion, not just setup. The docs should handle exact setup steps, while the marketing page explains why the setup is worth doing.",
        },
      ]}
    />
  );
}
