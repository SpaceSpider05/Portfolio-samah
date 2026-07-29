"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Briefcase,
  CalendarDays,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  MessagesSquare,
  Moon,
  Settings,
  Sun,
  X,
} from "lucide-react";
import { useEffect, useState, type ComponentType } from "react";
import { ADMIN_NAV } from "@/constants/admin";
import { BRAND } from "@/constants/brand";
import { useAdminAuthStore } from "@/stores/admin-auth-store";
import { cn } from "@/lib/utils";

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Briefcase,
  Layers,
  CalendarDays,
  MessagesSquare,
  Settings,
};

export function AdminSidebar() {
  const pathname = usePathname();
  const logout = useAdminAuthStore((s) => s.logout);
  const email = useAdminAuthStore((s) => s.email);
  const hydrate = useAdminAuthStore((s) => s.hydrate);
  const { resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    void hydrate();
    setMounted(true);
  }, [hydrate]);

  const handleLogout = async () => {
    await logout();
    window.location.assign("/admin/login");
  };

  const nav = (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-5 py-5">
        <p className="font-display text-2xl text-heading">{BRAND.name}</p>
        <p className="type-caption mt-1">Admin Console</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Admin">
        {ADMIN_NAV.map((item) => {
          const Icon = ICONS[item.icon] ?? LayoutDashboard;
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                active
                  ? "bg-rose-400/20 text-heading"
                  : "text-muted hover:bg-surface-muted/40 hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-border p-4">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted transition hover:bg-surface-muted/40 hover:text-foreground"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
          {mounted && resolvedTheme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
          <span>Dark Mode</span>
          <span className="ml-auto text-xs uppercase tracking-wider text-rose-400">
            {mounted ? (resolvedTheme === "dark" ? "On" : "Off") : "…"}
          </span>
        </button>

        <div className="rounded-xl bg-surface-muted/30 px-3 py-2">
          <p className="truncate text-xs text-muted">{email ?? "Admin"}</p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-rose-300 transition hover:bg-rose-400/15"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border bg-background/95 backdrop-blur-xl lg:block">
        {nav}
      </aside>

      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/90 px-4 py-3 backdrop-blur-xl lg:hidden">
        <p className="font-display text-xl text-heading">{BRAND.name} Admin</p>
        <button
          type="button"
          aria-label="Toggle menu"
          className="rounded-lg border border-border p-2"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-tobago-900/60"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 border-r border-border bg-background shadow-2xl">
            {nav}
          </aside>
        </div>
      ) : null}
    </>
  );
}
