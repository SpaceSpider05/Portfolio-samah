import type { Metadata } from "next";
import { BlogsModule } from "@/components/admin/admin-modules";

export const metadata: Metadata = { title: "Blogs" };

export default function Page() {
  return <BlogsModule />;
}
