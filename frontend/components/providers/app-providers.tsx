"use client";

import type { ReactNode } from "react";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { CustomCursor } from "@/components/layout/custom-cursor";
import { IntroAnimation } from "@/components/intro/intro-animation";
import { SiteBackground } from "@/components/layout/site-background";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SmoothScrollProvider>
      <SiteBackground />
      <IntroAnimation />
      <CustomCursor />
      {children}
    </SmoothScrollProvider>
  );
}
