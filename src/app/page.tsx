
import Image from "next/image";
import CopyCommand from "@/components/CopyCommand";
import VisualEquation from "@/components/VisualEquation";
import IntegrationGrid from "@/components/IntegrationGrid";
import PainMath from "@/components/PainMath";
import VideoSection from "@/components/VideoSection";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";

export default function Home() {
  return (
    <main className="flex-1">
      {/* Visual Equation — top */}
      <section className="pt-12 pb-6 px-6">
        <VisualEquation />
      </section>

      {/* Hero */}
      <section className="flex flex-col items-center pb-20 px-6">
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-center max-w-3xl text-gray-900">
          Plug anything into{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
            OpenClaw.
          </span>
        </h1>
        <p className="mt-4 text-lg text-gray-500 text-center max-w-xl">
          One command. 40+ integrations. Gmail, Slack, Stripe, and more —
          ready in seconds, zero config.
        </p>

        <div className="mt-8 w-full max-w-md">
          <CopyCommand />
        </div>

        <p className="mt-3 text-sm text-gray-400">
          Paste this into OpenClaw and you&apos;re done.
        </p>
      </section>

      {/* Integrations search */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <IntegrationGrid />
      </section>

      {/* Pain Math — why ClawLink */}
      <section className="bg-gray-50 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">
            Stop wasting time on API plumbing
          </h2>
          <p className="text-center text-gray-500 mb-12">
            Every integration built from scratch costs you hours you&apos;ll never get back
          </p>
          <PainMath />
        </div>
      </section>

      {/* Video */}
      <section className="py-24 px-6">
        <VideoSection />
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <Testimonials />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6">
        <FAQ />
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-red-500 to-orange-500 py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to supercharge OpenClaw?
          </h2>
          <p className="text-white/80 mb-8">
            One command. Every API. Zero friction.
          </p>
          <div className="inline-flex items-center gap-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 px-5 py-3 font-mono text-sm text-white">
            <span className="text-white/60">$</span>
            <span>npx clawlink@latest init</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Image
              src="/openclaw-lobster.svg"
              alt="OpenClaw"
              width={16}
              height={16}
            />
            <span>ClawLink</span>
          </div>
          <span>The easiest way to add integrations to OpenClaw</span>
          <div className="flex items-center gap-4">
            <a href="https://github.com/hith3sh/clawlink" className="hover:text-gray-600 transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
// edge runtime
