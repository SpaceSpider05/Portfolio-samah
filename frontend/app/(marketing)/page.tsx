import { HeroSection } from "@/components/hero/hero-section";
import { AboutSection } from "@/components/about/about-section";
import { ServicesSection } from "@/components/services/services-section";
import { PortfolioSection } from "@/components/portfolio/portfolio-section";
import { StatsSection } from "@/components/stats/stats-section";
import { SectionDivider } from "@/components/ui/section-divider";
import { getAbout, getProjects, getServices, getStats } from "@/services/api";

export default async function HomePage() {
  const [about, services, projects, stats] = await Promise.all([
    getAbout(),
    getServices(),
    getProjects(),
    getStats(),
  ]);

  const featuredProjects = [...projects]
    .sort((a, b) => Number(b.id) - Number(a.id))
    .slice(0, 3);

  const featuredServices = [...services]
    .sort((a, b) => Number(b.id) - Number(a.id))
    .slice(0, 3);

  return (
    <>
      <HeroSection />
      <SectionDivider />
      <AboutSection about={about} />
      <SectionDivider />
      <ServicesSection services={featuredServices} />
      <SectionDivider />
      <PortfolioSection projects={featuredProjects} />
      <SectionDivider />
      <StatsSection stats={stats} />
    </>
  );
}
