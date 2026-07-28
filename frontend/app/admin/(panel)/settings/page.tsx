import type { Metadata } from "next";
import { SettingsModule } from "@/components/admin/admin-modules";

export const metadata: Metadata = { title: "Settings" };

export default function Page() {
  return <SettingsModule />;
}
