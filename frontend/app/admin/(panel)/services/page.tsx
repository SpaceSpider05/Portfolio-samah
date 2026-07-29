import type { Metadata } from "next";
import { AdminServicesManager } from "@/components/admin/admin-services-manager";

export const metadata: Metadata = { title: "Services" };

export default function AdminServicesPage() {
  return <AdminServicesManager />;
}
