import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div
      className="public-site flex min-h-screen flex-col items-center justify-center px-6"
      style={{ background: "var(--mk-bg, #212121)" }}
    >
      {/* Subtle radial glow behind the content */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 40%, rgba(224, 53, 43, 0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex max-w-md flex-col items-center text-center">
        {/* Logo */}
        <Link href="/" className="mb-10 flex items-center gap-2.5 transition-opacity hover:opacity-80">
          <Image
            src="/images/logo/link.png"
            alt="ClawLink"
            width={36}
            height={36}
            className="h-9 w-9 rounded-lg"
          />
          <span
            className="text-xl font-extrabold tracking-tight"
            style={{
              fontFamily: "var(--font-display), var(--font-inter), system-ui, sans-serif",
              color: "var(--mk-fg, #fff)",
              letterSpacing: "-0.02em",
            }}
          >
            ClawLink
          </span>
        </Link>

        {/* 404 display */}
        <div
          className="mb-6 text-[7rem] font-extrabold leading-none tracking-tighter sm:text-[9rem]"
          style={{
            fontFamily: "var(--font-display), var(--font-inter), system-ui, sans-serif",
            color: "var(--mk-fg, #fff)",
            opacity: 0.08,
          }}
        >
          404
        </div>

        {/* Message */}
        <h1
          className="-mt-12 mb-3 text-2xl font-bold tracking-tight sm:text-3xl"
          style={{
            fontFamily: "var(--font-display), var(--font-inter), system-ui, sans-serif",
            color: "var(--mk-fg, #fff)",
          }}
        >
          Page not found
        </h1>
        <p
          className="mb-8 max-w-[340px] text-[15px] leading-relaxed"
          style={{ color: "var(--mk-fg-muted, rgba(255,255,255,0.72))" }}
        >
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>

        {/* Actions */}
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="mk-btn inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-[13.5px] font-semibold text-white transition-all"
            style={{ background: "var(--brand, #E0352B)" }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0v-6a1 1 0 011-1h2a1 1 0 011 1v6m-6 0h6" />
            </svg>
            Back to home
          </Link>
          <Link
            href="/dashboard"
            className="mk-btn inline-flex items-center gap-2 rounded-full border px-6 py-2.5 text-[13.5px] font-semibold text-white transition-all hover:bg-white/[0.06]"
            style={{ borderColor: "rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.03)" }}
          >
            Go to dashboard
          </Link>
        </div>
      </div>

      {/* Decorative broken-link illustration */}
      <div className="mt-16 opacity-30">
        <svg
          width="120"
          height="40"
          viewBox="0 0 120 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Left chain link */}
          <rect x="4" y="12" width="40" height="16" rx="8" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" />
          {/* Right chain link - offset to show "break" */}
          <rect x="76" y="12" width="40" height="16" rx="8" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" />
          {/* Break indicator dashes */}
          <line x1="48" y1="20" x2="54" y2="20" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round" />
          <line x1="60" y1="20" x2="66" y2="20" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round" />
          <line x1="72" y1="20" x2="73" y2="20" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}
