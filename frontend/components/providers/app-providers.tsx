"use client";

import dynamic from "next/dynamic";
import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { CustomCursor } from "@/components/layout/custom-cursor";
import { SiteBackground } from "@/components/layout/site-background";
import { ToastHost } from "@/components/ui/toast-host";
import { CursorModeSync } from "@/components/providers/cursor-mode-sync";
import { useUiStore } from "@/stores/ui-store";

const IntroAnimation = dynamic(
  () =>
    import("@/components/intro/intro-animation").then(
      (mod) => mod.IntroAnimation,
    ),
  { ssr: false },
);

const SamahAiWidget = dynamic(
  () =>
    import("@/components/ai/samah-ai-widget").then((mod) => mod.SamahAiWidget),
  { ssr: false },
);

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
