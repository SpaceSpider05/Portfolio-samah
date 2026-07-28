"use client";

import { Home, Briefcase, Layers, BarChart3, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "#top", label: "Home", icon: Home },
  { href: "#services", label: "Services", icon: Layers },
  { href: "#portfolio", label: "Work", icon: Briefcase },
  { href: "#stats", label: "Results", icon: BarChart3 },
  { href: "#contact", label: "Contact", icon: Mail },
] as const;

export function MobileBottomNav() {
  return (
    <nav
      aria-label="Mobile"
      className="glass-panel fixed inset-x-3 bottom-3 z-50 flex items-center justify-between rounded-full px-2 py-2 md:hidden"
    >
      {items.map(({ href, label, icon: Icon }) => (
        <a
          key={href}
          href={href}
          className={cn(
            "flex flex-1 flex-col items-center gap-1 rounded-full px-1 py-1.5 text-[10px] uppercase tracking-wider text-muted transition hover:text-rose-500",
          )}
        >
          <Icon className="h-4 w-4" />
          <span>{label}</span>
        </a>
      ))}
    </nav>
  );
}
