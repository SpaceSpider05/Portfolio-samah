import type { Metadata } from "next";
import { AdminProjectsManager } from "@/components/admin/admin-projects-manager";

export const metadata: Metadata = { title: "Projects" };

export default function AdminProjectsPage() {
  return <AdminProjectsManager />;
}
