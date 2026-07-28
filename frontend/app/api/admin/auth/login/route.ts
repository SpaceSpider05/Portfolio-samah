import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, getLaravelApiUrl } from "@/constants/admin";

type LoginResponse = {
  token: string;
  tokenType: string;
  user: {
    id: number;
    name: string;
    email: string;
    isAdmin: boolean;
  };
  message?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };

  if (!body.email || !body.password) {
    return NextResponse.json(
      { message: "Email and password are required." },
      { status: 422 },
    );
  }

  const apiUrl = getLaravelApiUrl();

  let laravelResponse: Response;
  try {
    laravelResponse = await fetch(`${apiUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: body.email,
        password: body.password,
      }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      {
        message:
          "Cannot reach Laravel API. Start it with: php artisan serve",
      },
      { status: 503 },
    );
  }

  const payload = (await laravelResponse.json()) as LoginResponse & {
    errors?: Record<string, string[]>;
  };

  if (!laravelResponse.ok) {
    const message =
      payload.message ||
      payload.errors?.email?.[0] ||
      "Invalid email or password.";

    return NextResponse.json({ message }, { status: laravelResponse.status });
  }

  const response = NextResponse.json({
    user: payload.user,
  });

  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: payload.token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
