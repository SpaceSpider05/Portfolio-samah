import type { ReactNode } from "react";
import { AppProviders } from "@/components/providers/app-providers";
import { MarketingThemeLock } from "@/components/providers/marketing-theme-lock";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { BRAND } from "@/constants/brand";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND.name,
    url: siteUrl,
    email: BRAND.email,
    description: BRAND.subtitle,
    sameAs: [
      BRAND.socials.linkedin,
      BRAND.socials.instagram,
      BRAND.socials.telegram,
    ],
  };

  return (
    <div className="cursor-none-desktop dark min-h-screen bg-background text-foreground">
      <MarketingThemeLock />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <AppProviders>
        <SiteHeader />
        <main className="relative z-10 pb-24 md:pb-0">{children}</main>
        <SiteFooter />
        <MobileBottomNav />
      </AppProviders>
    </div>
  );
}
