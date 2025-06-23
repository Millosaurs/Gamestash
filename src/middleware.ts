import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCachedSession } from "@/lib/session-cache";

const protectedPaths = ["/dashboard", "/accounts"];

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    if (protectedPaths.some((path) => pathname.startsWith(path))) {
      const session = await getCachedSession();
      if (!session?.user) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }
    }
    return NextResponse.next();
  } catch (err) {
    // Log the error for debugging (optional: send to monitoring)
    console.error("[middleware] Error:", err);
    // Fallback: allow request to proceed to avoid 500
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/accounts/:path*",
    "!/api/auth/:path*",
    "!/auth/:path*",
  ],
};
