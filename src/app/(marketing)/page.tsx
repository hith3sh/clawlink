
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
      <section className="pt-16 pb-8 px-6">
        <VisualEquation />
      </section>

      {/* Hero */}
      <section className="flex flex-col items-center pb-24 px-6 relative">
        {/* Ambient background effect */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/8 rounded-full blur-3xl" />
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-amber-400/5 rounded-full blur-2xl" />
        </div>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-center max-w-3xl text-gray-900 relative">
          Plug anything into{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 relative">
            OpenClaw.
            <span className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 blur-xl opacity-30" />
          </span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-gray-500 text-center max-w-xl leading-relaxed">
          Install ClawLink once, then connect apps with one click.
          <span className="text-gray-700 font-medium">Gmail, Slack, GitHub, Notion, Stripe</span>, and 40+ more.
        </p>

        <div className="mt-8 w-full max-w-md">
          <CopyCommand />
        </div>
      </section>

      {/* Integrations search */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <IntegrationGrid />
      </section>

      {/* Pain Math — why ClawLink */}
      <section className="py-24 px-6 relative overflow-hidden">
        {/* Subtle texture background */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }} />

        <div className="max-w-4xl mx-auto relative">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-3 tracking-tight">
            Stop wasting time on API plumbing
          </h2>
          <p className="text-center text-gray-500 mb-12 text-lg">
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
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50" />
        <div className="max-w-5xl mx-auto relative">
          <Testimonials />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6">
        <FAQ />
      </section>

      {/* Documentation */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gray-50" />
        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">
            Read the Docs
          </h2>
          <p className="text-gray-500 mb-10 max-w-xl mx-auto text-lg leading-relaxed">
            Learn how to set up ClawLink, connect integrations, and use every
            hosted connection flow available through the OpenClaw plugin.
          </p>
          <a
            href="https://docs.claw-link.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-xl bg-gray-900 text-white px-7 py-3.5 font-medium hover:bg-gray-800 transition-all duration-200 hover:scale-105"
          >
            View Documentation
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </a>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 px-6 overflow-hidden">
        {/* Rich gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-amber-950" />
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px', color: 'rgba(251, 191, 36, 0.3)' }} />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />

        <div className="max-w-2xl mx-auto text-center relative">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
            Ready to supercharge OpenClaw?
          </h2>
          <p className="text-gray-300 mb-10 text-lg">
            Install once. Connect with one click. Use anywhere.
          </p>
          <div className="inline-flex items-center gap-3 rounded-xl bg-amber-500/10 backdrop-blur-sm border border-amber-500/20 px-6 py-4 font-mono text-sm text-amber-100">
            <span className="text-amber-500/60">$</span>
            <span>{OPENCLAW_PLUGIN_INSTALL_COMMAND}</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50/50 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2.5">
            <Image
              src="/openclaw-lobster.svg"
              alt="OpenClaw"
              width={16}
              height={16}
            />
            <span className="font-medium text-gray-500">ClawLink</span>
          </div>
          <span className="text-gray-400">The easiest way to add integrations to OpenClaw</span>
          <div className="flex items-center gap-5">
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
