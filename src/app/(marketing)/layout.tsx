import Link from "next/link";
import Image from "next/image";
import { CLAWLINK_SKILL_URL } from "@/lib/openclaw-plugin";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="public-site flex min-h-screen flex-col">
      {/* Announcement bar */}
      <div
        className="border-b text-center text-[13px] font-semibold tracking-[0.005em] py-2.5 px-4"
        style={{
          background: "#2A2A2D",
          borderColor: "var(--mk-border)",
          color: "#fff",
        }}
      >
        <span className="mr-1">&#9889;</span>
        Connect 100+ apps with one-click OAuth
        <a
          href="https://docs.claw-link.dev/openclaw"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-1.5 underline opacity-80 hover:opacity-100 transition-opacity"
        >
          Read the docs
        </a>
      </div>

      {/* Floating pill nav */}
      <div className="sticky top-4 z-50 flex justify-center px-4 pt-4 sm:px-6">
        <nav
          className="flex w-full max-w-[1080px] items-center justify-between gap-3 rounded-full px-3 py-2 sm:gap-6 sm:px-6"
          style={{
            background: "rgba(33, 33, 33, 0.75)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid var(--mk-border)",
          }}
        >
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/images/logo/link.png"
                alt="ClawLink"
                width={28}
                height={28}
                priority
                className="h-7 w-7 rounded-lg"
              />
              <span
                className="whitespace-nowrap text-lg font-extrabold tracking-tight"
                style={{
                  fontFamily:
                    "var(--font-display), var(--font-inter), system-ui, sans-serif",
                  color: "var(--mk-fg)",
                  letterSpacing: "-0.02em",
                }}
              >
                ClawLink
              </span>
            </Link>
            <div className="hidden items-center gap-5 text-[13.5px] font-medium md:flex" style={{ color: "rgba(255,255,255,0.78)" }}>
              <a href="https://docs.claw-link.dev/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Docs</a>
              <Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              href="/sign-in"
              className="mk-btn !px-3 !py-1.5 !text-[12px] border border-white/20 bg-white/[0.04] text-white transition-all hover:border-white/30 hover:bg-white/[0.10] sm:!px-5 sm:!py-2.5 sm:!text-[13.5px]"
            >
              Log in
            </Link>
            <Link
              href="/sign-up"
              className="mk-btn !px-3 !py-1.5 !text-[12px] bg-[var(--brand)] text-white transition-all hover:bg-[var(--brand-hover)] sm:!px-5 sm:!py-2.5 sm:!text-[13.5px]"
            >
              Start free <span className="text-xs opacity-85 sm:text-sm">&raquo;</span>
            </Link>
          </div>
        </nav>
      </div>

      <div className="flex-1">{children}</div>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--mk-border)" }} className="pt-12 pb-7 px-6">
        <div className="mx-auto grid max-w-[1080px] gap-12 md:grid-cols-[1fr_2fr]">
          <div className="max-w-[280px]">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/images/logo/link.png"
                alt="ClawLink"
                width={32}
                height={32}
                className="h-8 w-8 rounded-lg"
              />
              <span
                className="text-lg font-extrabold tracking-tight"
                style={{
                  fontFamily:
                    "var(--font-display), var(--font-inter), system-ui, sans-serif",
                  color: "var(--mk-fg)",
                  letterSpacing: "-0.02em",
                }}
              >
                ClawLink
              </span>
            </Link>
            <p className="mt-3 text-[13px] leading-relaxed" style={{ color: "var(--mk-fg-muted)" }}>
              Third-party integration hub for OpenClaw. Not affiliated with the OpenClaw project.
            </p>
            <div className="mt-4 flex items-center gap-3.5">
              <a
                href="https://x.com/clawlinkdev"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="transition-colors"
                style={{ color: "var(--mk-fg-faint)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://discord.gg/KjN3xcTvw4"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Discord"
                className="transition-colors"
                style={{ color: "var(--mk-fg-faint)" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/claw-link/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="transition-colors"
                style={{ color: "var(--mk-fg-faint)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
            <div className="flex flex-col gap-2.5 text-[13.5px]">
              <span className="mb-1 text-[11px] font-semibold uppercase tracking-[0.10em]" style={{ color: "var(--mk-fg-faint)" }}>Product</span>
              <Link className="hover:text-white transition-colors" style={{ color: "var(--mk-fg-muted)" }} href="/dashboard">Dashboard</Link>
              <a className="hover:text-white transition-colors" style={{ color: "var(--mk-fg-muted)" }} href="https://docs.claw-link.dev" target="_blank" rel="noopener noreferrer">Docs</a>
              <a className="hover:text-white transition-colors" style={{ color: "var(--mk-fg-muted)" }} href={CLAWLINK_SKILL_URL} target="_blank" rel="noopener noreferrer">skill.md</a>
            </div>
            <div className="flex flex-col gap-2.5 text-[13.5px]">
              <span className="mb-1 text-[11px] font-semibold uppercase tracking-[0.10em]" style={{ color: "var(--mk-fg-faint)" }}>Trust</span>
              <Link className="hover:text-white transition-colors" style={{ color: "var(--mk-fg-muted)" }} href="/verify">Verify</Link>
              <Link className="hover:text-white transition-colors" style={{ color: "var(--mk-fg-muted)" }} href="/security">Security</Link>
              <Link className="hover:text-white transition-colors" style={{ color: "var(--mk-fg-muted)" }} href="/privacy">Privacy</Link>
              <Link className="hover:text-white transition-colors" style={{ color: "var(--mk-fg-muted)" }} href="/terms">Terms</Link>
            </div>
            <div className="flex flex-col gap-2.5 text-[13.5px]">
              <span className="mb-1 text-[11px] font-semibold uppercase tracking-[0.10em]" style={{ color: "var(--mk-fg-faint)" }}>Source</span>
              <a className="hover:text-white transition-colors" style={{ color: "var(--mk-fg-muted)" }} href="https://github.com/hith3sh/clawlink" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a className="hover:text-white transition-colors" style={{ color: "var(--mk-fg-muted)" }} href="https://www.npmjs.com/package/@useclawlink/openclaw-plugin" target="_blank" rel="noopener noreferrer">npm</a>
              <a className="hover:text-white transition-colors" style={{ color: "var(--mk-fg-muted)" }} href="https://discord.gg/KjN3xcTvw4" target="_blank" rel="noopener noreferrer">Discord</a>
            </div>
          </div>
        </div>
        <div
          className="mx-auto mt-9 flex max-w-[1080px] flex-col gap-2 pt-5 text-xs sm:flex-row sm:items-center sm:justify-between"
          style={{ borderTop: "1px solid var(--mk-border-card)", color: "var(--mk-fg-faint)" }}
        >
          <span>&copy; {new Date().getFullYear()} ClawLink. MIT-licensed plugin code.</span>
          <a className="hover:text-white transition-colors" href="mailto:hello@claw-link.dev">
            hello@claw-link.dev
          </a>
        </div>
      </footer>
    </div>
  );
}
