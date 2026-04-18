import Link from "next/link";
import Image from "next/image";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="public-site flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-8 sm:px-12 py-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/brand/bento/clawlink-square-v2.png"
            alt="ClawLink"
            width={50}
            height={50}
            priority
            className="h-10 w-10 sm:h-12 sm:w-12"
          />
          <span className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">claw-link</span>
        </Link>
        <nav>
          <Link
            href="/sign-in"
            className="inline-flex items-center rounded-full bg-[#e8915a] px-8 py-3 text-base font-medium text-white shadow-sm transition hover:bg-[#d4764a]"
          >
            Login
          </Link>
        </nav>
      </header>
      <div className="flex-1">{children}</div>
      <footer className="mt-24 border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-8 py-12 sm:px-12 md:flex-row md:justify-between">
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/brand/bento/clawlink-square-v2.png"
                alt="ClawLink"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="text-lg font-bold tracking-tight text-gray-900">claw-link</span>
            </Link>
            <p className="max-w-xs text-sm text-gray-500">
              Third-party integration hub for OpenClaw. Not affiliated with OpenClaw.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div className="flex flex-col gap-2 text-sm">
              <span className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-400">Product</span>
              <Link className="text-gray-700 hover:text-gray-900" href="/dashboard">
                Dashboard
              </Link>
              <a
                className="text-gray-700 hover:text-gray-900"
                href="https://docs.claw-link.dev/openclaw"
                target="_blank"
                rel="noopener noreferrer"
              >
                Docs
              </a>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <span className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-400">Trust</span>
              <Link className="text-gray-700 hover:text-gray-900" href="/verify">
                Verify
              </Link>
              <Link className="text-gray-700 hover:text-gray-900" href="/security">
                Security
              </Link>
              <Link className="text-gray-700 hover:text-gray-900" href="/privacy">
                Privacy
              </Link>
              <Link className="text-gray-700 hover:text-gray-900" href="/terms">
                Terms
              </Link>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <span className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-400">Source</span>
              <a
                className="text-gray-700 hover:text-gray-900"
                href="https://github.com/hith3sh/clawlink"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a
                className="text-gray-700 hover:text-gray-900"
                href="https://www.npmjs.com/package/@useclawlink/openclaw-plugin"
                target="_blank"
                rel="noopener noreferrer"
              >
                npm
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-2 px-8 py-6 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between sm:px-12">
            <span>&copy; {new Date().getFullYear()} ClawLink. MIT licensed plugin code.</span>
            <a className="hover:text-gray-700" href="mailto:hello@claw-link.dev">
              hello@claw-link.dev
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
