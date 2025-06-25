// src/lib/session-cache.ts
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const sessionCache = new Map<string, { value: any; expires: number }>();
const SESSION_TTL = 60 * 1000; // 1 minute TTL

export async function getCachedSession() {
  let cacheKey = "anon";
  if (typeof window === "undefined") {
    const hdrs = await headers();
    // Try to use a session cookie or all cookies as cache key for better uniqueness
    const cookie = hdrs.get("cookie");
    if (cookie && cookie.length > 0) {
      cacheKey = cookie;
    } else if (hdrs.get("authorization")) {
      cacheKey = hdrs.get("authorization")!;
    }
  }
  const now = Date.now();
  const cached = sessionCache.get(cacheKey);
  if (cached && cached.expires > now) {
    return cached.value;
  }
  const session = await auth.api.getSession({ headers: await headers() });
  sessionCache.set(cacheKey, { value: session, expires: now + SESSION_TTL });
  return session;
}
