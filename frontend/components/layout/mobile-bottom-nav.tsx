"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLenis } from "lenis/react";
import {
  Home,
  Briefcase,
  Layers,
  BarChart3,
  CalendarDays,
  type LucideIcon,
} from "lucide-react";
import type { MouseEvent } from "react";
import { cn } from "@/lib/utils";
import { scrollToSection } from "@/components/layout/hash-scroll-handler";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  sectionId?: string;
  isActive: (pathname: string) => boolean;
};

const items: NavItem[] = [
  {
    href: "/",
    label: "Home",
    icon: Home,
    sectionId: "top",
    isActive: (pathname) => pathname === "/",
  },
  {
    href: "/#services",
    label: "Services",
    icon: Layers,
    sectionId: "services",
    isActive: () => false,
  },
  {
    href: "/portfolio",
    label: "Work",
    icon: Briefcase,
    isActive: (pathname) => pathname.startsWith("/portfolio"),
  },
  {
    href: "/#stats",
    label: "Results",
    icon: BarChart3,
    sectionId: "stats",
    isActive: () => false,
  },
  {
    href: "/book",
    label: "Book",
    icon: CalendarDays,
    isActive: (pathname) => pathname.startsWith("/book"),
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const lenis = useLenis();

  const onSectionClick = (
    event: MouseEvent<HTMLAnchorElement>,
    sectionId: string,
  ) => {
    event.preventDefault();

    if (pathname === "/") {
      scrollToSection(sectionId, lenis);
      window.history.replaceState(null, "", `/#${sectionId}`);
      return;
    }

    router.push(`/#${sectionId}`);
  };

  return (
    <nav
      aria-label="Mobile"
      className="glass-panel fixed inset-x-3 z-50 flex items-stretch justify-between rounded-full px-1.5 py-1.5 md:hidden bottom-[max(0.75rem,env(safe-area-inset-bottom))]"
    >
      {items.map(({ href, label, icon: Icon, sectionId, isActive }) => {
        const active = isActive(pathname);

        if (sectionId && sectionId !== "top") {
          return (
            <a
              key={href}
              href={href}
              onClick={(event) => onSectionClick(event, sectionId)}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-full px-1 py-2 text-[10px] font-medium uppercase tracking-wider transition",
                "text-muted active:scale-95",
                active && "bg-rose-400/20 text-rose-300",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              <span className="truncate">{label}</span>
            </a>
          );
        }

        if (sectionId === "top") {
          return (
            <Link
              key={href}
              href="/"
              onClick={(event) => {
                if (pathname === "/") {
                  event.preventDefault();
                  scrollToSection("top", lenis);
                  window.history.replaceState(null, "", "/");
                }
              }}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-full px-1 py-2 text-[10px] font-medium uppercase tracking-wider transition",
                "text-muted active:scale-95",
                active && "bg-rose-400/20 text-rose-300",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              <span className="truncate">{label}</span>
            </Link>
          );
        }

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-full px-1 py-2 text-[10px] font-medium uppercase tracking-wider transition",
              "text-muted active:scale-95",
              active && "bg-rose-400/20 text-rose-300",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            <span className="truncate">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
