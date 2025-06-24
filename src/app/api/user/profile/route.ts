import { NextResponse } from "next/server";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { getCachedSession } from "@/lib/session-cache";
import { cookies } from "next/headers";

const sessionCache = new Map();

export async function GET(request: Request) {
  try {
    // Use cookies for server-side auth
    const cookieStore = await cookies();
    const sessionToken =
      cookieStore.get("next-auth.session-token")?.value ||
      cookieStore.get("__Secure-next-auth.session-token")?.value;
    let session = sessionCache.get(sessionToken);
    if (!session) {
      session = await getCachedSession();
      sessionCache.set(sessionToken, session);
    }

    console.log("[DEBUG] Session:", session);
    if (!session?.user) {
      console.log("[DEBUG] No session user");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Fetch user profile from DB
    const dbUserArr = await db
      .select()
      .from(user)
      .where(eq(user.id, session.user.id));
    const dbUser = dbUserArr[0];
    console.log("[DEBUG] DB User:", dbUser);
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(dbUser);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

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

    const formData = await request.formData();
    const updateData: any = {};

    // Extract form fields
    const fields = [
      "name",
      "displayName",
      "username",
      "bio",
      "location",
      "website",
      "twitterUrl",
      "instagramUrl",
      "youtubeUrl",
      "twitchUrl",
    ];

    fields.forEach((field) => {
      const value = formData.get(field);
      if (value) updateData[field] = value.toString();
    });

    // Handle specialties (comma-separated string to array)
    const specialtiesStr = formData.get("specialties");
    if (specialtiesStr) {
      updateData.specialties = specialtiesStr
        .toString()
        .split(",")
        .map((s) => s.trim());
    }

    // Set isDeveloper to true if they're updating developer fields
    if (updateData.username || updateData.bio || updateData.specialties) {
      updateData.isDeveloper = true;
    }

    await db
      .update(user)
      .set({ ...updateData, updatedAt: new Date().toISOString() })
      .where(eq(user.id, session.user.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
