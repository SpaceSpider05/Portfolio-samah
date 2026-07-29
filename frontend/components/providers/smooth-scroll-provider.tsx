"use client";

import { ReactLenis, useLenis } from "lenis/react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { prefersReducedMotion, isMobileViewport } from "@/lib/motion";
import { registerGsap, ScrollTrigger } from "@/lib/gsap";

function LenisScrollTriggerBridge() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) {
      return;
    }

    registerGsap();

    lenis.on("scroll", ScrollTrigger.update);

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };

    // Lenis root already rAFs; keep ScrollTrigger in sync on resize/refresh.
    const onRefresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", onRefresh);
    const timer = window.setTimeout(onRefresh, 300);

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      window.removeEventListener("load", onRefresh);
      window.clearTimeout(timer);
      void ticker;
    };
  }, [lenis]);

  return null;
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Skip Lenis on mobile/touch — native scroll is smoother and lighter.
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    setEnabled(!prefersReducedMotion() && !isMobileViewport() && !coarse);
  }, []);

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1,
        smoothWheel: true,
        syncTouch: false,
      }}
    >
      <LenisScrollTriggerBridge />
      {children}
    </ReactLenis>
  );
}
