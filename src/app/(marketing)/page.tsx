import Image from "next/image";
import Link from "next/link";
import AudienceTabs from "@/components/AudienceTabs";
import FlowDiagram from "@/components/FlowDiagram";

const AVATARS = Array.from({ length: 9 }, (_, i) => `/brand/avatars/avatar-${i + 1}.png`);

export default function Home() {
  return (
    <main className="flex-1 bg-white">
      {/* Hero */}
      <section className="relative mx-auto max-w-[1200px] px-6 pt-6 pb-20">
        {/* Left sticker: Notion label */}
        <div className="pointer-events-none absolute -left-16 top-24 hidden lg:block">
          <Image
            src="/brand/bento/widget-notion-label.png"
            alt="check my notion pages"
            width={240}
            height={94}
          />
        </div>
        {/* Right sticker: Docs label */}
        <div className="pointer-events-none absolute -right-16 top-24 hidden lg:block">
          <Image
            src="/brand/bento/widget-docs-label.png"
            alt="connect to google docs"
            width={240}
            height={94}
          />
        </div>

        {/* Main heading */}
        <div className="mt-10 flex flex-col items-center text-center">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Image
              src="/brand/bento/openclaw.png"
              alt="OpenClaw"
              width={120}
              height={120}
              priority
              className="h-20 w-20 sm:h-28 sm:w-28"
            />
            <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-[56px] lg:leading-[1.1]">
              Your Openclaw is nothing without access to tools
            </h1>
          </div>
          <p className="mt-6 text-base text-gray-500">
            We give you the tools you need, removing the extra hassle
          </p>
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-[13px] leading-6 text-gray-500">
          <span className="font-medium text-gray-700">For AI agents:</span>{" "}
          read{" "}
          <a
            href="/skill.md"
            className="font-mono text-[var(--brand-hover)] underline decoration-[var(--brand)]/40 underline-offset-4 hover:decoration-[var(--brand)]"
          >
            claw-link.dev/skill.md
          </a>{" "}
          and follow the instructions to use ClawLink for third-party integrations.
        </p>

        <div className="mt-8">
          <AudienceTabs />
        </div>
      </section>

      {/* Diagram */}
      <section className="mx-auto max-w-[1100px] px-6 py-16">
        <h2 className="mb-10 text-center text-xl font-semibold text-gray-900 sm:text-2xl">
          claw-link helps openclaw to connect to 3rd party tools with a single click
        </h2>
        <div className="rounded-[28px] border border-gray-200 bg-white p-4 sm:p-8">
          <FlowDiagram />
        </div>
      </section>

      {/* Social proof */}
      <section className="mx-auto max-w-[900px] px-6 py-16 text-center">
        <h3 className="mb-8 text-2xl font-semibold text-gray-900">Loved by 100+ users</h3>
        <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
          {AVATARS.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt=""
              width={48}
              height={48}
              className="h-12 w-12 rounded-full border-2 border-white shadow-sm"
              priority={i < 4}
            />
          ))}
        </div>
        <Link
          href="/sign-up"
          className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-900 shadow-sm transition hover:border-gray-300"
        >
          <span aria-hidden>→</span>
          Get started
        </Link>
      </section>

      {/* Give access to Your... */}
      <section className="mx-auto max-w-[900px] px-6 pt-16 pb-10 text-center">
        <h2 className="text-3xl font-bold leading-[1.15] tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
          <span className="block">Give access to Your</span>
          <span className="block text-gray-900">email, calendar, youtube,</span>
          <span className="block bg-gradient-to-b from-gray-400 to-gray-200 bg-clip-text text-transparent">
            social media, websites,
          </span>
          <span className="block bg-gradient-to-b from-gray-300 to-white bg-clip-text text-transparent">payments</span>
        </h2>
        <p className="mx-auto mt-10 max-w-xl text-base text-gray-500">
          All your content integrated into your personal page.
          No more hiding your content behind links.
        </p>
      </section>

      {/* Bento grid */}
      <section className="mx-auto max-w-[1200px] px-6 py-16">
        <BentoGrid />
      </section>

      {/* Privacy First */}
      <section className="mx-auto max-w-[900px] px-6 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900">Privacy First</h2>
        <p className="mt-4 text-sm text-gray-500">
          Nobody other than you should have access to your data — claw-link never sees your emails, chats, or anything
          else.
        </p>
        <div className="mt-10 flex items-center justify-center gap-10">
          <Image src="/brand/bento/aicpa-soc.png" alt="AICPA SOC" width={158} height={158} className="h-32 w-32" />
          <Image src="/brand/bento/iso-27001.png" alt="ISO 27001" width={127} height={127} className="h-28 w-28" />
        </div>
      </section>

      {/* Pricing */}
      <section className="relative mx-auto max-w-[1040px] px-6 py-24">
        {/* Warm atmospheric glow behind the highlighted card */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-24 -z-10 mx-auto h-[420px] max-w-[720px]"
          style={{
            background:
              "radial-gradient(60% 60% at 75% 40%, rgb(var(--brand-rgb) / 0.18) 0%, rgb(var(--brand-rgb) / 0) 70%)",
          }}
        />
        <div className="mb-14 flex flex-col items-center text-center">
          <span
            className="text-sm uppercase tracking-[0.28em] text-gray-500"
            style={{ fontFeatureSettings: '"ss01"' }}
          >
            Pricing
          </span>
          <h2 className="mt-3 max-w-xl text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-[44px]">
            Simple pricing. No surprises.
          </h2>
          <p className="mt-4 max-w-md text-base text-gray-500">
            Start free with your first app. Upgrade when you&apos;re ready for the full set.
          </p>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">
          <PricingCard
            eyebrow="Starter"
            title="Free"
            price="0"
            tagline="Try your first integration"
            features={["1 integration included", "Hosted OAuth connect flow", "Community support"]}
            footnote="No card required."
            ctaLabel="Start free"
            ctaHref="/sign-up"
          />
          <PricingCard
            eyebrow="Most popular"
            title="Cheap"
            price="5"
            tagline="All 40+ integrations unlocked"
            features={[
              "Every integration, unlimited",
              "Priority email support",
              "New integrations as they ship",
            ]}
            footnote="Cancel anytime."
            ctaLabel="Get Cheap"
            ctaHref="/sign-up"
            highlighted
          />
        </div>
      </section>

    </main>
  );
}

