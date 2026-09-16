"use strict";

import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = ["/dashboard", "/wellness-journey", "/mood-check-in", "/activity", "/companion", "/resources", "/assessment", "/settings"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to public paths
  if (pathname === "/" || pathname === "/onboarding") {
    return NextResponse.next();
  }

  // Check if path is protected
  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));

  if (isProtected) {
    // Check for authentication cookie
    const token = request.cookies.get("auth-token");

    if (!token) {
      // Redirect to onboarding if not authenticated
      const url = new URL("/onboarding", request.url);
      url.searchParams.set("redirected", "true");
      return NextResponse.redirect(url);
    }

    // Verify token (optional - can add more robust auth here)
    try {
      // Add auth verification logic here if needed
      return NextResponse.next();
    } catch (error) {
      // Invalid token, redirect to login
      const url = new URL("/onboarding", request.url);
      url.searchParams.set("redirected", "true");
      return NextResponse.redirect(url);
    }
  }

  // For other paths, allow access
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};