import type { Metadata } from "next";
import { MarketingContentPage } from "@/components/marketing/MarketingContentPage";

export const metadata: Metadata = {
  title: "Use OpenClaw to triage email and schedule follow-ups",
  description:
    "A practical ClawLink workflow for inbox triage, follow-up drafting, and calendar-based next steps inside OpenClaw.",
  alternates: {
    canonical: "https://claw-link.dev/use-openclaw-to-triage-email-and-schedule-follow-ups",
  },
};

export default function EmailTriagePage() {
  return (
    <MarketingContentPage
      eyebrow="Inbox workflow"
      title="Use OpenClaw to triage email and schedule follow-ups"
      description="Most people do not need a giant AI agent system first. They need help surviving the inbox. ClawLink makes that practical by letting OpenClaw work with Gmail and Google Calendar in the same loop."
      intro="This is one of the best early workflows for ClawLink because it is immediate, concrete, and easy to feel. Instead of treating email as a pile of unfinished thought, OpenClaw can help sort it, draft the next move, and connect real follow-up work to your calendar."
      primaryCtaHref="/sign-up"
      primaryCtaLabel="Connect Gmail and Calendar"
      secondaryCtaHref="https://docs.claw-link.dev/integrations/openclaw-to-google-calendar"
      secondaryCtaLabel="See Calendar setup"
      sections={[
        {
          title: "What this workflow is good for",
          bullets: [
            "Summarizing unread threads so you can decide what deserves attention first.",
            "Separating urgent messages from low-value noise.",
            "Drafting follow-ups while the original thread context is still fresh.",
            "Turning promises made in email into actual time or reminders.",
          ],
        },
        {
          title: "Why this is high leverage",
          body: [
            "Inbox work is repetitive, fragmented, and easy to procrastinate on. It is exactly the kind of workflow where OpenClaw becomes more useful once it can touch the real systems around the conversation instead of only talking about them.",
            "Gmail gives the raw thread context. Google Calendar gives the reality check for when follow-up should happen. ClawLink is the layer that makes those connections actually usable in OpenClaw.",
          ],
        },
        {
          title: "A simple operating rhythm",
          bullets: [
            "Morning: ask OpenClaw to summarize unread or important threads.",
            "Midday: draft replies or follow-ups for anything that needs a human response.",
            "Afternoon: identify threads that should become meetings, reminders, or time-blocked tasks.",
            "End of day: ask for a short recap of what is still waiting on you.",
          ],
        },
        {
          title: "Who this helps most",
          bullets: [
            "Founders juggling sales, hiring, and ops in one inbox",
            "Recruiters or agencies coordinating lots of back-and-forth",
            "Operators who live in Gmail and Calendar all day",
            "Anyone whose work keeps leaking because follow-up never becomes scheduled work",
          ],
        },
        {
          title: "Where to send people next",
          body: [
            "This page should convert interest. The docs should close setup intent. That means linking from here into exact Gmail and Google Calendar integration guides, and from those docs pages back into workflow pages like this one.",
          ],
        },
      ]}
      faq={[
        {
          q: "Is this only for sales email?",
          a: "No. It works for recruiting, customer follow-ups, founder inbox management, and general ops-heavy email too.",
        },
        {
          q: "What is the minimum setup?",
          a: "Usually Gmail plus Google Calendar. You can add Slack, HubSpot, or Notion later if the workflow needs somewhere else to send or store the result.",
        },
      ]}
    />
  );
}
