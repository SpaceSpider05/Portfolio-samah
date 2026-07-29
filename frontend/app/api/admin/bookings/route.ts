import { proxyAdminLaravel } from "@/lib/admin-laravel";

export async function GET() {
  return proxyAdminLaravel("/api/v1/manage/bookings");
}
