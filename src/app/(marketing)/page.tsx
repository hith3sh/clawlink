
import Image from "next/image";
import CopyCommand from "@/components/CopyCommand";
import VisualEquation from "@/components/VisualEquation";
import IntegrationGrid from "@/components/IntegrationGrid";
import PainMath from "@/components/PainMath";
import VideoSection from "@/components/VideoSection";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import { OPENCLAW_PLUGIN_INSTALL_COMMAND } from "@/lib/openclaw-plugin";

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
          Install ClawLink once, then connect apps with one click.
          Gmail, Slack, GitHub, Notion, Stripe, and more without API setup pain.
        </p>

        <div className="mt-8 w-full max-w-md">
          <CopyCommand />
        </div>

        <p className="mt-3 text-sm text-gray-400">
          Then send `/clawlink login &lt;apiKey&gt;` in OpenClaw and say “connect my Slack”.
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

      {/* Documentation */}
      <section className="bg-gray-900 py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-3">
            Read the Docs
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Learn how to set up ClawLink, connect integrations, and use every
            hosted connection flow available through the OpenClaw plugin.
          </p>
          <a
            href="https://docs.claw-link.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-white text-gray-900 px-6 py-3 font-medium hover:bg-gray-100 transition-colors"
          >
            View Documentation
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </a>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-red-500 to-orange-500 py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to supercharge OpenClaw?
          </h2>
          <p className="text-white/80 mb-8">
            Install once. Connect with one click. Use anywhere.
          </p>
          <div className="inline-flex items-center gap-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 px-5 py-3 font-mono text-sm text-white">
            <span className="text-white/60">$</span>
            <span>{OPENCLAW_PLUGIN_INSTALL_COMMAND}</span>
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
