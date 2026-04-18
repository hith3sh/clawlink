import Image from "next/image";
import Link from "next/link";
import {
  CLAWLINK_API_SETTINGS_URL,
  CLAWLINK_GITHUB_URL,
  CLAWLINK_NPM_URL,
  CLAWLINK_OPENCLAW_DOCS_URL,
  CLAWLINK_VERIFY_URL,
  OPENCLAW_PLUGIN_INSTALL_COMMAND,
  OPENCLAW_PLUGIN_PACKAGE,
} from "@/lib/openclaw-plugin";

const AVATARS = Array.from({ length: 10 }, (_, i) => `/brand/avatars/avatar-${i + 1}.png`);

export default function Home() {
  return (
    <main className="flex-1 bg-white">
      {/* Hero */}
      <section className="relative mx-auto max-w-[1200px] px-6 pt-6 pb-20">
        {/* Left sticker: Notion widget with handwritten label */}
        <div className="pointer-events-none absolute left-2 top-6 hidden w-[200px] lg:block">
          <Image
            src="/brand/bento/widget-notion.png"
            alt=""
            width={183}
            height={183}
            className="drop-shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
          />
          <p
            className="mt-1 text-center text-xl leading-tight text-gray-900"
            style={{ fontFamily: "var(--font-caveat), 'Comic Sans MS', cursive" }}
          >
            check my
            <br />
            notion pages
          </p>
        </div>
        {/* Right sticker: Docs widget with handwritten label */}
        <div className="pointer-events-none absolute right-2 top-6 hidden w-[200px] lg:block">
          <Image
            src="/brand/bento/widget-docs.png"
            alt=""
            width={183}
            height={183}
            className="ml-auto drop-shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
          />
          <p
            className="mt-1 text-center text-xl leading-tight text-gray-900"
            style={{ fontFamily: "var(--font-caveat), 'Comic Sans MS', cursive" }}
          >
            connect to
            <br />
            google docs
          </p>
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

        {/* Copy-and-paste annotation + setup card */}
        <div className="relative mt-16">
          <div className="pointer-events-none absolute -left-2 -top-14 hidden w-[280px] md:block lg:-left-6">
            <p
              className="text-2xl leading-tight text-gray-900"
              style={{ fontFamily: "var(--font-caveat), 'Comic Sans MS', cursive" }}
            >
              copy &amp; paste this
              <br />
              onto openclaw chat
            </p>
            <Image
              src="/brand/bento/arrow-big.png"
              alt=""
              width={209}
              height={209}
              className="ml-28 -mt-4 h-28 w-28"
            />
          </div>

          <div className="mx-auto max-w-3xl rounded-[28px] border border-gray-200 bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] sm:p-10">
            <p className="text-[15px] leading-[1.9] text-gray-700">
              ClawLink setup for OpenClaw — third-party plugin, not affiliated with OpenClaw. Verify the package at{" "}
              <a
                href={CLAWLINK_NPM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-gray-900 underline"
              >
                {OPENCLAW_PLUGIN_PACKAGE}
              </a>{" "}
              or{" "}
              <a
                href={CLAWLINK_GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-900 underline"
              >
                github.com/hith3sh/clawlink
              </a>
              . Releases are published with an npm provenance attestation in the public Sigstore transparency log — see{" "}
              <a
                href={CLAWLINK_VERIFY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-900 underline"
              >
                claw-link.dev/verify
              </a>
              .{" "}
              <span className="font-semibold text-gray-900">Step 1</span> — install the plugin:{" "}
              <span className="font-mono text-gray-900">{OPENCLAW_PLUGIN_INSTALL_COMMAND}</span>.{" "}
              <span className="font-semibold text-gray-900">Step 2</span> — create an API key at{" "}
              <a
                href={CLAWLINK_API_SETTINGS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-gray-900 underline"
              >
                claw-link.dev/dashboard/settings?tab=api
              </a>
              .{" "}
              <span className="font-semibold text-gray-900">Step 3</span> — open the ClawLink plugin&apos;s settings inside OpenClaw and paste the API key into the{" "}
              <span className="font-mono text-gray-900">ClawLink API key</span> field. The key is stored locally in{" "}
              <span className="font-mono text-gray-900">~/.openclaw/openclaw.json</span> and is only sent to{" "}
              <span className="font-mono text-gray-900">claw-link.dev</span>. Docs:{" "}
              <a
                href={CLAWLINK_OPENCLAW_DOCS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-900 underline"
              >
                docs.claw-link.dev/openclaw
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Diagram */}
      <section className="mx-auto max-w-[1100px] px-6 py-16">
        <h2 className="mb-10 text-center text-xl font-semibold text-gray-900 sm:text-2xl">
          claw-link helps openclaw to connect to 3rd party tools with a single click
        </h2>
        <div className="rounded-[28px] border border-gray-200 bg-white p-8">
          <Image
            src="/brand/bento/diagram.png"
            alt="ClawLink connects OpenClaw to third-party tools"
            width={1160}
            height={977}
            className="mx-auto w-full max-w-[900px]"
            priority
          />
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
        <h2 className="text-4xl font-bold leading-[1.15] tracking-tight text-gray-900 sm:text-5xl">
          Give access to Your
          <br />
          <span className="text-gray-900">email, calendar, youtube,</span>
          <br />
          <span className="bg-gradient-to-b from-gray-400 to-gray-200 bg-clip-text text-transparent">
            social media , websites,
          </span>
          <br />
          <span className="bg-gradient-to-b from-gray-300 to-white bg-clip-text text-transparent">payments</span>
        </h2>
        <p className="mx-auto mt-10 max-w-xl text-base text-gray-500">
          All your content integrated into your personal page.
          <br />
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
      <section className="mx-auto max-w-[900px] px-6 py-16 text-center">
        <h2 className="mb-12 text-3xl font-bold text-gray-900">Pricing</h2>
        <div className="grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-2">
          <PricingCard
            title="Free"
            price="0"
            features={["1 integration only"]}
            footnote="No card required."
          />
          <PricingCard
            title="Cheap"
            price="5"
            features={["All integrations", "Email support"]}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-[1200px] px-6 py-20 text-center">
        <Image
          src="/brand/bento/footer-claw.png"
          alt="ClawLink"
          width={65}
          height={65}
          className="mx-auto h-16 w-16"
        />
        <div className="mt-4 text-sm font-medium text-gray-900">Built for Agents</div>
        <nav className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-gray-500">
          <Link href="/about" className="transition hover:text-gray-900">
            About us
          </Link>
          <Link href="/changelog" className="transition hover:text-gray-900">
            Changelog
          </Link>
          <a href={CLAWLINK_OPENCLAW_DOCS_URL} target="_blank" rel="noopener noreferrer" className="transition hover:text-gray-900">
            Docs
          </a>
          <Link href="/explore" className="transition hover:text-gray-900">
            Explore
          </Link>
          <Link href="/privacy" className="transition hover:text-gray-900">
            Privacy Policy
          </Link>
        </nav>
      </footer>
    </main>
  );
}

function BentoGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:[grid-template-columns:175fr_390fr_390fr]">
      {/* Column 1 — narrow */}
      <div className="flex flex-col gap-4">
        <BentoTile src="/brand/bento/col1-tile1-175.png" alt="Buy me a coffee" aspect="1/1" />
        <BentoTile src="/brand/bento/col1-tile2-tall.png" alt="Medium article" aspect="175/389" />
        <BentoTile src="/brand/bento/col1-tile3-spotify.png" alt="Spotify playlist" aspect="175/389" />
      </div>
      {/* Column 2 — wide */}
      <div className="flex flex-col gap-4">
        <BentoTile src="/brand/bento/col2-tile1.png" alt="Widget" aspect="390/175" />
        <BentoTile src="/brand/bento/col2-tile2.png" alt="App store widget" aspect="390/175" />
        <BentoTile src="/brand/bento/col2-tile3-think.png" alt="Think Different" aspect="1/1" />
        <BentoTile src="/brand/bento/col2-tile4-calendly.png" alt="Calendly" aspect="1/1" />
        <BentoTile src="/brand/bento/col2-tile5-medium.png" alt="Medium photo" aspect="390/200" />
      </div>
      {/* Column 3 — wide */}
      <div className="flex flex-col gap-4">
        <BentoTile src="/brand/bento/col3-tile1-youtube.png" alt="YouTube" aspect="1/1" />
        <BentoTile src="/brand/bento/col3-tile2-github.png" alt="GitHub contributions" aspect="390/174" />
        <BentoTile src="/brand/bento/col3-tile3-link.png" alt="Link preview" aspect="1/1" />
        <BentoTile src="/brand/bento/col3-tile4-map.png" alt="Map" aspect="1/1" />
      </div>
    </div>
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
  title,
  price,
  features,
  footnote,
}: {
  title: string;
  price: string;
  features: string[];
  footnote?: string;
}) {
  return (
    <div className="flex h-[518px] w-full max-w-[364px] flex-col items-center rounded-3xl bg-white px-10 pt-14 pb-10 shadow-[0_8px_40px_rgba(0,0,0,0.06)] ring-1 ring-gray-100">
      <h3 className="text-3xl font-bold text-gray-900">{title}</h3>
      <div className="mt-8 flex items-baseline gap-2">
        <span className="text-5xl font-bold text-gray-900">${price}</span>
        <span className="text-xl text-gray-500">/ mo</span>
      </div>
      <ul className="mt-10 w-full divide-y divide-gray-200 border-y border-gray-200">
        {features.map((f) => (
          <li key={f} className="py-4 text-center text-lg text-gray-800">
            {f}
          </li>
        ))}
      </ul>
      <div className="mt-auto flex w-full flex-col items-center gap-4">
        {footnote && <p className="text-sm font-semibold text-gray-900">{footnote}</p>}
        <Link
          href="/sign-up"
          className="inline-flex w-full items-center justify-center rounded-xl bg-gray-900 px-6 py-4 text-base font-semibold text-white transition hover:bg-gray-800"
        >
          Get Started Now
        </Link>
      </div>
    </div>
  );
}