const MOBILE_BENTO_TILES = [
  { src: "/brand/bento/col2-tile3-think.png", alt: "Think Different" },
  { src: "/brand/bento/col3-tile1-youtube.png", alt: "YouTube" },
  { src: "/brand/bento/col1-tile1-175.png", alt: "Buy me a coffee" },
  { src: "/brand/bento/col3-tile3-link.png", alt: "Link preview" },
  { src: "/brand/bento/col2-tile4-calendly.png", alt: "Calendly" },
  { src: "/brand/bento/col3-tile4-map.png", alt: "Map" },
];

function BentoGrid() {
  return (
    <>
      {/* Mobile: 2-column square grid */}
      <div className="grid grid-cols-2 gap-3 sm:hidden">
        {MOBILE_BENTO_TILES.map(({ src, alt }) => (
          <div key={src} className="aspect-square overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <Image src={src} alt={alt} width={400} height={400} className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
      {/* Desktop: original 3-column bento */}
      <div className="hidden sm:grid sm:gap-5 sm:[grid-template-columns:175fr_390fr_390fr]">
        {/* Column 1 — narrow */}
        <div className="flex flex-col gap-4 sm:gap-5">
          <BentoTile src="/brand/bento/col1-tile1-175.png" alt="Buy me a coffee" aspect="1/1" />
          <BentoTile src="/brand/bento/col1-tile2-tall.png" alt="Medium article" aspect="175/389" />
          <BentoTile src="/brand/bento/col1-tile3-spotify.png" alt="Spotify playlist" aspect="175/389" />
        </div>
        {/* Column 2 — wide */}
        <div className="flex flex-col gap-4 sm:gap-5">
          <BentoTile src="/brand/bento/col2-tile1.png" alt="Widget" aspect="390/175" />
          <BentoTile src="/brand/bento/col2-tile2.png" alt="App store widget" aspect="390/175" />
          <BentoTile src="/brand/bento/col2-tile3-think.png" alt="Think Different" aspect="1/1" />
          <BentoTile src="/brand/bento/col2-tile4-calendly.png" alt="Calendly" aspect="1/1" />
          <BentoTile src="/brand/bento/col2-tile5-medium.png" alt="Medium photo" aspect="390/200" />
        </div>
        {/* Column 3 — wide */}
        <div className="flex flex-col gap-4 sm:gap-5">
          <BentoTile src="/brand/bento/col3-tile1-youtube.png" alt="YouTube" aspect="1/1" />
          <BentoTile src="/brand/bento/col3-tile2-github.png" alt="GitHub contributions" aspect="390/174" />
          <BentoTile src="/brand/bento/col3-tile3-link.png" alt="Link preview" aspect="1/1" />
          <BentoTile src="/brand/bento/col3-tile4-map.png" alt="Map" aspect="1/1" />
        </div>
      </div>
    </>
  );
}

function BentoTile({ src, alt, aspect }: { src: string; alt: string; aspect: string }) {
  return (
    <div
      className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
      style={{ aspectRatio: aspect }}
    >
      <Image src={src} alt={alt} width={800} height={800} className="h-full w-full object-cover" />
    </div>
  );
}

function PricingCard({
  eyebrow,
  title,
  price,
  tagline,
  features,
  footnote,
  ctaLabel,
  ctaHref,
  highlighted = false,
}: {
  eyebrow: string;
  title: string;
  price: string;
  tagline: string;
  features: string[];
  footnote?: string;
  ctaLabel: string;
  ctaHref: string;
  highlighted?: boolean;
}) {
  const containerClass = highlighted
    ? "relative flex w-full flex-col rounded-[28px] bg-white p-8 ring-1 ring-[var(--brand)]/40 shadow-[0_24px_60px_-20px_rgb(var(--brand-rgb)_/_0.35),0_6px_20px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_34px_70px_-20px_rgb(var(--brand-rgb)_/_0.4),0_8px_24px_rgba(15,23,42,0.05)] sm:p-10"
    : "relative flex w-full flex-col rounded-[28px] bg-white p-8 ring-1 ring-gray-200/80 shadow-[0_2px_4px_rgba(15,23,42,0.02),0_12px_28px_-10px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_14px_rgba(15,23,42,0.04),0_22px_44px_-14px_rgba(15,23,42,0.1)] sm:p-10";

  return (
    <div className={containerClass}>
      {highlighted ? (
        <div className="absolute -top-3 left-8 inline-flex items-center gap-1.5 rounded-full bg-[var(--brand)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_6px_16px_rgb(var(--brand-rgb)_/_0.35)]">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          {eyebrow}
        </div>
      ) : (
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
          {eyebrow}
        </span>
      )}

      <h3
        className={`text-2xl font-semibold tracking-tight ${highlighted ? "mt-2" : "mt-3"} text-gray-900`}
      >
        {title}
      </h3>
      <p className="mt-2 text-sm text-gray-500">{tagline}</p>

      <div className="mt-6 flex items-baseline gap-2">
        <span className="text-[22px] font-medium text-gray-400">$</span>
        <span className="text-6xl font-bold leading-none tracking-tight text-gray-900">
          {price}
        </span>
        <span className="pb-1 text-sm text-gray-500">/ month</span>
      </div>

      <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      <ul className="mt-6 space-y-3.5">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-[15px] leading-6 text-gray-700">
            <span
              aria-hidden="true"
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
              style={{
                backgroundColor: highlighted ? "rgb(var(--brand-rgb) / 0.12)" : "#f3f4f6",
                color: highlighted ? "var(--brand)" : "#111827",
              }}
            >
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path
                  d="M2.5 6.3L5 8.8L9.5 3.2"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex flex-col gap-3 pt-2">
        <Link
          href={ctaHref}
          className={
            highlighted
              ? "inline-flex w-full items-center justify-center rounded-2xl bg-[var(--brand)] px-6 py-3.5 text-[15px] font-semibold text-white shadow-[0_10px_24px_-6px_rgb(var(--brand-rgb)_/_0.5)] transition hover:bg-[var(--brand-hover-alt)]"
              : "inline-flex w-full items-center justify-center rounded-2xl bg-gray-900 px-6 py-3.5 text-[15px] font-semibold text-white transition hover:bg-gray-800"
          }
        >
          {ctaLabel}
          <svg
            className="ml-2 h-4 w-4 transition group-hover:translate-x-0.5"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3.5 8h9m0 0L8 3.5M12.5 8L8 12.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
        {footnote ? (
          <p className="text-center text-xs text-gray-400">{footnote}</p>
        ) : null}
      </div>
    </div>
  );
}
