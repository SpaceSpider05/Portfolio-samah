"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { isMobileViewport } from "@/lib/motion";

const HeroGlobe = dynamic(
  () => import("@/components/hero/hero-globe").then((mod) => mod.HeroGlobe),
  { ssr: false },
);

/**
 * Keeps the globe slot reserved (CLS=0) while deferring WebGL until after
 * first paint. On mobile, wait for interaction (or a long idle fallback) so
 * WebGL never competes with LCP/TBT on the critical path.
 */
export function DeferredHeroGlobe() {
  const slotRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [ready, setReady] = useState(false);

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
        setReady(true);
      }
    };

    const mobile = isMobileViewport();
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    if (mobile || coarse) {
      const onInteract = () => enable();
      window.addEventListener("pointerdown", onInteract, {
        once: true,
        passive: true,
      });
      window.addEventListener("scroll", onInteract, {
        once: true,
        passive: true,
      });
      // Long fallback so real users still see the globe if they never interact.
      timeoutId = window.setTimeout(enable, 8000);
      return () => {
        cancelled = true;
        window.removeEventListener("pointerdown", onInteract);
        window.removeEventListener("scroll", onInteract);
        if (timeoutId !== undefined) {
          window.clearTimeout(timeoutId);
        }
      };
    }

    const ric = window.requestIdleCallback;
    if (typeof ric === "function") {
      idleId = ric(enable, { timeout: 1800 });
    } else {
      timeoutId = window.setTimeout(enable, 1200);
    }
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
      {ready && inView ? <HeroGlobe /> : null}
    </div>
  );
}
