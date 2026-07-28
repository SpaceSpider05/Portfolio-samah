"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import SplitType from "split-type";
import { BRAND } from "@/constants/brand";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { gsap, registerGsap, useGSAP } from "@/lib/gsap";
import { isMobileViewport, prefersReducedMotion } from "@/lib/motion";
import { useUiStore } from "@/stores/ui-store";

const MarketingHeroCanvas = dynamic(
  () =>
    import("@/components/hero/marketing-hero-canvas").then((m) => m.MarketingHeroCanvas),
  { ssr: false, loading: () => <HeroDashboardFallback /> },
);

function HeroDashboardFallback() {
  return (
    <div className="glass-panel mx-auto flex h-full min-h-[320px] w-full max-w-md items-center justify-center rounded-[1.75rem] p-6">
      <div className="w-full max-w-xs">
        <div className="mb-3 h-2.5 w-2/3 rounded-full bg-rose-400/80" />
        <div className="mb-4 grid grid-cols-2 gap-2">
          <div className="h-10 rounded-xl bg-vanilla-200/35" />
          <div className="h-10 rounded-xl bg-silver-300/25" />
        </div>
        <div className="flex h-28 items-end gap-1.5">
          {[40, 65, 52, 88, 100, 74].map((h) => (
            <div
              key={h}
              className="flex-1 rounded-t-md bg-gradient-to-t from-rose-500 to-rose-300"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  const rootRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const introComplete = useUiStore((s) => s.introComplete);
  const [enable3d, setEnable3d] = useState(false);

  registerGsap();

  useEffect(() => {
    setEnable3d(!prefersReducedMotion() && !isMobileViewport());
  }, []);

  useGSAP(
    () => {
      if (!introComplete || !headlineRef.current) {
        return;
      }

      if (prefersReducedMotion()) {
        gsap.set([".hero-sub", ".hero-cta"], { opacity: 1, y: 0 });
        return;
      }

      const split = new SplitType(headlineRef.current, { types: "words,chars" });
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(split.chars, {
        yPercent: 110,
        opacity: 0,
        filter: "blur(8px)",
        stagger: 0.018,
        duration: 0.85,
      })
        .from(".hero-sub", { y: 24, opacity: 0, duration: 0.6 }, "-=0.35")
        .from(".hero-cta", { y: 18, opacity: 0, stagger: 0.1, duration: 0.5 }, "-=0.3");

      return () => {
        split.revert();
      };
    },
    { scope: rootRef, dependencies: [introComplete] },
  );

  return (
    <section id="top" ref={rootRef} className="section-pad relative min-h-[100svh] pt-28 md:pt-32">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-12">
        <div className="relative z-10">
          <p className="type-overline mb-4">Premium Digital Marketing</p>
          <h1 ref={headlineRef} className="type-display">
            {BRAND.tagline}
          </h1>
          <p className="hero-sub type-subheading mt-6 max-w-xl">{BRAND.subtitle}</p>
          <div className="hero-cta mt-8 flex flex-wrap gap-3">
            <MagneticButton
              onClick={() =>
                document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Book Consultation
            </MagneticButton>
            <MagneticButton
              variant="secondary"
              cursorLabel="View"
              onClick={() =>
                document.querySelector("#portfolio")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Explore Portfolio
            </MagneticButton>
          </div>
        </div>

        <div className="relative h-[340px] w-full md:h-[440px] lg:h-[520px]">
          {enable3d ? <MarketingHeroCanvas /> : <HeroDashboardFallback />}
        </div>
      </div>
    </section>
  );
}
