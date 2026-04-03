import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ClawLink — Plug Anything into OpenClaw",
  description:
    "One command to add 40+ integrations to OpenClaw. Gmail, Slack, WordPress, Stripe, and more — zero config.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">
          <header className="flex items-center justify-between p-4 border-b">
            <Link href="/" className="text-xl font-bold">ClawLink</Link>
            <nav className="flex items-center gap-4">
              <Link href="https://docs.claw-link.dev" target="_blank" className="text-sm hover:text-primary">Docs</Link>
              <Link href="/dashboard" className="text-sm">Dashboard</Link>
              <Link href="/sign-in" className="text-sm">Sign In</Link>
            </nav>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}