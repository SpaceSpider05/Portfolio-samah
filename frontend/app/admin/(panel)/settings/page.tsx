import type { Metadata } from "next";
import { AdminSettingsManager } from "@/components/admin/admin-settings-manager";

export const metadata: Metadata = { title: "Settings" };

export default function AdminSettingsPage() {
  return <AdminSettingsManager />;
}
