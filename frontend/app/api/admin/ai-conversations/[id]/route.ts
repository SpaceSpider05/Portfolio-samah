import { proxyAdminLaravel } from "@/lib/admin-laravel";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  return proxyAdminLaravel(`/api/v1/manage/ai-conversations/${id}`);
}
