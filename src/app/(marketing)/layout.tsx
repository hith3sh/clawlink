import Link from "next/link";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="flex items-center justify-between p-4 border-b">
        <Link href="/" className="text-xl font-bold">ClawLink</Link>
        <nav className="flex items-center gap-4">
          <Link href="https://docs.claw-link.dev" target="_blank" className="text-sm hover:text-primary">Docs</Link>
          <Link href="/dashboard" className="text-sm">Dashboard</Link>
          <Link href="/sign-in" className="text-sm">Sign In</Link>
        </nav>
      </header>
      {children}
    </>
  );
}
