import type { ReactNode } from "react";
import { AppProviders } from "@/components/providers/app-providers";
import { MarketingThemeLock } from "@/components/providers/marketing-theme-lock";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { HashScrollHandler } from "@/components/layout/hash-scroll-handler";
import { ActiveSectionTracker } from "@/components/layout/active-section-tracker";
import { BRAND } from "@/constants/brand";
import { SEO, absoluteUrl, resolveSeoPhone } from "@/constants/seo";
import { getSiteSettings } from "@/services/api";

export default async function MarketingLayout({
  children,
}: {
  children: ReactNode;
}) {
  const siteSettings = await getSiteSettings();
  const contactEmail = siteSettings.contactEmail || BRAND.email;
  // Footer/admin: always respect the CMS phone (fallback only when empty).
  const contactPhone =
    siteSettings.contactPhone?.trim() || BRAND.phone || null;
  // Schema only: strip obvious placeholders so fake CMS numbers don't pollute SEO.
  const seoPhone = resolveSeoPhone(siteSettings.contactPhone);
  const personId = `${SEO.siteUrl}/#person`;
  const serviceId = `${SEO.siteUrl}/#professional-service`;

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId,
    name: BRAND.name,
    url: SEO.siteUrl,
    image: absoluteUrl("/opengraph-image"),
    jobTitle: "Digital Marketing Strategist",
    description: SEO.description,
    email: contactEmail,
    telephone: seoPhone,
    knowsAbout: [...SEO.knowsAbout],
    sameAs: [
      BRAND.socials.linkedin,
      BRAND.socials.instagram,
      BRAND.socials.whatsapp,
      BRAND.socials.telegram,
    ].filter(Boolean),
    worksFor: {
      "@id": serviceId,
    },
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": serviceId,
    name: BRAND.name,
    alternateName: "Grow with Samah",
    url: SEO.siteUrl,
    email: contactEmail,
    telephone: seoPhone,
    description: SEO.description,
    image: absoluteUrl("/opengraph-image"),
    areaServed: "Worldwide",
    priceRange: "$$",
    knowsAbout: [...SEO.knowsAbout],
    sameAs: [
      BRAND.socials.linkedin,
      BRAND.socials.instagram,
      BRAND.socials.whatsapp,
      BRAND.socials.telegram,
    ].filter(Boolean),
    founder: {
      "@id": personId,
    },
    employee: {
      "@id": personId,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: contactEmail,
      telephone: seoPhone,
      availableLanguage: ["English", "French", "Arabic"],
    },
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SEO.siteUrl}/#website`,
    name: BRAND.name,
    alternateName: "Grow with Samah",
    url: SEO.siteUrl,
    description: SEO.description,
    inLanguage: "en",
    publisher: {
      "@id": personId,
    },
  };

  return (
    <div className="cursor-none-desktop dark min-h-screen bg-background text-foreground">
      <MarketingThemeLock />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
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
