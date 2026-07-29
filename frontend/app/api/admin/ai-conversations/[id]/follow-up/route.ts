import { proxyAdminLaravel } from "@/lib/admin-laravel";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.text();

  return proxyAdminLaravel(`/api/v1/manage/ai-conversations/${id}/follow-up`, {
    method: "POST",
    body,
  });
}
