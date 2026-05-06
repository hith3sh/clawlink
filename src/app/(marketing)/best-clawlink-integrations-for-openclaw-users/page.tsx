import type { Metadata } from "next";
import { MarketingContentPage } from "@/components/marketing/MarketingContentPage";

export const metadata: Metadata = {
  title: "Best ClawLink integrations for OpenClaw users",
  description:
    "A practical shortlist of the highest-leverage ClawLink integrations for OpenClaw users, with where each one helps most.",
  alternates: {
    canonical: "https://claw-link.dev/best-clawlink-integrations-for-openclaw-users",
  },
};

export default function BestIntegrationsPage() {
  return (
    <MarketingContentPage
      eyebrow="Best integrations"
      title="Best ClawLink integrations for OpenClaw users"
      description="If you only set up a few integrations first, do not pick randomly. Start with the apps that let OpenClaw do real work end to end: inbox, calendar, CRM, notes, team chat, spreadsheets, and issue tracking."
      intro="ClawLink works best when it turns OpenClaw from a chat assistant into an operator. The highest-value setup is usually not the most exotic stack. It is the boring stack you already live in every day: Gmail, Google Calendar, HubSpot, Slack, Notion, GitHub, Google Sheets, and a couple of workflow-specific tools on top."
      primaryCtaHref="/sign-up"
      primaryCtaLabel="Set up ClawLink"
      secondaryCtaHref="https://docs.claw-link.dev/integrations/overview"
      secondaryCtaLabel="Browse setup docs"
      sections={[
        {
          title: "1. Gmail + Google Calendar for inbox and follow-up workflows",
          body: [
            "This is the strongest default setup for most founders, operators, recruiters, and sales people. OpenClaw can summarize email threads, pull out action items, suggest replies, and connect those tasks to actual time on your calendar.",
          ],
          bullets: [
            "Best for inbox triage, scheduling, follow-up reminders, and keeping loose email work from leaking everywhere.",
            "Usually the fastest path to a workflow that feels immediately useful in day-to-day work.",
            "Pairs well with workflow pages that explain email triage and follow-up automation, not just setup commands.",
          ],
        },
        {
          title: "2. HubSpot or Salesforce for revenue workflows",
          body: [
            "If OpenClaw cannot see your CRM, it can only guess. Once HubSpot or Salesforce is connected, it can help with pipeline notes, next actions, contact lookups, and account context instead of writing generic fluff.",
          ],
          bullets: [
            "Use HubSpot when you want lightweight sales-assistant workflows.",
            "Use Salesforce when your team already lives in a heavier CRM process.",
            "Best paired with Gmail, because sales work usually starts in email and ends in CRM updates.",
          ],
        },
        {
          title: "3. Slack or Telegram for operational output",
          body: [
            "A lot of OpenClaw value comes from sending the result somewhere useful. Slack and Telegram are the simplest ways to turn research, summaries, alerts, or follow-ups into something the rest of your team actually sees.",
          ],
          bullets: [
            "Good for daily summaries, alerts, launch messages, and workflow handoffs.",
            "Useful when OpenClaw should not just think, but also notify.",
            "Makes internal workflow pages easier to convert because the value is visible fast.",
          ],
        },
        {
          title: "4. Notion, Google Sheets, and GitHub for structured work",
          body: [
            "These are the integrations that stop ideas from dying in chat. Notion is good for docs and knowledge bases, Google Sheets is good for operational tables and quick reporting, and GitHub is good when the work needs to land in engineering reality.",
          ],
          bullets: [
            "Use Notion for notes, SOPs, and handoff documents.",
            "Use Google Sheets for lead lists, status trackers, and lightweight ops systems.",
            "Use GitHub when the next action should become an issue, PR summary, or engineering task.",
          ],
        },
        {
          title: "A good first-stack shortlist",
          bullets: [
            "Founder / solo operator: Gmail, Google Calendar, Notion, Slack",
            "Sales workflow: Gmail, HubSpot, Google Calendar, Slack",
            "Support / ops workflow: Gmail, Google Sheets, Slack, Notion",
            "Product / engineering workflow: GitHub, Linear, Slack, Notion",
          ],
        },
        {
          title: "What to publish on docs vs what to publish on marketing",
          body: [
            "Docs pages should answer setup intent: how to connect Gmail to OpenClaw, how to connect HubSpot, what to do if the tools do not appear. Marketing pages should answer why the setup matters: best integrations, best workflows, and why ClawLink is the simpler OpenClaw-native option.",
          ],
        },
      ]}
      faq={[
        {
          q: "Should I start with as many integrations as possible?",
          a: "No. Start with 2 to 4 that map to one real workflow. More connections without a clear workflow just makes the product feel messy.",
        },
        {
          q: "What is the best first ClawLink setup for most people?",
          a: "Usually Gmail plus Google Calendar, then either HubSpot, Slack, or Notion depending on whether the work is sales, team operations, or docs-heavy.",
        },
      ]}
    />
  );
}
