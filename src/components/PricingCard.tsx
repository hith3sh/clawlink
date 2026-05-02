import Link from "next/link";

export function PricingCard({
  eyebrow,
  title,
  price,
  tagline,
  features,
  footnote,
  ctaLabel,
  ctaHref,
  highlighted = false,
  ctaAsAnchor = false,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  price: string;
  tagline: string;
  features: string[];
  footnote?: string;
  ctaLabel: string;
  ctaHref: string;
  highlighted?: boolean;
  ctaAsAnchor?: boolean;
  dark?: boolean;
}) {
  const ctaClass = dark
    ? "mk-btn w-full justify-center text-sm"
    : "inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition";

  return (
    <div
      className={`relative flex w-full flex-col rounded-3xl p-8 sm:p-10 ${
        dark
          ? ""
          : "bg-card text-card-foreground border border-border shadow-sm"
      }`}
      style={
        dark
          ? {
              background: highlighted ? "#2A2A2D" : "var(--mk-elev)",
              border: highlighted
                ? "1.5px solid var(--brand)"
                : "1px solid var(--mk-border)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.45)",
            }
          : undefined
      }
    >
      {/* "Most popular" floating ribbon */}
      {highlighted && (
        <span
          className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em]"
          style={{
            background: "var(--brand)",
            color: "#fff",
            fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
            border: dark ? "2px solid var(--mk-bg)" : "2px solid #fff",
          }}
        >
          Most popular
        </span>
      )}

      <div
        className="text-[11px] font-bold uppercase tracking-[0.10em]"
        style={{ color: highlighted ? "#FFB347" : "var(--brand)" }}
      >
        {eyebrow}
      </div>

      <h3
        className="mt-2 text-2xl font-bold tracking-tight"
        style={{
          fontFamily: "var(--font-display), var(--font-inter), system-ui, sans-serif",
          color: dark ? "var(--mk-fg)" : undefined,
          letterSpacing: "-0.02em",
        }}
      >
        {title}
      </h3>

      <div className="mt-3 flex items-baseline gap-1">
        <span
          className="text-5xl font-extrabold tracking-tight"
          style={{
            fontFamily: "var(--font-display), var(--font-inter), system-ui, sans-serif",
            color: dark ? "var(--mk-fg)" : undefined,
            letterSpacing: "-0.03em",
          }}
        >
          ${price}
        </span>
        <span className="text-sm" style={{ color: dark ? "var(--mk-fg-dim)" : undefined }}>/mo</span>
      </div>

      <p className="mt-1 text-sm" style={{ color: dark ? "var(--mk-fg-muted)" : undefined }}>
        {tagline}
      </p>

      <ul className="mt-6 space-y-2.5">
        {features.map((f) => (
          <li
            key={f}
            className="flex items-center gap-2.5 text-sm"
            style={{ color: dark ? "rgba(255,255,255,0.82)" : undefined }}
          >
            <span
              className="font-extrabold"
              style={{ color: highlighted ? "#FFB347" : "var(--brand)" }}
            >
              &#10003;
            </span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-6">
        {ctaAsAnchor ? (
          <a
            href={ctaHref}
            className={ctaClass}
            style={
              dark
                ? highlighted
                  ? { background: "var(--brand)", color: "#fff" }
                  : {
                      background: "rgba(255,255,255,0.04)",
                      borderColor: "rgba(255,255,255,0.18)",
                      color: "#fff",
                    }
                : highlighted
                  ? { background: "var(--brand)", color: "#fff" }
                  : {
                      background: "transparent",
                      border: "1px solid var(--border)",
                      color: "var(--foreground)",
                    }
            }
          >
            {ctaLabel}
            {highlighted && <span className="text-sm opacity-85">&raquo;</span>}
          </a>
        ) : (
          <Link
            href={ctaHref}
            className={ctaClass}
            style={
              dark
                ? highlighted
                  ? { background: "var(--brand)", color: "#fff" }
                  : {
                      background: "rgba(255,255,255,0.04)",
                      borderColor: "rgba(255,255,255,0.18)",
                      color: "#fff",
                    }
                : highlighted
                  ? { background: "var(--brand)", color: "#fff" }
                  : {
                      background: "transparent",
                      border: "1px solid var(--border)",
                      color: "var(--foreground)",
                    }
            }
          >
            {ctaLabel}
            {highlighted && <span className="text-sm opacity-85">&raquo;</span>}
          </Link>
        )}
        {footnote && (
          <p
            className="mt-2.5 text-center text-xs"
            style={{ color: dark ? "var(--mk-fg-faint)" : undefined }}
          >
            {footnote}
          </p>
        )}
      </div>
    </div>
  );
}
