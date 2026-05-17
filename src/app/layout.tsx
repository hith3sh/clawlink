import type { Metadata } from "next";
import { Inter, Geist_Mono, Caveat, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/ui/themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  DEFAULT_OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "ClawLink: Plug Anything into OpenClaw",
  description: SITE_DESCRIPTION,
  icons: {
    icon: "/images/logo/link.png",
    apple: "/images/logo/link.png",
  },
  openGraph: {
    title: "ClawLink: Plug Anything into OpenClaw",
    description: SITE_DESCRIPTION,
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "ClawLink — Plug Anything into OpenClaw",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ClawLink: Plug Anything into OpenClaw",
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  alternates: {
    canonical: SITE_URL,
    types: {
      "text/markdown": "/skill.md",
    },
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
      appearance={{ theme: dark }}
    >
      <html
        lang="en"
        className={`${inter.variable} ${geistMono.variable} ${caveat.variable} ${plusJakartaSans.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">
          <Script
            src="https://app.rybbit.io/api/script.js"
            data-site-id="179055470d9e"
            strategy="afterInteractive"
          />
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=AW-18163006664"
            strategy="afterInteractive"
          />
          <Script id="google-ads-gtag" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-18163006664');
            `}
          </Script>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
