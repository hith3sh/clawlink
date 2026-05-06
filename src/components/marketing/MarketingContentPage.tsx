import Link from "next/link";

type Section = {
  title: string;
  body?: string[];
  bullets?: string[];
};

type MarketingContentPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  intro: string;
  primaryCtaHref: string;
  primaryCtaLabel: string;
  secondaryCtaHref: string;
  secondaryCtaLabel: string;
  sections: Section[];
  faq?: { q: string; a: string }[];
};

export function MarketingContentPage({
  eyebrow,
  title,
  description,
  intro,
  primaryCtaHref,
  primaryCtaLabel,
  secondaryCtaHref,
  secondaryCtaLabel,
  sections,
  faq = [],
}: MarketingContentPageProps) {
  return (
    <main className="flex-1">
      <section className="mx-auto max-w-[920px] px-6 pt-16 pb-14">
        <span
          className="inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]"
          style={{
            borderColor: "rgba(224,53,43,0.25)",
            background: "rgba(224,53,43,0.08)",
            color: "#FFC8B6",
          }}
        >
          {eyebrow}
        </span>

        <h1
          className="mt-6 max-w-[820px] text-balance"
          style={{
            fontFamily: "var(--font-display), var(--font-inter), system-ui, sans-serif",
            fontWeight: 700,
            fontSize: "clamp(38px, 6vw, 60px)",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: "var(--mk-fg)",
          }}
        >
          {title}
        </h1>

        <p
          className="mt-5 max-w-[760px] text-[17px] leading-8"
          style={{ color: "var(--mk-fg-muted)" }}
        >
          {description}
        </p>

        <div
          className="mt-10 rounded-[28px] p-7 md:p-8"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid var(--mk-border)",
          }}
        >
          <p className="text-[15.5px] leading-8" style={{ color: "var(--mk-fg-muted)" }}>
            {intro}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={primaryCtaHref}
              className="mk-btn inline-flex"
              style={{ background: "var(--brand)", color: "#fff" }}
            >
              {primaryCtaLabel}
            </Link>
            <Link
              href={secondaryCtaHref}
              className="mk-btn inline-flex border border-white/15 bg-white/[0.03] text-white hover:bg-white/[0.06]"
            >
              {secondaryCtaLabel}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[920px] px-6 pb-20">
        <div className="grid gap-5">
          {sections.map((section) => (
            <article
              key={section.title}
              className="rounded-[24px] p-7 md:p-8"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid var(--mk-border-card)",
              }}
            >
              <h2
                className="text-[24px] font-bold"
                style={{
                  fontFamily: "var(--font-display), var(--font-inter), system-ui, sans-serif",
                  letterSpacing: "-0.02em",
                  color: "var(--mk-fg)",
                }}
              >
                {section.title}
              </h2>

              {section.body?.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-4 text-[15.5px] leading-8"
                  style={{ color: "var(--mk-fg-muted)" }}
                >
                  {paragraph}
                </p>
              ))}

              {section.bullets && section.bullets.length > 0 ? (
                <ul className="mt-5 space-y-3">
                  {section.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex gap-3 text-[15px] leading-7"
                      style={{ color: "var(--mk-fg-muted)" }}
                    >
                      <span style={{ color: "var(--brand)" }}>•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      {faq.length > 0 ? (
        <section className="mx-auto max-w-[920px] px-6 pb-24">
          <div
            className="rounded-[28px] p-7 md:p-8"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid var(--mk-border-card)",
            }}
          >
            <h2
              className="text-[24px] font-bold"
              style={{
                fontFamily: "var(--font-display), var(--font-inter), system-ui, sans-serif",
                letterSpacing: "-0.02em",
                color: "var(--mk-fg)",
              }}
            >
              Frequently asked questions
            </h2>
            <div className="mt-6 grid gap-5">
              {faq.map((item) => (
                <div key={item.q}>
                  <h3 className="text-[16px] font-semibold" style={{ color: "var(--mk-fg)" }}>
                    {item.q}
                  </h3>
                  <p className="mt-2 text-[15px] leading-7" style={{ color: "var(--mk-fg-muted)" }}>
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
