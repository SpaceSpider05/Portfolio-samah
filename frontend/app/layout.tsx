import type { Metadata } from "next";
import { Edu_VIC_WA_NT_Hand, Outfit } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { BRAND } from "@/constants/brand";
import "lenis/dist/lenis.css";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const eduHand = Edu_VIC_WA_NT_Hand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-edu-hand",
  display: "swap",
  adjustFontFallback: false,
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${BRAND.name} — Premium Digital Marketing`,
    template: `%s · ${BRAND.name}`,
  },
  description: BRAND.subtitle,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: BRAND.name,
    title: `${BRAND.name} — Premium Digital Marketing`,
    description: BRAND.subtitle,
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.name} — Premium Digital Marketing`,
    description: BRAND.subtitle,
  },
  robots: {
    index: true,
    follow: true,
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
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
