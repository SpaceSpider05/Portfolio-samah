"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import type { AboutContent, StatsContent } from "@/types";
import { LANDING } from "@/constants/landing";
import { MagneticButton } from "@/components/ui/magnetic-button";

const HeroGlobe = dynamic(
  () => import("@/components/hero/hero-globe").then((mod) => mod.HeroGlobe),
  { ssr: false },
);

type HeroSectionProps = {
  about: AboutContent;
  stats: StatsContent;
};

export function HeroSection({ about, stats }: HeroSectionProps) {
  const router = useRouter();

  const heroStats =
    about.achievements.length > 0
      ? about.achievements.slice(0, 4).map((item) => ({
          label: item.label,
          value: `${item.value}${item.suffix}`,
        }))
      : stats.metrics.slice(0, 4).map((item) => ({
          label: item.label,
          value: `${item.prefix ?? ""}${item.value}${item.suffix}`,
        }));

  return (
    <section id="top" className="section-pad relative min-h-svh overflow-hidden pt-28 md:pt-32">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <span className="hero-orb hero-orb-1" />
        <span className="hero-orb hero-orb-2" />
        <span className="hero-orb hero-orb-3" />
        <span className="hero-ring hero-ring-1" />
        <span className="hero-ring hero-ring-2" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        <div>
          <div className="hero-float-badge inline-flex flex-col gap-2 rounded-2xl border border-rose-400/25 bg-tobago-800/40 px-4 py-3 backdrop-blur-sm">
            <p className="text-sm font-medium text-rose-300">{LANDING.hero.badge}</p>
            <p className="text-xs text-muted">{LANDING.hero.specialties}</p>
          </div>

          <h1 className="type-h1 mt-6 max-w-2xl text-balance">
            {LANDING.hero.headline}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            {LANDING.hero.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <MagneticButton onClick={() => router.push("/book")}>
              {LANDING.hero.primaryCta}
            </MagneticButton>
            <MagneticButton
              variant="secondary"
              cursorLabel="View"
              onClick={() =>
                document
                  .querySelector("#portfolio")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              {LANDING.hero.secondaryCta}
            </MagneticButton>
          </div>

          {heroStats.length > 0 ? (
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {heroStats.map((item) => (
                <div key={item.label}>
                  <p className="font-display text-2xl text-fantasy-100 md:text-3xl">
                    {item.value}
                  </p>
                  <p className="mt-1 text-xs text-muted">{item.label}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <HeroGlobe />
      </div>
    </section>
  );
}
