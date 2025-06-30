import { NextResponse } from "next/server";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

const sessionCache = new Map();

export async function PUT(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = session.user.id;

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
