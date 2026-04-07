import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Security | ClawLink",
  description: "High-level security and data-handling practices for ClawLink.",
  alternates: {
    canonical: "https://claw-link.dev/security",
  },
};

export default function SecurityPage() {
  return (
    <main className="flex-1 bg-white">
      <section className="border-b border-gray-100 bg-gradient-to-b from-[#eef6ff] via-white to-white px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="inline-flex rounded-full border border-[#cfe2ff] bg-white/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-[#27548f]">
            Trust
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-gray-950 sm:text-5xl">
            Security Overview
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-600">
            ClawLink is designed to keep hosted integration setup simple while reducing unnecessary access to user
            credentials and connected account data.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl space-y-8 text-base leading-8 text-gray-600">
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900">How ClawLink Handles Credentials</h2>
            <p>
              ClawLink uses hosted OAuth flows where available so users can connect accounts directly with the provider
              rather than pasting secrets into OpenClaw. Stored integration credentials are encrypted before
              persistence.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Operational Access</h2>
            <p>
              Access to production systems and operational data should be limited to what is necessary to operate,
              support, and secure the service. We aim to minimize retained integration data and request the least scope
              needed for a feature to work.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Disconnecting Integrations</h2>
            <p>
              Users can disconnect integration connections from the ClawLink dashboard. For higher-assurance removal,
              users may also revoke provider access from the third-party account directly and contact us for deletion
              requests.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Reporting Security Issues</h2>
            <p>
              Security reports can be sent to{" "}
              <a className="font-medium text-[#27548f] hover:text-[#1d3e68]" href="mailto:hello@claw-link.dev">
                hello@claw-link.dev
              </a>
              . Please include reproduction steps, affected endpoints, and any relevant account or request context.
            </p>
          </section>

          <div className="border-t border-gray-100 pt-8 text-sm text-gray-500">
            <Link className="font-medium text-gray-900 hover:text-[#27548f]" href="/">
              Back to ClawLink
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
