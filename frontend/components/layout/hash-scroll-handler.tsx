"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";

const HEADER_OFFSET = -96;

export function scrollToSection(id: string, lenis?: ReturnType<typeof useLenis>) {
  const target = document.getElementById(id);
  if (!target) {
    return;
  }

  if (lenis) {
    lenis.scrollTo(target, { offset: HEADER_OFFSET });
    return;
  }

  const top = target.getBoundingClientRect().top + window.scrollY + HEADER_OFFSET;
  window.scrollTo({ top, behavior: "smooth" });
}

/** Scrolls to `#hash` after client navigations (Next often skips this). */
export function HashScrollHandler() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) {
      return;
    }

    const timer = window.setTimeout(() => {
      scrollToSection(hash, lenis);
    }, 80);

    return () => window.clearTimeout(timer);
  }, [pathname, lenis]);

  return null;
}
