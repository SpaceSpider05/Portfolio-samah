import { proxyAdminLaravel } from "@/lib/admin-laravel";

export async function GET() {
  return proxyAdminLaravel("/api/v1/manage/projects");
}

export async function POST(request: Request) {
  const body = await request.text();

  return proxyAdminLaravel("/api/v1/projects", {
    method: "POST",
    body,
  });
}
