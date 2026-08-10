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

export function SmoothScrollProvider({
  children,
  enabled: enabledProp = true,
}: {
  children: ReactNode;
  /** When false, skip Lenis entirely (e.g. conversion pages). */
  enabled?: boolean;
}) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!enabledProp) {
      setEnabled(false);
      return;
    }
    // Skip Lenis on mobile/touch — native scroll is smoother and lighter.
    // Also avoids downloading/parsing Lenis on the mobile Lighthouse path.
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    setEnabled(!prefersReducedMotion() && !isMobileViewport() && !coarse);
  }, [enabledProp]);

  if (!enabled) {
    return <>{children}</>;
  }

  return <DesktopLenis>{children}</DesktopLenis>;
}
