import type { ReactNode } from "react";
import { Suspense } from "react";
import { AppProviders } from "@/components/providers/app-providers";
import { MarketingThemeLock } from "@/components/providers/marketing-theme-lock";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { HashScrollHandler } from "@/components/layout/hash-scroll-handler";
import { ActiveSectionTracker } from "@/components/layout/active-section-tracker";
import { BRAND } from "@/constants/brand";
import { getSiteSettings } from "@/services/api";

async function MarketingFooter() {
  const siteSettings = await getSiteSettings();
  const contactEmail = siteSettings.contactEmail || BRAND.email;
  const contactPhone =
    siteSettings.contactPhone?.trim() || BRAND.phone || null;

  return <SiteFooter contactEmail={contactEmail} contactPhone={contactPhone} />;
}

export default function MarketingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="cursor-none-desktop dark min-h-screen bg-background text-foreground">
      <MarketingThemeLock />
      <AppProviders>
        <HashScrollHandler />
        <ActiveSectionTracker />
        <SiteHeader />
        <main className="relative z-10 pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-0">
          {children}
        </main>
        <Suspense fallback={<SiteFooter contactEmail={BRAND.email} contactPhone={BRAND.phone || null} />}>
          <MarketingFooter />
        </Suspense>
        <MobileBottomNav />
      </AppProviders>
    </div>
  );
}
