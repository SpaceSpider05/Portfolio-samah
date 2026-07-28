import type { Metadata } from "next";
import { AdminCard, AdminPageHeader } from "@/components/admin/admin-ui";
import { getServices } from "@/services/api";

export const metadata: Metadata = { title: "Services" };

export default async function AdminServicesPage() {
  const services = await getServices();

  return (
    <div>
      <AdminPageHeader
        title="Services"
        description="Service cards displayed on the marketing site."
        action={
          <button type="button" className="rounded-full bg-rose-400 px-4 py-2 text-sm font-medium text-tobago-900">
            Add service
          </button>
        }
      />
      <div className="grid gap-3 md:grid-cols-2">
        {services.map((service) => (
          <AdminCard key={service.id}>
            <p className="text-fantasy-100">{service.title}</p>
            <p className="mt-2 text-sm text-silver-300">{service.description}</p>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}
