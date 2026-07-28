import type { Metadata } from "next";
import { AnalyticsModule } from "@/components/admin/admin-modules";

export const metadata: Metadata = { title: "Analytics" };

export default function Page() {
  return <AnalyticsModule />;
}
