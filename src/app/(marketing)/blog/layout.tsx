import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="blog-wrapper">
      <div className="blog-topbar">
        <Link href="/blog" className="blog-topbar-home">
          ClawLink Blog
        </Link>
        <ThemeToggle />
      </div>
      {children}
    </div>
  );
}
