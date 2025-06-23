import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCachedSession } from "@/lib/session-cache";

const protectedPaths = ["/dashboard", "/accounts"];

export async function middleware(request: NextRequest) {
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
}

export const config = {
  matcher: ["/dashboard/:path*", "/accounts/:path*"],
};
