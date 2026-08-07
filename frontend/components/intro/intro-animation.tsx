"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { BRAND } from "@/constants/brand";
import { gsap, registerGsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion, isMobileViewport } from "@/lib/motion";
import { useUiStore } from "@/stores/ui-store";

const INTRO_SEEN_KEY = "samah-intro-seen";

export function IntroAnimation() {
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const setIntroComplete = useUiStore((s) => s.setIntroComplete);
  const introComplete = useUiStore((s) => s.introComplete);

  registerGsap();

  const finish = () => {
    try {
      sessionStorage.setItem(INTRO_SEEN_KEY, "1");
    } catch {
      // ignore
    }
    setIntroComplete(true);
    document.documentElement.classList.remove("overflow-hidden");
  };

  useEffect(() => {
    const seen =
      typeof window !== "undefined" &&
      sessionStorage.getItem(INTRO_SEEN_KEY) === "1";
    const coarse =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches;
    // Keep the intro on desktop; skip on mobile/touch so first paint isn't blocked.
    const skipMobile = isMobileViewport() || coarse;

    if (pathname !== "/" || seen || prefersReducedMotion() || skipMobile) {
      finish();
    }
  }, [pathname]);

  useEffect(() => {
    if (!introComplete) {
      document.documentElement.classList.add("overflow-hidden");
    }
  }, [introComplete]);

  useGSAP(
    () => {
      if (introComplete || pathname !== "/") {
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        onComplete: finish,
      });

      tl.fromTo(
        logoRef.current,
        { opacity: 0, scale: 0.92, y: 12 },
        { opacity: 1, scale: 1, y: 0, duration: 0.55 },
      )
        .to(logoRef.current, {
          opacity: 0,
          y: -10,
          duration: 0.3,
          delay: 0.2,
        })
        .to(rootRef.current, { opacity: 0, duration: 0.35 }, "-=0.1");
    },
    { scope: rootRef, dependencies: [introComplete, pathname] },
  );

  if (introComplete || pathname !== "/") {
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

      <div ref={logoRef} className="relative text-center">
        <p className="type-overline mb-3 text-rose-300">Digital Studio</p>
        <p className="font-display text-5xl text-fantasy-100 md:text-7xl">{BRAND.name}</p>
      </div>
    </div>
  );
}
