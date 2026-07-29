import { proxyAdminLaravel } from "@/lib/admin-laravel";

export async function POST(request: Request) {
  const formData = await request.formData();

  return proxyAdminLaravel(
    "/api/v1/media",
    {
      method: "POST",
      body: formData,
    },
    { formData: true },
  );
}
