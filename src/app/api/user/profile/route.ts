import { NextResponse } from "next/server";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth"; // Your Better Auth instance

export async function GET(request: Request) {
  try {
    // Get session using Better Auth
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Fetch user profile from DB
    const dbUserArr = await db
      .select()
      .from(user)
      .where(eq(user.id, session.user.id));
    const dbUser = dbUserArr[0];
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(dbUser);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    // Get session using Better Auth
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const formData = await request.formData();
    const updateData: any = {};
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

    const specialtiesStr = formData.get("specialties");
    if (specialtiesStr) {
      updateData.specialties = specialtiesStr
        .toString()
        .split(",")
        .map((s) => s.trim());
    }

    if (updateData.username || updateData.bio || updateData.specialties) {
      updateData.isDeveloper = true;
    }

    await db
      .update(user)
      .set({ ...updateData, updatedAt: new Date().toISOString() })
      .where(eq(user.id, session.user.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
