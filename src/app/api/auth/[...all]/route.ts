// src/app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { sessionCache } from "@/lib/session-cache";

const customHandler = async (req: Request) => {
  const url = new URL(req.url);
  if (url.pathname.endsWith("/signout")) {
    sessionCache.clear();
  }
  return auth.handler(req);
};

export const { GET, POST } = toNextJsHandler(customHandler);
