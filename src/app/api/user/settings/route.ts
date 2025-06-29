import { NextResponse } from "next/server";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCachedSession } from "@/lib/session-cache";

const sessionCache = new Map();

export async function PUT(request: Request) {
  try {
    const cacheKey = request.headers.get("authorization") || "anon";
    let session = sessionCache.get(cacheKey);
    if (!session) {
      session = await getCachedSession();
      sessionCache.set(cacheKey, session);
    }

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const settings = await request.json();

    await db
      .update(user)
      .set({
        emailNotifications: settings.emailNotifications,
        pushNotifications: settings.pushNotifications,
        marketingEmails: settings.marketingEmails,
        profileVisibility: settings.profileVisibility,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(user.id, session.user.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
