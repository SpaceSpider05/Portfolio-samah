export const ADMIN_SESSION_COOKIE = "samah_admin_session";

export const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/admin/projects", label: "Projects", icon: "Briefcase" },
  { href: "/admin/blogs", label: "Blogs", icon: "Newspaper" },
  { href: "/admin/services", label: "Services", icon: "Layers" },
  { href: "/admin/statistics", label: "Statistics", icon: "BarChart3" },
  { href: "/admin/testimonials", label: "Testimonials", icon: "Quote" },
  { href: "/admin/messages", label: "Messages", icon: "Mail" },
  { href: "/admin/bookings", label: "Bookings", icon: "CalendarDays" },
  { href: "/admin/ai-conversations", label: "AI Conversations", icon: "Bot" },
  { href: "/admin/gallery", label: "Gallery", icon: "Images" },
  { href: "/admin/analytics", label: "Analytics", icon: "LineChart" },
  { href: "/admin/settings", label: "Settings", icon: "Settings" },
  { href: "/admin/seo", label: "SEO", icon: "Search" },
] as const;

export function getLaravelApiUrl(): string {
  return (
    process.env.LARAVEL_API_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    "http://127.0.0.1:8000"
  );
}
