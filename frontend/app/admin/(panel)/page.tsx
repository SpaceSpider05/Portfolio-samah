import Link from "next/link";
import type { Metadata } from "next";
import { AdminCard, AdminPageHeader } from "@/components/admin/admin-ui";
import { getProjects, getServices, getStats } from "@/services/api";

export const metadata: Metadata = {
  title: "Dashboard",
};

const quickLinks = [
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/bookings", label: "Bookings" },
];

export default async function AdminDashboardPage() {
  const [projects, services, stats] = await Promise.all([
    getProjects(),
    getServices(),
    getStats(),
  ]);

  const cards =
    stats.metrics.length > 0
      ? stats.metrics.map((metric) => ({
          label: metric.label,
          value: `${metric.prefix ?? ""}${metric.value}${metric.suffix}`,
        }))
      : [
          { label: "Projects", value: String(projects.length) },
          { label: "Services", value: String(services.length) },
        ];

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="Overview of portfolio content, services, and inbound bookings."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <AdminCard key={card.label}>
            <p className="text-xs uppercase tracking-[0.16em] text-rose-300">{card.label}</p>
            <p className="mt-3 font-display text-4xl text-fantasy-100">{card.value}</p>
          </AdminCard>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <AdminCard>
          <p className="type-overline mb-4">Recent projects</p>
          <ul className="space-y-3">
            {projects.map((project) => (
              <li
                key={project.id}
                className="flex items-center justify-between gap-3 border-b border-silver-400/10 pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <p className="text-sm text-fantasy-100">{project.title}</p>
                  <p className="text-xs text-silver-400">{project.client}</p>
                </div>
                <span className="rounded-full bg-rose-400/15 px-2.5 py-1 text-[11px] text-rose-200">
                  {project.category}
                </span>
              </li>
            ))}
          </ul>
          <Link href="/admin/projects" className="mt-4 inline-block text-sm text-rose-300 hover:text-rose-200">
            Manage projects →
          </Link>
        </AdminCard>

        <AdminCard>
          <p className="type-overline mb-4">Quick links</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl border border-silver-400/15 bg-tobago-700/50 px-4 py-3 text-sm text-fantasy-100 transition hover:border-rose-400/40"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <p className="mt-6 text-xs text-silver-400">
            Signed in with Laravel Sanctum. Manage services and review bookings from the sidebar.
          </p>
        </AdminCard>
      </div>
    </div>
  );
}
