import Image from "next/image";
import Link from "next/link";
import AudienceTabs from "@/components/AudienceTabs";
import FlowDiagram from "@/components/FlowDiagram";
import { PricingCard } from "@/components/PricingCard";
import { MarketingIntegrationGrid } from "@/components/MarketingIntegrationGrid";

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

        <div className="relative mt-8">
          {/* Copy & paste annotation */}
          <div className="pointer-events-none absolute -left-4 top-4 hidden w-[260px] lg:block xl:-left-10 xl:w-[290px]">
            <Image
              src="/images/copyandpaste.png"
              alt="copy & paste this onto openclaw chat"
              width={440}
              height={330}
              className="w-full"
            />
          </div>
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

      {/* Integrations grid */}
      <section className="mx-auto max-w-[1100px] px-6 py-16">
        <MarketingIntegrationGrid />
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
            title="Pro"
            price="7.99"
            tagline="All 40+ integrations unlocked"
            features={[
              "Every integration, unlimited",
              "Priority email support",
              "New integrations as they ship",
            ]}
            footnote="Cancel anytime."
            ctaLabel="Get Pro"
            ctaHref="/sign-up"
            highlighted
          />
        </div>
      </section>

    </main>
  );
}
