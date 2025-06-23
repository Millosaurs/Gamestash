// src/lib/session-cache.ts
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const sessionCache = new Map<string, any>();

export async function getCachedSession() {
  let cacheKey = "anon";
  if (typeof window === "undefined") {
    const hdrs = await headers();
    cacheKey = hdrs.get("authorization") || "anon";
  }
  if (sessionCache.has(cacheKey)) {
    return sessionCache.get(cacheKey);
  }
  const session = await auth.api.getSession({ headers: await headers() });
  sessionCache.set(cacheKey, session);
  return session;
}
