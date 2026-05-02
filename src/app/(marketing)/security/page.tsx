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
    <main className="flex-1">
      <section className="px-6 py-16" style={{ borderBottom: "1px solid var(--mk-border)" }}>
        <div className="mx-auto max-w-4xl">
          <div
            className="inline-flex rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.18em]"
            style={{ background: "rgba(224,53,43,0.10)", border: "1px solid rgba(224,53,43,0.28)", color: "#FFC8B6" }}
          >
            Trust
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl" style={{ color: "var(--mk-fg)" }}>
            Security Overview
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8" style={{ color: "var(--mk-fg-muted)" }}>
            ClawLink is designed to keep hosted integration setup simple while reducing unnecessary access to user
            credentials and connected account data.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl space-y-8 text-base leading-8" style={{ color: "var(--mk-fg-muted)" }}>
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--mk-fg)" }}>How ClawLink Handles Credentials</h2>
            <p>
              ClawLink uses hosted OAuth flows where available so users can connect accounts directly with the provider
              rather than pasting secrets into OpenClaw. Stored integration credentials are encrypted before
              persistence.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--mk-fg)" }}>Operational Access</h2>
            <p>
              Access to production systems and operational data should be limited to what is necessary to operate,
              support, and secure the service. We aim to minimize retained integration data and request the least scope
              needed for a feature to work.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--mk-fg)" }}>Disconnecting Integrations</h2>
            <p>
              Users can disconnect integration connections from the ClawLink dashboard. For higher-assurance removal,
              users may also revoke provider access from the third-party account directly and contact us for deletion
              requests.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--mk-fg)" }}>Reporting Security Issues</h2>
            <p>
              Security reports can be sent to{" "}
              <a className="font-medium underline transition-colors hover:text-white" style={{ color: "var(--brand)" }} href="mailto:hello@claw-link.dev">
                hello@claw-link.dev
              </a>
              . Please include reproduction steps, affected endpoints, and any relevant account or request context.
            </p>
          </section>

          <div className="pt-8 text-sm" style={{ borderTop: "1px solid var(--mk-border)", color: "var(--mk-fg-faint)" }}>
            <Link className="font-medium transition-colors hover:text-white" style={{ color: "var(--mk-fg)" }} href="/">
              Back to ClawLink
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
