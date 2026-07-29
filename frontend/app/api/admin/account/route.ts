import { proxyAdminLaravel } from "@/lib/admin-laravel";

export async function GET() {
  return proxyAdminLaravel("/api/v1/manage/account");
}

export async function PUT(request: Request) {
  const body = await request.text();

  return proxyAdminLaravel("/api/v1/manage/account", {
    method: "PUT",
    body,
  });
}
