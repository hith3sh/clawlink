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
}) {
  const ctaClass = `inline-flex w-full items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium transition ${
    highlighted
      ? "bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)]"
      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
  }`;

  return (
    <div
      className={`flex w-full flex-col rounded-2xl border bg-white p-8 sm:p-10 ${
        highlighted ? "border-[var(--brand)]/40" : "border-gray-200"
      }`}
    >
      <div className="flex items-center gap-3">
        <h3 className="text-2xl font-semibold tracking-tight text-gray-900">
          {title}
        </h3>
        {highlighted && (
          <span className="rounded-full bg-[var(--brand)]/10 px-2.5 py-0.5 text-xs font-medium text-[var(--brand-hover)]">
            {eyebrow}
          </span>
        )}
      </div>
      <p className="mt-1.5 text-sm text-gray-500">
        {tagline}
      </p>

      <div className="mt-8 flex items-baseline gap-1">
        <span className="text-5xl font-bold tracking-tight text-gray-900">${price}</span>
        <span className="text-sm text-gray-400">/mo</span>
      </div>

      <div className="mt-8 flex flex-col gap-2">
        {ctaAsAnchor ? (
          <a href={ctaHref} className={ctaClass}>
            {ctaLabel}
          </a>
        ) : (
          <Link href={ctaHref} className={ctaClass}>
            {ctaLabel}
          </Link>
        )}
        {footnote ? (
          <p className="text-center text-xs text-gray-400">
            {footnote}
          </p>
        ) : null}
      </div>

      <div className="mt-8 border-t border-gray-100" />

      <p className="mt-8 text-sm font-medium text-gray-900">
        {highlighted ? "Everything in Free, plus:" : "Includes:"}
      </p>
      <ul className="mt-4 space-y-3">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-[15px] leading-6 text-gray-600">
            <svg className="mt-0.5 h-5 w-5 shrink-0 text-[var(--brand)]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                clipRule="evenodd"
              />
            </svg>
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
