"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { SiteBackground } from "@/components/layout/site-background";
import { CursorModeSync } from "@/components/providers/cursor-mode-sync";
import { useUiStore } from "@/stores/ui-store";
import { isMobileViewport } from "@/lib/motion";

const IntroAnimation = dynamic(
  () =>
    import("@/components/intro/intro-animation").then(
      (mod) => mod.IntroAnimation,
    ),
  { ssr: false },
);

const CustomCursor = dynamic(
  () =>
    import("@/components/layout/custom-cursor").then((mod) => mod.CustomCursor),
  { ssr: false },
);

const ToastHost = dynamic(
  () => import("@/components/ui/toast-host").then((mod) => mod.ToastHost),
  { ssr: false },
);

const SamahAiWidget = dynamic(
  () =>
    import("@/components/ai/samah-ai-widget").then((mod) => mod.SamahAiWidget),
  { ssr: false },
);

function useDeferredReady(timeoutMs = 8000) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const enable = () => {
      if (!cancelled) {
        setReady(true);
      }
    };

    const onInteract = () => enable();
    window.addEventListener("pointerdown", onInteract, {
      once: true,
      passive: true,
    });
    window.addEventListener("keydown", onInteract, { once: true });
    window.addEventListener("scroll", onInteract, {
      once: true,
      passive: true,
    });

    // Long idle fallback — avoids competing with LCP on lab runs.
    const timeoutId = window.setTimeout(enable, timeoutMs);

    return () => {
      cancelled = true;
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("keydown", onInteract);
      window.removeEventListener("scroll", onInteract);
      window.clearTimeout(timeoutId);
    };
  }, [timeoutMs]);

  return ready;
}

function DeferredChrome() {
  const ready = useDeferredReady(10000);
  if (!ready) {
    return null;
  }

  return (
    <>
      <CustomCursor />
      <ToastHost />
      <SamahAiWidget />
    </>
  );
}

export function AppProviders({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  // Conversion pages: skip Lenis so the form becomes interactive sooner.
  const enableSmoothScroll = pathname !== "/book" && pathname !== "/privacy";
  const setIntroComplete = useUiStore((s) => s.setIntroComplete);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    if (!isHome) {
      setIntroComplete(true);
      setShowIntro(false);
      return;
    }

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const mobile = isMobileViewport() || coarse;
    if (mobile) {
      setIntroComplete(true);
      setShowIntro(false);
      return;
    }

    setShowIntro(true);
  }, [isHome, setIntroComplete]);

  return (
    <SmoothScrollProvider enabled={enableSmoothScroll}>
      <SiteBackground lite={!isHome} />
      {showIntro ? <IntroAnimation /> : null}
      <CursorModeSync />
      <DeferredChrome />
      {children}
    </SmoothScrollProvider>
  );
}
