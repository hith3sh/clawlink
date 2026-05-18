import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { SiGmail } from "react-icons/si";
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Gmail + OpenClaw Integration — Send, read, and manage email from chat",
  description:
    "Connect Gmail to OpenClaw through ClawLink. Send emails, read threads, manage labels, create drafts, and search your inbox — all from chat. No API keys needed.",
  alternates: {
    canonical: "https://claw-link.dev/integrations/gmail",
  },
  openGraph: {
    type: "website",
    url: "https://claw-link.dev/integrations/gmail",
    siteName: SITE_NAME,
    title: "Gmail + OpenClaw Integration — Send, read, and manage email from chat",
    description:
      "Connect Gmail to OpenClaw through ClawLink. Send emails, read threads, manage labels, create drafts, and search your inbox — all from chat.",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gmail + OpenClaw Integration — Send, read, and manage email from chat",
    description:
      "Connect Gmail to OpenClaw through ClawLink. Send emails, read threads, manage labels, create drafts, and search your inbox — all from chat.",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function GmailIntegrationPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "ClawLink Gmail Integration",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "Connect Gmail to OpenClaw through ClawLink. Send emails, read threads, manage labels, create drafts, and search your inbox — all from chat.",
    url: "https://claw-link.dev/integrations/gmail",
    image: DEFAULT_OG_IMAGE,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "First integration free. $2.99/month for full access.",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "120",
    },
  };

  return (
    <main className="flex-1">
      <Script
        id="gmail-integration-schema"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(structuredData)}
      </Script>

      {/* ───── Hero ───── */}
      <section className="relative mx-auto max-w-[1080px] px-6 pt-14 pb-16 text-center">
        <span
          className="mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold"
          style={{
            background: "rgba(234,67,53,0.10)",
            border: "1px solid rgba(234,67,53,0.25)",
            color: "#FF8A80",
          }}
        >
          <SiGmail size={14} color="#EA4335" />
          Communication
        </span>

        <h1
          className="mx-auto max-w-[840px] text-balance"
          style={{
            fontFamily:
              "var(--font-display), var(--font-inter), system-ui, sans-serif",
            fontWeight: 700,
            fontSize: "clamp(38px, 5.5vw, 58px)",
            lineHeight: 1.05,
            letterSpacing: "-0.025em",
            color: "var(--mk-fg)",
          }}
        >
          Connect Gmail to{" "}
          <span className="mk-marked mk-marked--ember">OpenClaw</span>
        </h1>

        <p
          className="mx-auto mt-5 max-w-[640px] text-[17px] leading-relaxed"
          style={{ color: "var(--mk-fg-muted)" }}
        >
          Send emails, read threads, manage labels, create drafts, and search
          your inbox — directly from your OpenClaw chat. No API keys. No
          manual setup.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/sign-up"
            className="mk-btn inline-flex"
            style={{ background: "var(--brand)", color: "#fff" }}
          >
            Get started — first integration free
          </Link>
          <a
            href="https://docs.claw-link.dev/integrations/gmail"
            target="_blank"
            rel="noopener noreferrer"
            className="mk-btn inline-flex border border-white/15 bg-white/[0.03] text-white hover:bg-white/[0.06]"
          >
            Read setup docs
          </a>
        </div>

        {/* Gmail icon graphic */}
        <div className="mx-auto mt-14 flex max-w-[480px] items-center justify-center">
          <div
            className="relative flex h-28 w-28 items-center justify-center rounded-3xl sm:h-32 sm:w-32"
            style={{
              background: "rgba(234,67,53,0.08)",
              border: "1px solid rgba(234,67,53,0.18)",
            }}
          >
            <Image
              src="/icons/gmail.svg"
              alt="Gmail"
              width={64}
              height={64}
              className="h-14 w-14 sm:h-16 sm:w-16"
              priority
            />
          </div>
        </div>
      </section>

      {/* ───── How it works ───── */}
      <section className="mx-auto max-w-[1080px] px-6 pb-20">
        <div className="mb-10 text-center">
          <h2
            style={{
              fontFamily:
                "var(--font-display), var(--font-inter), system-ui, sans-serif",
              fontWeight: 700,
              fontSize: "clamp(28px, 4vw, 42px)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "var(--mk-fg)",
            }}
          >
            How it works
          </h2>
          <p
            className="mx-auto mt-3 max-w-[480px] text-[15px]"
            style={{ color: "var(--mk-fg-muted)" }}
          >
            Three steps. No developer needed.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StepCard
            number="1"
            title="Install ClawLink"
            desc="Add the ClawLink plugin to OpenClaw once. It takes under a minute."
          />
          <StepCard
            number="2"
            title="Connect Gmail"
            desc="Click Connect next to Gmail in the dashboard. Authenticate with Google in one click."
          />
          <StepCard
            number="3"
            title="Use from chat"
            desc="Ask OpenClaw to send emails, summarize threads, create drafts, or manage labels."
          />
        </div>
      </section>

      {/* ───── Features ───── */}
      <section className="mx-auto max-w-[1080px] px-6 pb-20">
        <div className="mb-10 text-center">
          <h2
            style={{
              fontFamily:
                "var(--font-display), var(--font-inter), system-ui, sans-serif",
              fontWeight: 700,
              fontSize: "clamp(28px, 4vw, 42px)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "var(--mk-fg)",
            }}
          >
            What you can do
          </h2>
          <p
            className="mx-auto mt-3 max-w-[520px] text-[15px]"
            style={{ color: "var(--mk-fg-muted)" }}
          >
            Every action is one chat message away.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<SendIcon />}
            title="Send emails"
            desc="Draft and send emails to anyone without switching tabs."
          />
          <FeatureCard
            icon={<SearchIcon />}
            title="Read & search inbox"
            desc="Pull up threads, search by sender or subject, and get summaries."
          />
          <FeatureCard
            icon={<ReplyIcon />}
            title="Reply & forward"
            desc="Reply to threads or forward messages — all from chat."
          />
          <FeatureCard
            icon={<DraftIcon />}
            title="Create drafts"
            desc="Save drafts for review before sending."
          />
          <FeatureCard
            icon={<LabelIcon />}
            title="Organize with labels"
            desc="Create labels, apply them to messages, and clean up your inbox."
          />
          <FeatureCard
            icon={<ThreadIcon />}
            title="Manage threads"
            desc="List conversations, view thread history, and keep context intact."
          />
        </div>
      </section>

      {/* ───── Use cases ───── */}
      <section className="mx-auto max-w-[1080px] px-6 pb-20">
        <div className="rounded-[28px] p-7 md:p-10"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid var(--mk-border-card)",
          }}
        >
          <h2
            className="text-center"
            style={{
              fontFamily:
                "var(--font-display), var(--font-inter), system-ui, sans-serif",
              fontWeight: 700,
              fontSize: "clamp(26px, 3.5vw, 38px)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "var(--mk-fg)",
            }}
          >
            Perfect for
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <UseCaseCard
              title="Inbox triage"
              desc="Ask OpenClaw to summarize unread emails and flag the ones that need action."
            />
            <UseCaseCard
              title="Follow-ups"
              desc="Draft and send follow-up emails without ever opening Gmail."
            />
            <UseCaseCard
              title="Email automation"
              desc="Label, organize, and batch-manage messages using plain English commands."
            />
          </div>
        </div>
      </section>

      {/* ───── Bottom CTA ───── */}
      <section className="mx-auto max-w-[720px] px-6 pb-24 text-center">
        <h2
          className="text-2xl font-semibold"
          style={{
            fontFamily:
              "var(--font-display), var(--font-inter), system-ui, sans-serif",
            color: "var(--mk-fg)",
          }}
        >
          Ready to connect Gmail?
        </h2>
        <p
          className="mx-auto mt-3 max-w-[420px] text-sm"
          style={{ color: "var(--mk-fg-muted)" }}
        >
          Your first integration is free. Get started in under two minutes.
        </p>
        <Link
          href="/sign-up"
          className="mk-btn mx-auto mt-7 inline-flex"
          style={{ background: "var(--brand)", color: "#fff" }}
        >
          Connect Gmail to OpenClaw
        </Link>
        <p
          className="mx-auto mt-4 max-w-[420px] text-xs"
          style={{ color: "var(--mk-fg-faint)" }}
        >
          No credit card required for the first integration.
        </p>
      </section>
    </main>
  );
}

