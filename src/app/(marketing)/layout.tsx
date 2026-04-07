import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="flex items-center justify-between p-4 border-b">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo/clawlink.svg"
            alt="ClawLink"
            width={120}
            height={32}
            priority
            className="h-8 w-auto"
          />
          <span className="text-lg font-bold">ClawLink</span>
        </Link>
        <nav>
          <Button variant="outline" size="sm" className="rounded-full" render={<Link href="/sign-in" />}>
            Sign In
          </Button>
        </nav>
      </header>
      {children}
    </>
  );
}
