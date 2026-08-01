import type { ReactNode } from "react";
import { AppProviders } from "@/components/providers/app-providers";
import { MarketingThemeLock } from "@/components/providers/marketing-theme-lock";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { HashScrollHandler } from "@/components/layout/hash-scroll-handler";
import { ActiveSectionTracker } from "@/components/layout/active-section-tracker";
import { BRAND } from "@/constants/brand";
import { SEO, absoluteUrl } from "@/constants/seo";
import { getSiteSettings } from "@/services/api";

export default async function MarketingLayout({
  children,
}: {
  children: ReactNode;
}) {
  const siteSettings = await getSiteSettings();
  const contactEmail = siteSettings.contactEmail || BRAND.email;
  const contactPhone = siteSettings.contactPhone ?? BRAND.phone;

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: BRAND.name,
    alternateName: "Grow with Samah",
    url: SEO.siteUrl,
    email: contactEmail,
    telephone: contactPhone || undefined,
    description: SEO.description,
    image: absoluteUrl("/opengraph-image"),
    areaServed: "Worldwide",
    priceRange: "$$",
    sameAs: [
      BRAND.socials.linkedin,
      BRAND.socials.instagram,
      BRAND.socials.telegram,
    ].filter(Boolean),
    founder: {
      "@type": "Person",
      name: BRAND.name,
      jobTitle: "Digital Marketing Strategist",
      url: SEO.siteUrl,
      sameAs: [BRAND.socials.linkedin, BRAND.socials.instagram],
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: contactEmail,
      telephone: contactPhone || undefined,
      availableLanguage: ["English", "French", "Arabic"],
    },
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BRAND.name,
    alternateName: "Grow with Samah",
    url: SEO.siteUrl,
    description: SEO.description,
    publisher: {
      "@type": "Person",
      name: BRAND.name,
    },
  };

  return (
    <div className="cursor-none-desktop dark min-h-screen bg-background text-foreground">
      <MarketingThemeLock />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <AppProviders>
        <HashScrollHandler />
        <ActiveSectionTracker />
        <SiteHeader />
        <main className="relative z-10 pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-0">
          {children}
        </main>
        <SiteFooter contactEmail={contactEmail} contactPhone={contactPhone} />
        <MobileBottomNav />
      </AppProviders>
    </div>
  );
}
