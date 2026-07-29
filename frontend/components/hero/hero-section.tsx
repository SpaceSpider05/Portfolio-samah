"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { BRAND } from "@/constants/brand";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { gsap, registerGsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { useUiStore } from "@/stores/ui-store";

function HeroDashboard() {
  return (
    <div className="glass-panel mx-auto flex h-full min-h-80 w-full max-w-md items-center justify-center rounded-[1.75rem] p-6">
      <div className="w-full max-w-xs">
        <div className="mb-3 h-2.5 w-2/3 rounded-full bg-rose-400/80" />
        <div className="mb-4 grid grid-cols-2 gap-2">
          <div className="h-10 rounded-xl bg-vanilla-200/35" />
          <div className="h-10 rounded-xl bg-silver-300/25" />
        </div>
        <div className="flex h-28 items-end gap-1.5">
          {[40, 65, 52, 88, 100, 74].map((height, index) => (
            <div
              key={height}
              className="hero-bar flex-1 origin-bottom rounded-t-md bg-linear-to-t from-rose-500 to-rose-300"
              style={{
                height: `${height}%`,
                animationDelay: `${index * 0.12}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  const router = useRouter();
  const rootRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const introComplete = useUiStore((s) => s.introComplete);

  registerGsap();

  useGSAP(
    () => {
      if (!introComplete || !headlineRef.current) {
        return;
      }

      if (prefersReducedMotion()) {
        gsap.set([".hero-sub", ".hero-cta"], { opacity: 1, y: 0 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(headlineRef.current, {
        y: 28,
        opacity: 0,
        duration: 0.7,
      })
        .from(".hero-sub", { y: 18, opacity: 0, duration: 0.5 }, "-=0.35")
        .from(".hero-cta", { y: 14, opacity: 0, duration: 0.45 }, "-=0.25");
    },
    { scope: rootRef, dependencies: [introComplete] },
  );

  return (
    <section id="top" ref={rootRef} className="section-pad relative min-h-svh pt-28 md:pt-32">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-12">
        <div className="relative z-10">
          <p className="type-overline mb-4">Premium Digital Marketing</p>
          <h1 ref={headlineRef} className="type-display">
            {BRAND.tagline}
          </h1>
          <p className="hero-sub type-subheading mt-6 max-w-xl">{BRAND.subtitle}</p>
          <div className="hero-cta mt-8 flex flex-wrap gap-3">
            <MagneticButton onClick={() => router.push("/book")}>
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

        <div className="relative h-85 w-full md:h-110 lg:h-130">
          <HeroDashboard />
        </div>
      </div>
    </section>
  );
}
