import type { ReactNode } from "react";
import { AppProviders } from "@/components/providers/app-providers";
import { MarketingThemeLock } from "@/components/providers/marketing-theme-lock";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { HashScrollHandler } from "@/components/layout/hash-scroll-handler";
import { ActiveSectionTracker } from "@/components/layout/active-section-tracker";
import { BRAND } from "@/constants/brand";
import { getSiteSettings } from "@/services/api";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function MarketingLayout({
  children,
}: {
  children: ReactNode;
}) {
  const siteSettings = await getSiteSettings();
  const contactEmail = siteSettings.contactEmail || BRAND.email;

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND.name,
    url: siteUrl,
    email: contactEmail,
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
        <HashScrollHandler />
        <ActiveSectionTracker />
        <SiteHeader />
        <main className="relative z-10 pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-0">
          {children}
        </main>
        <SiteFooter
          contactEmail={contactEmail}
          contactPhone={siteSettings.contactPhone ?? BRAND.phone}
        />
        <MobileBottomNav />
      </AppProviders>
    </div>
  );
}
