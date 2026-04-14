
import Image from "next/image";
import Link from "next/link";
import CopyCommand from "@/components/CopyCommand";
import VisualEquation from "@/components/VisualEquation";
import IntegrationGrid from "@/components/IntegrationGrid";
import PainMath from "@/components/PainMath";
import VideoSection from "@/components/VideoSection";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import { CLAWLINK_OPENCLAW_DOCS_URL } from "@/lib/openclaw-plugin";

export default function Home() {
  return (
    <main className="flex-1">
      {/* Visual Equation — top */}
      <section className="pt-16 pb-8 px-6">
        <VisualEquation />
      </section>

      {/* Hero */}
      <section className="flex flex-col items-center pb-24 px-6 relative">
        {/* Warm ambient background */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#ffe4cc]/20 rounded-full blur-3xl" />
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#ffe4cc]/10 rounded-full blur-2xl" />
        </div>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-center max-w-3xl text-gray-900 relative">
          Plug anything into{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e8915a] to-[#d4764a] relative">
            OpenClaw.
            <span className="absolute inset-0 bg-gradient-to-r from-[#e8915a] to-[#d4764a] blur-xl opacity-20" />
          </span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-gray-500 text-center max-w-2xl leading-relaxed">
          Copy the official ClawLink setup prompt into chat. It uses the first-party plugin and then sends you to the dashboard API key step.
        </p>

        <div className="mt-8 w-full max-w-2xl">
          <CopyCommand />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm text-gray-500">
          <a
            href={CLAWLINK_OPENCLAW_DOCS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-gray-200 bg-white px-4 py-2 hover:border-[#e8915a]/30 hover:text-gray-700 transition-colors"
          >
            Setup docs
          </a>
          <a
            href="https://www.npmjs.com/package/@useclawlink/openclaw-plugin"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-gray-200 bg-white px-4 py-2 hover:border-[#e8915a]/30 hover:text-gray-700 transition-colors"
          >
            View npm package
          </a>
        </div>

        {/* Trust badge */}
        <div className="mt-10 flex items-center gap-2 text-sm text-gray-400">
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full bg-[#ffe4cc] border-2 border-white flex items-center justify-center text-[10px] font-bold text-[#d4764a]">H</div>
              <div className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-500">M</div>
              <div className="w-7 h-7 rounded-full bg-[#ffe4cc] border-2 border-white flex items-center justify-center text-[10px] font-bold text-[#d4764a]">S</div>
              <div className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-500">A</div>
            </div>
            <span>100+ users connected</span>
          </div>
      </section>

      {/* Problem — why you need ClawLink */}
      <section className="py-24 px-6 relative overflow-hidden">
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

      {/* Solution — integrations grid */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <IntegrationGrid />
      </section>

      {/* Video */}
      <section className="py-24 px-6">
        <VideoSection />
      </section>

      {/* Social Proof — testimonials */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50" />
        <div className="max-w-5xl mx-auto relative">
          <Testimonials />
        </div>
      </section>

      {/* Authority — FAQ + Docs */}
      <section className="py-24 px-6">
        <FAQ />
      </section>

      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gray-50" />
        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">
            Read the Docs
          </h2>
          <p className="text-gray-500 mb-10 max-w-xl mx-auto text-lg leading-relaxed">
            Learn how to install ClawLink, log in with your API key, connect apps,
            and use hosted integrations through the plugin.
          </p>
          <a
            href={CLAWLINK_OPENCLAW_DOCS_URL}
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
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-[#3d2a1a]" />
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px', color: 'rgba(232, 145, 90, 0.3)' }} />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#e8915a]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#d4764a]/10 rounded-full blur-3xl" />

        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
            Use the official ClawLink setup flow
          </h2>
          <p className="text-gray-300 mb-10 text-lg max-w-2xl mx-auto">
            Install the first-party plugin, create your API key in the dashboard, then verify the connection from chat.
          </p>
          <div className="mx-auto max-w-2xl rounded-2xl border border-[#e8915a]/20 bg-[#e8915a]/10 backdrop-blur-sm p-6 text-left text-sm text-orange-50 shadow-lg shadow-black/10">
            <div className="space-y-4 font-mono">
              <div>
                <div className="mb-1 text-xs uppercase tracking-[0.2em] text-[#f5b892]">1. Install</div>
                <div className="break-all text-orange-100">openclaw plugins install @useclawlink/openclaw-plugin</div>
              </div>
              <div>
                <div className="mb-1 text-xs uppercase tracking-[0.2em] text-[#f5b892]">2. Open dashboard</div>
                <div className="break-all text-orange-100">https://claw-link.dev/dashboard/settings?tab=api</div>
              </div>
              <div>
                <div className="mb-1 text-xs uppercase tracking-[0.2em] text-[#f5b892]">3. Log in from chat</div>
                <div className="break-all text-orange-100">/clawlink login cllk_live_...</div>
              </div>
              <div>
                <div className="mb-1 text-xs uppercase tracking-[0.2em] text-[#f5b892]">4. Verify</div>
                <div className="break-all text-orange-100">/clawlink status</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50/50 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Image
              src="/images/logo/clawlink.svg"
              alt="ClawLink"
              width={100}
              height={28}
              className="h-6 w-auto"
            />
            <span className="font-medium text-gray-500">ClawLink</span>
          </div>
          <span className="text-gray-400">The first-party integration setup layer for OpenClaw</span>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-gray-600 transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
// edge runtime
