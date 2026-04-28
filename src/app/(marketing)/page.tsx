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
              Let your AI assistant actually do things
            </h1>
          </div>
          <p className="mt-6 max-w-lg text-base text-gray-500">
            Connect Gmail, Slack, Notion, and 40+ apps to OpenClaw in one click.
            No coding. No setup headaches. Just chat.
          </p>
          <p className="mt-3 text-sm text-gray-400">
            <a href="https://openclaw.ai/" target="_blank" rel="noopener noreferrer" className="font-medium text-gray-500 underline hover:text-gray-700">What is OpenClaw?</a>{" "}
            It is the AI assistant that runs on your computer. ClawLink gives it superpowers.
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
          <span className="block">One connection.</span>
          <span className="block">Unlimited possibilities.</span>
        </h2>
        <p className="mx-auto mt-10 max-w-xl text-base text-gray-500">
          Connect once, then ask your AI to do anything across your apps.
          No more switching between tabs or copy-pasting.
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

      {/* Need Help */}
      <section className="mx-auto max-w-[600px] px-6 py-16 text-center">
        <h2 className="text-2xl font-semibold text-gray-900">Need help getting started?</h2>
        <p className="mt-3 text-gray-500">
          Join our Discord community. Real humans, real answers.
        </p>
        <a
          href="https://discord.gg/KjN3xcTvw4"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#5865F2] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#4752C4]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
          </svg>
          Join Discord
        </a>
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
