export const ADMIN_SESSION_COOKIE = "samah_admin_session";

export const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/admin/projects", label: "Projects", icon: "Briefcase" },
  { href: "/admin/services", label: "Services", icon: "Layers" },
  { href: "/admin/bookings", label: "Bookings", icon: "CalendarDays" },
  { href: "/admin/settings", label: "Settings", icon: "Settings" },
] as const;

export function getLaravelApiUrl(): string {
  return (
    process.env.LARAVEL_API_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    "http://127.0.0.1:8000"
  );
}
