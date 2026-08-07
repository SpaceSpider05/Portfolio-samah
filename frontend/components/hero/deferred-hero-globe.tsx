"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const HeroGlobe = dynamic(
  () => import("@/components/hero/hero-globe").then((mod) => mod.HeroGlobe),
  { ssr: false },
);

/**
 * Keeps the globe slot reserved (CLS=0) while deferring WebGL until after
 * first paint / idle and while the hero is on screen.
 */
export function DeferredHeroGlobe() {
  const slotRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [idleReady, setIdleReady] = useState(false);

  useEffect(() => {
    const node = slotRef.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(Boolean(entry?.isIntersecting));
      },
      { rootMargin: "120px 0px", threshold: 0.05 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    let idleId: number | undefined;
    let timeoutId: number | undefined;

    const enable = () => {
      if (!cancelled) {
        setIdleReady(true);
      }
    };

    const ric = window.requestIdleCallback;
    if (typeof ric === "function") {
      idleId = ric(enable, { timeout: 1800 });
    } else {
      timeoutId = window.setTimeout(enable, 1200);
    }

    // Hard fallback so the globe still appears on slow devices.
    const hard = window.setTimeout(enable, 2200);

    return () => {
      cancelled = true;
      if (idleId !== undefined && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
      window.clearTimeout(hard);
    };
  }, []);

  return (
    <div
      ref={slotRef}
      className="relative mx-auto aspect-square w-full max-w-[22rem] md:max-w-[26rem] lg:max-w-none"
    >
      {idleReady && inView ? <HeroGlobe /> : null}
    </div>
  );
}
