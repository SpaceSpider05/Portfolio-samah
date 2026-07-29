"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BRAND, NAV_LINKS } from "@/constants/brand";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { getSectionIdFromHref, useNavLinks } from "@/hooks/use-nav-links";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const router = useRouter();
  const { onHashLinkClick, isLinkActive } = useNavLinks();

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] md:px-8 md:pt-4">
      <div className="glass-panel mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full px-3 py-2 md:px-6 md:py-2.5">
        <Link
          href="/"
          className="font-display shrink-0 text-xl tracking-tight text-fantasy-200 transition active:scale-95 md:text-2xl"
        >
          {BRAND.name}
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => {
            const active = isLinkActive(link.href);
            const sectionId = getSectionIdFromHref(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                onClick={
                  sectionId
                    ? (event) => onHashLinkClick(event, link.href)
                    : undefined
                }
                className={cn(
                  "type-caption transition active:scale-95 active:text-rose-300",
                  active
                    ? "text-rose-400"
                    : "text-vanilla-200/85 hover:text-rose-400",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <MagneticButton
          className="px-4! py-2! text-xs sm:inline-flex sm:px-6! sm:py-3! sm:text-sm"
          onClick={() => router.push("/book")}
        >
          <span className="sm:hidden">Book</span>
          <span className="hidden sm:inline">Book Consultation</span>
        </MagneticButton>
      </div>
    </header>
  );
}
