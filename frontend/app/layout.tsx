import type { Metadata } from "next";
import { Edu_VIC_WA_NT_Hand, Outfit } from "next/font/google";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SEO } from "@/constants/seo";
import "./globals.css";

const eduHand = Edu_VIC_WA_NT_Hand({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-edu-hand",
  // optional: avoid delaying LCP on slow mobile; font still applies when cached/fast.
  display: "optional",
  preload: true,
  adjustFontFallback: true,
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  preload: false,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SEO.siteUrl),
  title: {
    default: SEO.titleDefault,
    template: SEO.titleTemplate,
  },
  description: SEO.description,
  keywords: [...SEO.keywords],
  authors: [{ name: SEO.siteName, url: SEO.siteUrl }],
  creator: SEO.siteName,
  publisher: SEO.siteName,
  applicationName: SEO.siteName,
  category: "marketing",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: SEO.locale,
    url: SEO.siteUrl,
    siteName: SEO.siteName,
    title: SEO.titleDefault,
    description: SEO.description,
    images: [
      {
        url: "/opengraph-image",
        alt: SEO.ogImageAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO.titleDefault,
    description: SEO.description,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${eduHand.variable} min-h-screen bg-background text-foreground antialiased`}
      >
        <GoogleAnalytics />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
