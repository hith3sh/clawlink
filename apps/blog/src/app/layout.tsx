import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ClawLink Blog",
    template: "%s | ClawLink Blog",
  },
  description: "Thoughts on AI agents, integrations, and building with OpenClaw.",
  metadataBase: new URL("https://blog.claw-link.dev"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "ClawLink Blog",
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <a href="/" className="site-logo">
            ClawLink
          </a>
          <nav className="site-nav">
            <a href="https://claw-link.dev">Product</a>
            <a href="https://docs.claw-link.dev">Docs</a>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <p>&copy; {new Date().getFullYear()} ClawLink. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
