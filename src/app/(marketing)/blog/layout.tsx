import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { ThemeToggle } from "@/components/ThemeToggle";

const BLOG_THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("blog-theme");document.documentElement.setAttribute("data-blog-theme",t==="dark"?"dark":"light")}catch(e){document.documentElement.setAttribute("data-blog-theme","light")}})()`;

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="blog-wrapper">
      <Script id="blog-theme-init" strategy="beforeInteractive">
        {BLOG_THEME_SCRIPT}
      </Script>
      <nav className="blog-topbar">
        <Link href="/blog" className="blog-topbar-brand">
          <Image
            src="/images/logo/link.png"
            alt="ClawLink"
            width={24}
            height={24}
            className="blog-topbar-logo"
          />
          <span className="blog-topbar-title">Blog</span>
        </Link>
        <div className="blog-topbar-actions">
          <Link href="/" className="blog-topbar-link">
            &larr; Home
          </Link>
          <ThemeToggle />
        </div>
      </nav>
      {children}
    </div>
  );
}