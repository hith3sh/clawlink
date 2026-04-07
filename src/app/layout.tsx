import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ClawLink — Plug Anything into OpenClaw",
  description:
    "Install ClawLink in OpenClaw once, then connect apps with one click. Hosted auth, encrypted credentials, and headless-friendly setup links.",
  icons: {
    icon: "/images/logo/favicon.ico",
    apple: "/images/logo/clawlink-512.png",
  },
  openGraph: {
    title: "ClawLink — Plug Anything into OpenClaw",
    description: "Install ClawLink in OpenClaw once, then connect apps with one click. Hosted auth, encrypted credentials, and headless-friendly setup links.",
    type: "website",
    url: "https://claw-link.dev",
    siteName: "ClawLink",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClawLink — Plug Anything into OpenClaw",
    description: "Install ClawLink in OpenClaw once, then connect apps with one click. Hosted auth, encrypted credentials, and headless-friendly setup links.",
    images: ["https://docs.claw-link.dev/images/logo/social-card.png"],
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
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
    >
      <html
        lang="en"
        className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
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
