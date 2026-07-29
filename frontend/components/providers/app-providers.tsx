"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { CustomCursor } from "@/components/layout/custom-cursor";
import { IntroAnimation } from "@/components/intro/intro-animation";
import { SiteBackground } from "@/components/layout/site-background";
import { ToastHost } from "@/components/ui/toast-host";
import { SamahAiWidget } from "@/components/ai/samah-ai-widget";
import { CursorModeSync } from "@/components/providers/cursor-mode-sync";
import { useUiStore } from "@/stores/ui-store";

export function AppProviders({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const setIntroComplete = useUiStore((s) => s.setIntroComplete);

  useEffect(() => {
    if (!isHome) {
      setIntroComplete(true);
    }
  }, [isHome, setIntroComplete]);

  return (
    <SmoothScrollProvider>
      <SiteBackground lite={!isHome} />
      {isHome ? <IntroAnimation /> : null}
      <CustomCursor />
      <CursorModeSync />
      <ToastHost />
      <SamahAiWidget />
      {children}
    </SmoothScrollProvider>
  );
}
