"use client";

import { useCallback, type MouseEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLenis } from "lenis/react";
import { scrollToSection } from "@/components/layout/hash-scroll-handler";
import { useNavStore } from "@/stores/nav-store";

export function getSectionIdFromHref(href: string): string | null {
  if (href.startsWith("/#")) {
    return href.slice(2);
  }
  if (href.startsWith("#")) {
    return href.slice(1);
  }
  return null;
}

export function useNavLinks() {
  const pathname = usePathname();
  const router = useRouter();
  const lenis = useLenis();
  const activeSection = useNavStore((state) => state.activeSection);
  const setActiveSection = useNavStore((state) => state.setActiveSection);

  const onHashLinkClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, href: string) => {
      const sectionId = getSectionIdFromHref(href);
      if (!sectionId) {
        return;
      }

      event.preventDefault();
      setActiveSection(sectionId);

      if (pathname === "/") {
        scrollToSection(sectionId, lenis);
        window.history.replaceState(null, "", `/#${sectionId}`);
        return;
      }

      router.push(`/#${sectionId}`);
    },
    [lenis, pathname, router, setActiveSection],
  );

  const isLinkActive = useCallback(
    (href: string) => {
      const sectionId = getSectionIdFromHref(href);

      if (sectionId) {
        return pathname === "/" && activeSection === sectionId;
      }

      if (href === "/") {
        return pathname === "/" && !activeSection;
      }

      return pathname === href || pathname.startsWith(`${href}/`);
    },
    [activeSection, pathname],
  );

  return { onHashLinkClick, isLinkActive, activeSection };
}
