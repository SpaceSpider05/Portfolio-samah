import type { Metadata } from "next";
import { BookingsModule } from "@/components/admin/admin-modules";

export const metadata: Metadata = { title: "Bookings" };

export default function Page() {
  return <BookingsModule />;
}