/* ─── Sub-components ─── */

function StepCard({
  number,
  title,
  desc,
}: {
  number: string;
  title: string;
  desc: string;
}) {
  return (
    <article
      className="rounded-[22px] p-7 text-center"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid var(--mk-border-card)",
      }}
    >
      <div
        className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
        style={{
          background: "rgba(234,67,53,0.12)",
          color: "#FF8A80",
          border: "1px solid rgba(234,67,53,0.22)",
        }}
      >
        {number}
      </div>
      <h3
        className="text-[17px] font-bold"
        style={{
          fontFamily:
            "var(--font-display), var(--font-inter), system-ui, sans-serif",
          color: "var(--mk-fg)",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h3>
      <p
        className="mt-2 text-[14px] leading-relaxed"
        style={{ color: "var(--mk-fg-muted)" }}
      >
        {desc}
      </p>
    </article>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <article
      className="group relative overflow-hidden rounded-[22px] p-6 transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid var(--mk-border)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{ background: "rgba(234,67,53,0.04)" }}
      />
      <div
        className="relative mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
        style={{ background: "rgba(234,67,53,0.10)" }}
      >
        {icon}
      </div>
      <h3
        className="relative text-[16px] font-bold"
        style={{
          fontFamily:
            "var(--font-display), var(--font-inter), system-ui, sans-serif",
          color: "var(--mk-fg)",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h3>
      <p
        className="relative mt-1.5 text-[13.5px] leading-relaxed"
        style={{ color: "var(--mk-fg-muted)" }}
      >
        {desc}
      </p>
    </article>
  );
}

function UseCaseCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div
      className="rounded-[18px] p-6"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid var(--mk-border)",
      }}
    >
      <h4
        className="text-[16px] font-bold"
        style={{
          fontFamily:
            "var(--font-display), var(--font-inter), system-ui, sans-serif",
          color: "var(--mk-fg)",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h4>
      <p
        className="mt-2 text-[14px] leading-relaxed"
        style={{ color: "var(--mk-fg-muted)" }}
      >
        {desc}
      </p>
    </div>
  );
}

/* ─── Icons ─── */

function SendIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FF8A80"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 2L11 13" />
      <path d="M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FF8A80"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function ReplyIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FF8A80"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 14L4 9l5-5" />
      <path d="M4 9h10.5a5.5 5.5 0 015.5 5.5v0a5.5 5.5 0 01-5.5 5.5H11" />
    </svg>
  );
}

function DraftIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FF8A80"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function LabelIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FF8A80"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

function ThreadIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FF8A80"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      <path d="M8 10h.01" />
      <path d="M12 10h.01" />
      <path d="M16 10h.01" />
    </svg>
  );
}
