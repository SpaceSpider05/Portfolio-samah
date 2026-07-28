import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, getLaravelApiUrl } from "@/constants/admin";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  try {
    const laravelResponse = await fetch(`${getLaravelApiUrl()}/api/v1/auth/me`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!laravelResponse.ok) {
      const response = NextResponse.json(
        { message: "Unauthenticated." },
        { status: 401 },
      );
      response.cookies.set({
        name: ADMIN_SESSION_COOKIE,
        value: "",
        httpOnly: true,
        path: "/",
        maxAge: 0,
      });
      return response;
    }

    const user = await laravelResponse.json();
    return NextResponse.json(user);
  } catch {
    return NextResponse.json(
      { message: "Cannot reach Laravel API." },
      { status: 503 },
    );
  }
}
