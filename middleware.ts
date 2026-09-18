import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";

const PROTECTED_PATHS = [
  "/dashboard",
  "/wellness-journey",
  "/mood-check-in",
  "/activity",
  "/companion",
  "/community",
  "/resources",
  "/assessment",
  "/settings",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to public paths
  if (pathname === "/" || pathname === "/onboarding" || pathname === "/login") {
    return NextResponse.next();
  }

  // Check if path is protected
  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));

  if (isProtected) {
    // Check for authentication cookie
    const token = request.cookies.get("auth-token");

    if (!token || !token.value) {
      // Redirect to /login if not authenticated
      const url = new URL("/login", request.url);
      url.searchParams.set("redirected", "true");
      return NextResponse.redirect(url);
    }

    // Verify signed JWT session token (AGENTS.md Bagian 8.2)
    const session = await verifySessionToken(token.value);
    if (!session) {
      // Token tidak valid atau kedaluwarsa, hapus cookie dan redirect ke /login
      const url = new URL("/login", request.url);
      url.searchParams.set("redirected", "true");
      const response = NextResponse.redirect(url);
      response.cookies.delete("auth-token");
      return response;
    }

    return NextResponse.next();
  }

  // For other paths, allow access
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};