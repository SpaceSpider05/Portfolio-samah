"use client";

import { useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";

type LazyClientSectionProps<P extends object = Record<string, never>> = {
  loader: () => Promise<{ default: ComponentType<P> }>;
  fallback: ReactNode;
  rootMargin?: string;
  componentProps?: P;
};

/**
 * Mounts a client-only section when it nears the viewport so heavy animation
 * libraries (e.g. framer-motion) are not downloaded during LCP.
 */
export function LazyClientSection<P extends object = Record<string, never>>({
  loader,
  fallback,
  rootMargin = "280px 0px",
  componentProps,
}: LazyClientSectionProps<P>) {
  const ref = useRef<HTMLDivElement>(null);
  const [Comp, setComp] = useState<ComponentType<P> | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    let cancelled = false;

    const load = () => {
      loader()
        .then((mod) => {
          if (!cancelled) {
            setComp(() => mod.default);
          }
        })
        .catch(() => {
          // Keep fallback on failure.
        });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          observer.disconnect();
          load();
        }
      },
      { rootMargin, threshold: 0.01 },
    );

    observer.observe(node);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [loader, rootMargin]);

  const props = (componentProps ?? {}) as P;

  return <div ref={ref}>{Comp ? <Comp {...props} /> : fallback}</div>;
}

export const loadWhyMe = () =>
  import("@/components/landing/why-me-section").then((m) => ({
    default: m.WhyMeSection,
  }));

export const loadProcess = () =>
  import("@/components/landing/process-section").then((m) => ({
    default: m.ProcessSection,
  }));

export const loadFaq = () =>
  import("@/components/landing/faq-section").then((m) => ({
    default: m.FaqSection,
  }));
