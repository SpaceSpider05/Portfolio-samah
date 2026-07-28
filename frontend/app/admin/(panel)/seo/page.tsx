import type { Metadata } from "next";
import { SeoModule } from "@/components/admin/admin-modules";

export const metadata: Metadata = { title: "SEO" };

export default function Page() {
  return <SeoModule />;
}
