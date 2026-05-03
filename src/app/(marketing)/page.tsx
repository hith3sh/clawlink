import Image from "next/image";
import AudienceTabs from "@/components/AudienceTabs";
import { PricingCard } from "@/components/PricingCard";
import { MarketingIntegrationGrid } from "@/components/MarketingIntegrationGrid";

export default function Home() {
  return (
    <main className="flex-1">
      {/* ───── Hero ───── */}
      <section className="relative mx-auto max-w-[1120px] px-6 pt-14 pb-24 text-center">
        {/* Eyebrow pill */}
        <span
          className="mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold"
          style={{
            background: "rgba(224,53,43,0.10)",
            border: "1px solid rgba(224,53,43,0.28)",
            color: "#FFC8B6",
          }}
        >
          <Image src="/brand/bento/openclaw.png" alt="OpenClaw" width={18} height={18} priority className="rounded-full" />
          Built for OpenClaw
        </span>

        {/* Heading */}
        <h1
          className="mx-auto max-w-[880px] text-balance"
          style={{
            fontFamily: "var(--font-display), var(--font-inter), system-ui, sans-serif",
            fontWeight: 700,
            fontSize: "clamp(40px, 6vw, 60px)",
            lineHeight: 1.04,
            letterSpacing: "-0.025em",
            color: "var(--mk-fg)",
          }}
        >
          Plug your Openclaw into the{" "}
          <span className="mk-marked">rest of your stack</span>
        </h1>

        <p
          className="mx-auto mt-6 max-w-[600px] text-[16.5px] leading-relaxed"
          style={{ color: "var(--mk-fg-muted)" }}
        >
          ClawLink connects Gmail, Slack, Notion, GitHub, and 100+ apps to your
          Openclaw Bot
        </p>

        {/* Tabs + panels */}
        <div className="mt-10">
          {/* Hand-drawn annotation (desktop only, shown next to AI panel) */}
          <div className="pointer-events-none absolute -left-8 top-[400px] hidden w-[260px] text-left xl:block">
            <span
              className="block max-w-[200px] text-[26px] leading-tight"
              style={{
                fontFamily: "var(--font-caveat), cursive",
                fontWeight: 600,
                color: "#fff",
              }}
            >
              copy &amp; paste this onto openclaw chat
            </span>
            <svg
              viewBox="0 0 110 60"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="mt-2 ml-16 h-[84px] w-[154px]"
            >
              <path d="M6 6 Q 18 12 26 26 Q 32 38 50 42 Q 70 46 92 38" />
              <path d="M84 30 Q 90 35 94 38 Q 89 42 84 47" />
            </svg>
          </div>
          <AudienceTabs />
        </div>

        {/* 🎬 Video placeholder — replace with actual video component later */}
        <div
          className="mx-auto mt-14 flex aspect-video w-full max-w-[900px] items-center justify-center rounded-2xl"
          style={{
            background: "var(--mk-elev)",
            border: "1.5px dashed var(--mk-border)",
          }}
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--mk-fg-faint)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <path d="m10 8 6 4-6 4V8z" />
            </svg>
            <span className="text-sm" style={{ color: "var(--mk-fg-faint)" }}>
              Demo video — coming soon
            </span>
          </div>
        </div>
        {/* End video placeholder */}
      </section>

      {/* ───── Pillars ───── */}
      <div className="mx-auto max-w-[760px] px-6 pt-20 pb-10 text-center">
        <h2
          style={{
            fontFamily: "var(--font-display), var(--font-inter), system-ui, sans-serif",
            fontWeight: 700,
            fontSize: "clamp(32px, 4.4vw, 46px)",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            color: "var(--mk-fg)",
            textWrap: "balance",
          }}
        >
          One connection.{" "}
          <span className="mk-marked mk-marked--ember">Unlimited</span>{" "}
          possibilities.
        </h2>
        <p className="mt-3.5 text-[15px] leading-relaxed" style={{ color: "var(--mk-fg-muted)" }}>
          The messy parts of API integration — auth, refresh, retries, logging — handled for you.
        </p>
      </div>

      <section className="mx-auto grid max-w-[1080px] grid-cols-1 gap-4 px-6 md:grid-cols-3">
        <PillarCard
          icon={<BoltIcon />}
          title="Managed OAuth"
          desc='Click "Connect Slack." After you approve access, ClawLink stores the provider tokens encrypted at rest and refreshes them when needed.'
        />
        <PillarCard
          icon={<SparkleIcon />}
          title="Chat-native"
          desc="Ask in plain English. Your AI picks the right tool, fills the args, and runs it. ClawLink delivers the result."
        />
        <PillarCard
          icon={<CheckIcon />}
          title="Logs & retries built in"
          desc="Every call is logged with latency, status, and the args. Failed call? We retry with exponential backoff."
        />
      </section>

      {/* ───── Apps wall ───── */}
      <div className="mx-auto max-w-[760px] px-6 pt-20 pb-10 text-center">
        <h2
          style={{
            fontFamily: "var(--font-display), var(--font-inter), system-ui, sans-serif",
            fontWeight: 700,
            fontSize: "clamp(32px, 4.4vw, 46px)",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            color: "var(--mk-fg)",
            textWrap: "balance",
          }}
        >
          100+ apps, <span className="mk-marked">one connection</span>
        </h2>
        <p className="mt-3.5 text-[15px] leading-relaxed" style={{ color: "var(--mk-fg-muted)" }}>
          Connect once, then call any of these from chat — no provider-specific code.
        </p>
      </div>
      <section className="mx-auto max-w-[1080px] px-6 pb-20">
        <MarketingIntegrationGrid />
      </section>

      {/* ───── Trust ───── */}
      <section className="mx-auto max-w-[720px] px-6 py-16 text-center">
        <h2
          style={{
            fontFamily: "var(--font-display), var(--font-inter), system-ui, sans-serif",
            fontWeight: 700,
            fontSize: "36px",
            letterSpacing: "-0.02em",
            color: "var(--mk-fg)",
          }}
        >
          Privacy first
        </h2>
        <p className="mt-3 text-[14.5px]" style={{ color: "var(--mk-fg-muted)" }}>
          You choose which apps to connect. ClawLink stores provider credentials encrypted at
          rest, uses them only for requests you trigger through OpenClaw, and does not store API
          response contents.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-8">
          <Soc2Badge />
          <Iso27001Badge />
          <GdprBadge />
        </div>
      </section>

      {/* ───── Pricing ───── */}
      <section id="pricing" className="mx-auto max-w-[920px] px-6 pt-16 pb-24">
        <div className="mb-8 text-center">
          <h2
            style={{
              fontFamily: "var(--font-display), var(--font-inter), system-ui, sans-serif",
              fontWeight: 700,
              fontSize: "clamp(32px, 4.4vw, 46px)",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              color: "var(--mk-fg)",
              textWrap: "balance",
            }}
          >
            Simple pricing. No surprises.
          </h2>
          <p className="mt-3.5 text-[15px]" style={{ color: "var(--mk-fg-muted)" }}>
            Your first connected app is free. Pro is $4.99/month for the full integration catalog.
          </p>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2">
          <PricingCard
            dark
            eyebrow="Starter"
            title="Free"
            price="0"
            tagline="Try your first integration"
            features={[
              "1 integration included",
              "Managed OAuth connect flow",
              "Community support",
            ]}
            footnote="No card required."
            ctaLabel="Start free"
            ctaHref="/sign-up"
          />
          <PricingCard
            dark
            eyebrow="Pro"
            title="Pro"
            price="4.99"
            tagline="All integrations for $4.99/month"
            features={[
              "Every integration, unlimited",
              "Priority email support",
              "New integrations as they ship",
            ]}
            footnote="$4.99/month. Cancel anytime."
            ctaLabel="Get Pro"
            ctaHref="/sign-up"
            highlighted
          />

        </div>
      </section>

      {/* ───── Need Help ───── */}
      <section className="mx-auto max-w-[600px] px-6 pb-24 text-center">
        <h2
          className="text-2xl font-semibold"
          style={{
            fontFamily: "var(--font-display), var(--font-inter), system-ui, sans-serif",
            color: "var(--mk-fg)",
          }}
        >
          Need help getting started?
        </h2>
        <p className="mt-3 text-sm" style={{ color: "var(--mk-fg-muted)" }}>
          Join our Discord community. Real humans, real answers.
        </p>
        <a
          href="https://discord.gg/KjN3xcTvw4"
          target="_blank"
          rel="noopener noreferrer"
          className="mk-btn mt-6 inline-flex"
          style={{ background: "#5865F2", color: "#fff" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
          </svg>
          Join Discord
        </a>
      </section>
    </main>
  );
}

/* ─── Sub-components ─── */

function PillarCard({
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
      className="group relative overflow-hidden rounded-[22px] p-7 transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid var(--mk-border)",
      }}
    >
      {/* Hover overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{ background: "rgba(224,53,43,0.06)" }}
      />
      <div
        className="relative mb-5 flex h-11 w-11 items-center justify-center rounded-xl"
        style={{ background: "var(--brand)" }}
      >
        {icon}
      </div>
      <h3
        className="relative mb-2 text-lg font-bold tracking-tight"
        style={{
          fontFamily: "var(--font-display), var(--font-inter), system-ui, sans-serif",
          color: "var(--mk-fg)",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h3>
      <p className="relative text-[13.5px] leading-relaxed" style={{ color: "var(--mk-fg-muted)" }}>
        {desc}
      </p>
    </article>
  );
}

function Soc2Badge() {
  return (
    <div className="flex flex-col items-center gap-3">
      <svg width="80" height="96" viewBox="0 0 80 96" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M40 2 L76 20 V44 C76 68 40 92 40 92 C40 92 4 68 4 44 V20 L40 2Z"
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1.5"
        />
        <path
          d="M40 10 L68 24 V44 C68 63 40 82 40 82 C40 82 12 63 12 44 V24 L40 10Z"
          fill="none"
          stroke="var(--brand)"
          strokeWidth="1.5"
          strokeDasharray="3 2"
        />
        <text
          x="40"
          y="42"
          textAnchor="middle"
          fill="#fff"
          fontSize="16"
          fontWeight="800"
          fontFamily="var(--font-display), system-ui, sans-serif"
          letterSpacing="-0.02em"
        >
          SOC
        </text>
        <text
          x="40"
          y="58"
          textAnchor="middle"
          fill="var(--brand)"
          fontSize="18"
          fontWeight="800"
          fontFamily="var(--font-display), system-ui, sans-serif"
          letterSpacing="-0.02em"
        >
          2
        </text>
        <text
          x="40"
          y="72"
          textAnchor="middle"
          fill="var(--mk-fg-dim)"
          fontSize="9"
          fontWeight="600"
          fontFamily="var(--font-sans), system-ui, sans-serif"
          letterSpacing="0.08em"
        >
          TYPE II
        </text>
      </svg>
      <span className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--mk-fg-faint)" }}>
        Certified
      </span>
    </div>
  );
}

function Iso27001Badge() {
  return (
    <div className="flex flex-col items-center gap-3">
      <svg width="88" height="88" viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle
          cx="44"
          cy="44"
          r="42"
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1.5"
        />
        <circle
          cx="44"
          cy="44"
          r="34"
          fill="none"
          stroke="var(--brand)"
          strokeWidth="1.5"
          strokeDasharray="3 2"
        />
        <text
          x="44"
          y="38"
          textAnchor="middle"
          fill="#fff"
          fontSize="18"
          fontWeight="800"
          fontFamily="var(--font-display), system-ui, sans-serif"
          letterSpacing="-0.02em"
        >
          ISO
        </text>
        <text
          x="44"
          y="56"
          textAnchor="middle"
          fill="var(--brand)"
          fontSize="16"
          fontWeight="800"
          fontFamily="var(--font-display), system-ui, sans-serif"
          letterSpacing="-0.02em"
        >
          27001
        </text>
      </svg>
      <span className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--mk-fg-faint)" }}>
        Certified
      </span>
    </div>
  );
}

function GdprBadge() {
  return (
    <div className="flex flex-col items-center gap-3">
      <svg width="80" height="96" viewBox="0 0 80 96" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M40 2 L76 20 V48 C76 72 40 92 40 92 C40 92 4 72 4 48 V20 L40 2Z"
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1.5"
        />
        <path
          d="M40 10 L68 26 V48 C68 67 40 82 40 82 C40 82 12 67 12 48 V26 L40 10Z"
          fill="none"
          stroke="var(--brand)"
          strokeWidth="1.5"
          strokeDasharray="3 2"
        />
        <text
          x="40"
          y="44"
          textAnchor="middle"
          fill="#fff"
          fontSize="17"
          fontWeight="800"
          fontFamily="var(--font-display), system-ui, sans-serif"
          letterSpacing="-0.01em"
        >
          GDPR
        </text>
        <text
          x="40"
          y="62"
          textAnchor="middle"
          fill="var(--brand)"
          fontSize="11"
          fontWeight="700"
          fontFamily="var(--font-sans), system-ui, sans-serif"
          letterSpacing="0.06em"
        >
          COMPLIANT
        </text>
      </svg>
      <span className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--mk-fg-faint)" }}>
        Ready
      </span>
    </div>
  );
}

/* ─── Sketch-style SVG icons (matching design system) ─── */

function BoltIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 48 64" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M28 4 L 8 34 L 22 34 L 18 60 L 40 28 L 26 28 L 30 4 Z" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 64 64" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M32 6 Q 34 26 50 30 Q 34 34 32 56 Q 30 34 14 30 Q 30 26 32 6 Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 64 64" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M52 10 Q 60 22 58 34 Q 55 50 40 56 Q 24 60 14 50 Q 4 38 8 24 Q 14 10 30 8 Q 42 7 52 12" />
      <path d="M18 32 Q 24 38 28 42 Q 36 30 46 22" />
    </svg>
  );
}
