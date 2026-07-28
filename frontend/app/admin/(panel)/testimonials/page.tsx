import type { Metadata } from "next";
import { TestimonialsModule } from "@/components/admin/admin-modules";

export const metadata: Metadata = { title: "Testimonials" };

export default function Page() {
  return <TestimonialsModule />;
}
