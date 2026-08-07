import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { HeroSection } from "@/components/hero/hero-section";
import { TrustBarSection } from "@/components/landing/trust-bar-section";
import { SkillsSection } from "@/components/landing/skills-section";
import {
  LazyClientSection,
  loadFaq,
  loadProcess,
  loadWhyMe,
} from "@/components/landing/lazy-client-section";
import { SectionDivider } from "@/components/ui/section-divider";
import { BRAND } from "@/constants/brand";
import { SEO, absoluteUrl, pageMetadata } from "@/constants/seo";
import { getAbout, getProjects, getServices, getSiteSettings, getStats } from "@/services/api";

function SectionSkeleton({ minHeight = "24rem" }: { minHeight?: string }) {
  return (
    <div
      aria-hidden
      className="section-pad mx-auto max-w-6xl"
      style={{ minHeight }}
    />
  );
}

const AboutSection = dynamic(
  () =>
    import("@/components/about/about-section").then((mod) => mod.AboutSection),
  { loading: () => <SectionSkeleton minHeight="36rem" /> },
);
const ServicesSection = dynamic(
  () =>
    import("@/components/services/services-section").then(
      (mod) => mod.ServicesSection,
    ),
  { loading: () => <SectionSkeleton /> },
);
const PortfolioSection = dynamic(
  () =>
    import("@/components/portfolio/portfolio-section").then(
      (mod) => mod.PortfolioSection,
    ),
  { loading: () => <SectionSkeleton /> },
);
const StatsSection = dynamic(
  () =>
    import("@/components/stats/stats-section").then((mod) => mod.StatsSection),
  { loading: () => <SectionSkeleton /> },
);
const FinalCtaSection = dynamic(
  () =>
    import("@/components/landing/final-cta-section").then(
      (mod) => mod.FinalCtaSection,
    ),
  { loading: () => <SectionSkeleton minHeight="20rem" /> },
);
const ContactSection = dynamic(
  () =>
    import("@/components/landing/contact-section").then(
      (mod) => mod.ContactSection,
    ),
  { loading: () => <SectionSkeleton /> },
);

export const metadata: Metadata = {
  ...pageMetadata(SEO.pages.home),
  title: {
    absolute: SEO.pages.home.title,
  },
};

export default async function HomePage() {
  const [about, services, projects, stats, siteSettings] = await Promise.all([
    getAbout(),
    getServices(),
    getProjects(),
    getStats(),
    getSiteSettings(),
  ]);

  // Homepage featured strip: only the 3 most recently created projects.
  const featuredProjects = [...projects]
    .sort((a, b) => {
      const aTime = a.createdAt ? Date.parse(a.createdAt) : Number.NaN;
      const bTime = b.createdAt ? Date.parse(b.createdAt) : Number.NaN;
      if (!Number.isNaN(aTime) && !Number.isNaN(bTime) && aTime !== bTime) {
        return bTime - aTime;
      }

      const aId = Number(a.id);
      const bId = Number(b.id);
      if (!Number.isNaN(aId) && !Number.isNaN(bId)) {
        return bId - aId;
      }

      return String(b.id).localeCompare(String(a.id));
    })
    .slice(0, 3);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SEO.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const servicesJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Digital marketing services",
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: service.title,
        description: service.description,
        provider: {
          "@type": "Person",
          name: BRAND.name,
          url: SEO.siteUrl,
        },
        areaServed: "Worldwide",
        url: absoluteUrl("/#services"),
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }}
      />
      <HeroSection about={about} stats={stats} />
      <TrustBarSection />
      <AboutSection about={about} />
      <SectionDivider />
      <ServicesSection services={services} />
      <LazyClientSection
        loader={loadWhyMe}
        fallback={<SectionSkeleton />}
      />
      <PortfolioSection projects={featuredProjects} />
      <LazyClientSection
        loader={loadProcess}
        fallback={<SectionSkeleton minHeight="40rem" />}
      />
      <SkillsSection />
      <StatsSection stats={stats} />
      <LazyClientSection loader={loadFaq} fallback={<SectionSkeleton />} />
      <FinalCtaSection />
      <ContactSection contactEmail={siteSettings.contactEmail} />
    </>
  );
}
