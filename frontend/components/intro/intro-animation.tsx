"use client";

import { useEffect, useRef } from "react";
import { BRAND } from "@/constants/brand";
import { gsap, registerGsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { useUiStore } from "@/stores/ui-store";

export function IntroAnimation() {
  const rootRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const setIntroComplete = useUiStore((s) => s.setIntroComplete);
  const introComplete = useUiStore((s) => s.introComplete);

  registerGsap();

  const finish = () => {
    setIntroComplete(true);
    document.documentElement.classList.remove("overflow-hidden");
  };

  useEffect(() => {
    if (!introComplete) {
      document.documentElement.classList.add("overflow-hidden");
    }
  }, [introComplete]);

  useGSAP(
    () => {
      if (introComplete) {
        return;
      }

      if (prefersReducedMotion()) {
        finish();
        return;
      }

      const particles = particlesRef.current?.querySelectorAll(".particle");
      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        onComplete: finish,
      });

      tl.fromTo(
        logoRef.current,
        { opacity: 0, scale: 0.85, filter: "blur(8px)" },
        { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.7 },
      )
        .to(logoRef.current, {
          opacity: 0,
          scale: 1.15,
          filter: "blur(4px)",
          duration: 0.35,
          delay: 0.25,
        })
        .fromTo(
          particles ?? [],
          { opacity: 1, scale: 0, x: 0, y: 0 },
          {
            opacity: 0,
            scale: 1,
            duration: 0.9,
            stagger: 0.01,
            x: () => gsap.utils.random(-220, 220),
            y: () => gsap.utils.random(-160, 160),
          },
          "-=0.2",
        )
        .to(rootRef.current, { opacity: 0, duration: 0.45 }, "-=0.2");
    },
    { scope: rootRef, dependencies: [introComplete] },
  );

  if (introComplete) {
    return null;
  }

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-tobago-800"
      role="dialog"
      aria-label="Site introduction"
    >
      <button
        type="button"
        onClick={finish}
        className="absolute right-6 top-6 z-10 text-xs uppercase tracking-[0.2em] text-fantasy-200/70 transition hover:text-rose-300"
      >
        Skip
      </button>

      <div
        ref={logoRef}
        className="relative text-center"
        style={{ textShadow: "0 0 40px color-mix(in oklab, #DBA1A2 55%, transparent)" }}
      >
        <p className="type-overline mb-3 text-rose-300">Digital Studio</p>
        <p className="font-display text-5xl text-fantasy-100 md:text-7xl">{BRAND.name}</p>
      </div>

      <div ref={particlesRef} className="pointer-events-none absolute inset-0" aria-hidden>
        {Array.from({ length: 28 }).map((_, index) => (
          <span
            key={index}
            className="particle absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-rose-300"
          />
        ))}
      </div>
    </div>
  );
}
