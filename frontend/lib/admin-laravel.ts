import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, getLaravelApiUrl } from "@/constants/admin";

export async function getAdminToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_SESSION_COOKIE)?.value ?? null;
}

type ProxyOptions = {
  formData?: boolean;
};

export async function proxyAdminLaravel(
  path: string,
  init: RequestInit = {},
  options: ProxyOptions = {},
): Promise<Response> {
  const token = await getAdminToken();

  if (!token) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  headers.set("Authorization", `Bearer ${token}`);

  if (options.formData) {
    headers.delete("Content-Type");
  } else if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  try {
    const laravelResponse = await fetch(`${getLaravelApiUrl()}${path}`, {
      ...init,
      headers,
      cache: "no-store",
    });

    const text = await laravelResponse.text();
    const contentType =
      laravelResponse.headers.get("Content-Type") ?? "application/json";

    return new NextResponse(text || null, {
      status: laravelResponse.status,
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Cannot reach Laravel API. Is php artisan serve running?" },
      { status: 503 },
    );
  }
}
