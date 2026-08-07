"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { prefersReducedMotion, isMobileViewport } from "@/lib/motion";

const DesktopLenis = dynamic(
  () =>
    import("@/components/providers/desktop-lenis").then(
      (mod) => mod.DesktopLenis,
    ),
  { ssr: false },
);

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Skip Lenis on mobile/touch — native scroll is smoother and lighter.
    // Also avoids downloading/parsing Lenis on the mobile Lighthouse path.
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    setEnabled(!prefersReducedMotion() && !isMobileViewport() && !coarse);
  }, []);

  if (!enabled) {
    return <>{children}</>;
  }

  return <DesktopLenis>{children}</DesktopLenis>;
}
