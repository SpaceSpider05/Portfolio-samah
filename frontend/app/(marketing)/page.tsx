import type { Metadata } from "next";
import { HeroSection } from "@/components/hero/hero-section";
import { TrustBarSection } from "@/components/landing/trust-bar-section";
import { AboutSection } from "@/components/about/about-section";
import { ServicesSection } from "@/components/services/services-section";
import { WhyMeSection } from "@/components/landing/why-me-section";
import { PortfolioSection } from "@/components/portfolio/portfolio-section";
import { ProcessSection } from "@/components/landing/process-section";
import { SkillsSection } from "@/components/landing/skills-section";
import { StatsSection } from "@/components/stats/stats-section";
import { FaqSection } from "@/components/landing/faq-section";
import { FinalCtaSection } from "@/components/landing/final-cta-section";
import { ContactSection } from "@/components/landing/contact-section";
import { SectionDivider } from "@/components/ui/section-divider";
import { BRAND } from "@/constants/brand";
import { SEO, absoluteUrl, pageMetadata } from "@/constants/seo";
import { getAbout, getProjects, getServices, getSiteSettings, getStats } from "@/services/api";

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
      <WhyMeSection />
      <PortfolioSection projects={featuredProjects} />
      <ProcessSection />
      <SkillsSection />
      <StatsSection stats={stats} />
      <FaqSection />
      <FinalCtaSection />
      <ContactSection contactEmail={siteSettings.contactEmail} />
    </>
  );
}
