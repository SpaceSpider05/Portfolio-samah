import type { Metadata } from "next";
import { AdminCard, AdminPageHeader } from "@/components/admin/admin-ui";
import { getStats } from "@/services/api";

export const metadata: Metadata = { title: "Statistics" };

export default async function AdminStatisticsPage() {
  const stats = await getStats();

  return (
    <div>
      <AdminPageHeader
        title="Statistics"
        description="Public results metrics and growth chart values."
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.metrics.map((metric) => (
          <AdminCard key={metric.id}>
            <p className="text-xs uppercase tracking-wider text-rose-300">{metric.label}</p>
            <p className="mt-2 font-display text-3xl text-fantasy-100">
              {metric.prefix}
              {metric.value}
              {metric.suffix}
            </p>
          </AdminCard>
        ))}
      </div>
      <AdminCard className="mt-4">
        <p className="type-overline mb-4">Growth trajectory points</p>
        <div className="flex flex-wrap gap-2">
          {stats.chart.map((point) => (
            <span
              key={point.label}
              className="rounded-full bg-tobago-700 px-3 py-1.5 text-sm text-fantasy-100"
            >
              {point.label}: {point.value}
            </span>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}
