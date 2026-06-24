import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { REFRESH_TOKEN_KEY, verifyRefreshToken } from "@/lib/auth";

// Paths an unauthenticated visitor may reach. Everything else requires login.
// `/donate/...` is the public creator page; `/pay/...` is the QPay QR landing
// that is opened on a phone that may not be signed in.
const PUBLIC_PREFIXES = ["/login", "/signup", "/donate", "/pay"];

function isPublic(pathname: string) {
  return PUBLIC_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(REFRESH_TOKEN_KEY)?.value;
  if (token && verifyRefreshToken(token)) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  // Run on every route except API handlers, Next internals, and static files
  // (anything containing a "." such as coffee.svg / favicon.ico).
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
