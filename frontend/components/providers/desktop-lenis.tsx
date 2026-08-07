"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";
import "lenis/dist/lenis.css";

/** Desktop-only smooth scroll. Loaded dynamically so mobile never parses Lenis. */
export function DesktopLenis({ children }: { children: ReactNode }) {
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
      {children}
    </ReactLenis>
  );
}
