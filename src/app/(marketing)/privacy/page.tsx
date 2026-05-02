import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | ClawLink",
  description: "How ClawLink collects, uses, stores, and protects account and integration data.",
  alternates: {
    canonical: "https://claw-link.dev/privacy",
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

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8" style={{ color: "var(--mk-fg-muted)" }}>
            ClawLink helps users connect external apps to OpenClaw with hosted authentication and managed credentials.
            This policy explains what we collect, how we use it, and how we handle Google user data.
          </p>
          <p className="mt-4 text-sm" style={{ color: "var(--mk-fg-faint)" }}>Last updated: April 7, 2026</p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl space-y-12">
          <Section title="What We Collect">
            <p>
              We collect account information such as your email address and authentication identifiers, integration
              connection metadata such as provider name and connected account labels, encrypted credentials needed to
              run the integrations you authorize, and operational logs required to keep the service working.
            </p>
            <p>
              When you use Gmail through ClawLink, ClawLink may process message metadata and message content returned by
              the Gmail API only to fulfill the actions you request, such as listing messages, reading a message,
              drafting an email, or sending an email.
            </p>
          </Section>

          <Section title="How We Use Information">
            <p>
              We use your information to authenticate you, establish and maintain integration connections, execute
              actions you request through ClawLink, troubleshoot failures, enforce plan limits, and protect the
              security and reliability of the service.
            </p>
            <p>
              We do not use Gmail data or other Google API data for advertising. We do not sell Google API data. We do
              not use Google API data to train generalized AI or machine learning models.
            </p>
          </Section>

          <Section title="Google API Data">
            <p>
              ClawLink&apos;s use and transfer to any other app of information received from Google APIs will adhere to the
              Google API Services User Data Policy, including the Limited Use requirements.
            </p>
            <p>
              For Gmail, ClawLink requests only the scopes needed for the user-facing features currently offered in the
              product. For the initial hosted Gmail flow, that means reading messages, creating drafts, and sending
              email on behalf of the user who connected the account.
            </p>
          </Section>

          <Section title="Storage and Security">
            <p>
              ClawLink encrypts stored integration credentials before persistence and restricts access to operational
              systems to the minimum needed to run and support the product. No security measure is absolute, but we
              design the service to reduce unnecessary access and retain only the data needed to operate the
              integration.
            </p>
          </Section>

          <Section title="Sharing">
            <p>
              We share information only with service providers and infrastructure vendors that help us operate ClawLink,
              such as hosting, authentication, billing, and logging providers, or when required by law. We do not sell
              personal information.
            </p>
          </Section>

          <Section title="Retention and Deletion">
            <p>
              We retain account and connection data for as long as needed to provide the service, comply with legal
              obligations, resolve disputes, and enforce agreements. You can disconnect integrations from the ClawLink
              dashboard. You can also request account or data deletion by contacting us.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              Questions about this policy or requests related to privacy and deletion can be sent to{" "}
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
