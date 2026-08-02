import { revalidatePath } from "next/cache";
import { proxyAdminLaravel } from "@/lib/admin-laravel";

export async function GET() {
  return proxyAdminLaravel("/api/v1/manage/site-settings");
}

export async function PUT(request: Request) {
  const body = await request.text();

  const response = await proxyAdminLaravel("/api/v1/manage/site-settings", {
    method: "PUT",
    body,
  });

  // Refresh marketing pages so footer phone/email update immediately after admin save.
  if (response.ok) {
    revalidatePath("/", "layout");
    revalidatePath("/");
    revalidatePath("/portfolio");
    revalidatePath("/book");
    revalidatePath("/privacy");
  }

  return response;
}
