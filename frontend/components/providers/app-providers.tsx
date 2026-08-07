"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { SiteBackground } from "@/components/layout/site-background";
import { CursorModeSync } from "@/components/providers/cursor-mode-sync";
import { useUiStore } from "@/stores/ui-store";

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

function useDeferredReady(timeoutMs = 2500) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let idleId: number | undefined;
    let timeoutId: number | undefined;

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

    const ric = window.requestIdleCallback;
    if (typeof ric === "function") {
      idleId = ric(enable, { timeout: timeoutMs });
    } else {
      timeoutId = window.setTimeout(enable, timeoutMs);
    }

    const hard = window.setTimeout(enable, timeoutMs + 500);

    return () => {
      cancelled = true;
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("keydown", onInteract);
      window.removeEventListener("scroll", onInteract);
      if (idleId !== undefined && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
      window.clearTimeout(hard);
    };
  }, [timeoutMs]);

  return ready;
}

function DeferredChrome() {
  const ready = useDeferredReady(2800);
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
      <CursorModeSync />
      <DeferredChrome />
      {children}
    </SmoothScrollProvider>
  );
}
