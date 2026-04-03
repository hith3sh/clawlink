import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { TooltipProvider } from "@/components/ui/tooltip";
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
  openGraph: {
    title: "ClawLink — Plug Anything into OpenClaw",
    description:
      "One command to add 40+ integrations to OpenClaw. Gmail, Slack, WordPress, Stripe, and more — zero config.",
    url: "https://claw-link.dev",
    siteName: "ClawLink",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClawLink — Plug Anything into OpenClaw",
    description:
      "One command to add 40+ integrations to OpenClaw. Gmail, Slack, WordPress, Stripe, and more — zero config.",
  },
  alternates: {
    canonical: "https://claw-link.dev",
  },
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
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}