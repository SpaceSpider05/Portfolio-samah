"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/constants/brand";
import { getSectionIdFromHref } from "@/hooks/use-nav-links";
import { useNavStore } from "@/stores/nav-store";

const SECTION_IDS = [
  ...new Set([
    ...NAV_LINKS.map((link) => getSectionIdFromHref(link.href)).filter(
      (id): id is string => Boolean(id),
    ),
    "stats",
  ]),
];

/** Keeps shared nav active-section state in sync with scroll + hash. */
export function ActiveSectionTracker() {
  const pathname = usePathname();
  const setActiveSection = useNavStore((state) => state.setActiveSection);

  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection(null);
      return;
    }

    const syncFromHash = () => {
      const hash = window.location.hash.replace(/^#/, "");
      setActiveSection(hash || null);
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);

    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );

    if (elements.length === 0) {
      return () => window.removeEventListener("hashchange", syncFromHash);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const top = visible[0]?.target.id;
        if (top) {
          setActiveSection(top);
        }
      },
      {
        rootMargin: "-35% 0px -45% 0px",
        threshold: [0.15, 0.35, 0.55],
      },
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("hashchange", syncFromHash);
      observer.disconnect();
    };
  }, [pathname, setActiveSection]);

  return null;
}
