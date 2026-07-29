import { proxyAdminLaravel } from "@/lib/admin-laravel";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = await request.text();

  return proxyAdminLaravel(`/api/v1/services/${id}`, {
    method: "PUT",
    body,
  });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  return proxyAdminLaravel(`/api/v1/services/${id}`, {
    method: "DELETE",
  });
}
