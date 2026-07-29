import type { Metadata } from "next";
import { AdminBookingsManager } from "@/components/admin/admin-bookings-manager";

export const metadata: Metadata = { title: "Bookings" };

export default function Page() {
  return <AdminBookingsManager />;
}
