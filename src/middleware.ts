import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const protectedPaths = ["/dashboard", "/accounts"];

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    // Allow access to /admin/login always
    if (pathname.startsWith("/admin/login")) {
      return NextResponse.next();
    }

    if (protectedPaths.some((path) => pathname.startsWith(path))) {
      // Only check for the session cookie, do not fetch session in middleware
      const sessionCookie = getSessionCookie(request);
      if (!sessionCookie) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }
    }
    return NextResponse.next();
  } catch (err) {
    console.error("[middleware] Error:", err);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/accounts/:path*"],
};
