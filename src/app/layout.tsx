import type { Metadata } from "next";
import { Inter, Geist_Mono, Caveat, Plus_Jakarta_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/ui/themes";
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

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const siteDescription =
  "Install ClawLink in OpenClaw once, then connect apps with one click. Provider credentials are managed by ClawLink, encrypted at rest, and Pro is $4.99/month after your first free app.";

export const metadata: Metadata = {
  title: "ClawLink: Plug Anything into OpenClaw",
  description: siteDescription,
  icons: {
    icon: "/images/logo/link.png",
    apple: "/images/logo/link.png",
  },
  openGraph: {
    title: "ClawLink: Plug Anything into OpenClaw",
    description: siteDescription,
    type: "website",
    url: "https://claw-link.dev",
    siteName: "ClawLink",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClawLink: Plug Anything into OpenClaw",
    description: siteDescription,
    images: ["https://docs.claw-link.dev/images/logo/social-card.png"],
  },
  alternates: {
    canonical: "https://claw-link.dev",
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
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
