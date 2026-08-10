import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/constants/admin";

const APEX_HOST = "growwithsamah.com";
const WWW_HOST = `www.${APEX_HOST}`;

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase();

  if (host === WWW_HOST) {
    const url = request.nextUrl.clone();
    url.hostname = APEX_HOST;
    url.protocol = "https:";
    url.port = "";
    return NextResponse.redirect(url, 301);
  }

  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/admin/login";
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const hasSession = Boolean(token);

  if (!isAdminRoute) {
    return NextResponse.next();
  }

  if (isLoginRoute) {
    if (hasSession) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (!hasSession) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except static assets / Next internals so www→apex
     * redirects apply site-wide while keeping admin auth checks.
     */
    "/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|css|js|map)$).*)",
  ],
};
