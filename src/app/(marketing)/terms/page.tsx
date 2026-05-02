import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | ClawLink",
  description: "Terms that govern access to and use of ClawLink.",
  alternates: {
    canonical: "https://claw-link.dev/terms",
  },
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--mk-fg)" }}>{title}</h2>
      <div className="space-y-4 text-base leading-8" style={{ color: "var(--mk-fg-muted)" }}>{children}</div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <main className="flex-1">
      <section className="px-6 py-16" style={{ borderBottom: "1px solid var(--mk-border)" }}>
        <div className="mx-auto max-w-4xl">
          <div
            className="inline-flex rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.18em]"
            style={{ background: "rgba(224,53,43,0.10)", border: "1px solid rgba(224,53,43,0.28)", color: "#FFC8B6" }}
          >
            Legal
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl" style={{ color: "var(--mk-fg)" }}>
            Terms of Service
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8" style={{ color: "var(--mk-fg-muted)" }}>
            These terms govern access to and use of ClawLink, including hosted integration setup, credential handling,
            and the execution of user-authorized actions through connected services.
          </p>
          <p className="mt-4 text-sm" style={{ color: "var(--mk-fg-faint)" }}>Last updated: April 7, 2026</p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl space-y-12">
          <Section title="Use of the Service">
            <p>
              You may use ClawLink only in compliance with applicable law and only for accounts, data, and systems you
              are authorized to access. You are responsible for the actions initiated through your account and through
              integrations you connect.
            </p>
          </Section>

          <Section title="Accounts and Integrations">
            <p>
              You are responsible for maintaining access to your account and for reviewing the permissions you grant to
              third-party integrations. Disconnecting or revoking access to an integration may prevent related features
              from working until the connection is restored.
            </p>
          </Section>

          <Section title="Acceptable Use">
            <p>
              You may not use ClawLink to violate law, abuse third-party services, send spam, scrape or exfiltrate data
              without authorization, interfere with the service, or attempt to bypass access controls, billing limits,
              or security safeguards.
            </p>
          </Section>

          <Section title="Third-Party Services">
            <p>
              ClawLink depends on third-party APIs, authentication systems, hosting infrastructure, and billing
              providers. Availability and behavior of those services may change outside our control, and some features
              may stop working if a provider changes permissions, APIs, or verification requirements.
            </p>
          </Section>

          <Section title="Fees">
            <p>
              Paid features, if enabled for your account, are billed according to the pricing and billing terms shown in
              the product at the time of purchase. Failure to pay may result in suspension or limitation of paid
              features.
            </p>
          </Section>

          <Section title="Disclaimer and Liability">
            <p>
              ClawLink is provided on an &quot;as is&quot; and &quot;as available&quot; basis. To the fullest extent permitted by law,
              we disclaim warranties of merchantability, fitness for a particular purpose, and non-infringement. We are
              not liable for indirect, incidental, special, consequential, or exemplary damages arising from use of the
              service.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              Questions about these terms can be sent to{" "}
              <a className="font-medium underline transition-colors hover:text-white" style={{ color: "var(--brand)" }} href="mailto:hello@claw-link.dev">
                hello@claw-link.dev
              </a>
              .
            </p>
          </Section>

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
