import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { db } from "@/db/index";
import { user, adminCredentials } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hash } from "@node-rs/argon2";

function generateId() {
  return (
    Date.now().toString(36) + Math.random().toString(36).substring(2, 10)
  );
}

export async function POST(request: NextRequest) {
  try {
    const session = await verifyAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { username, password } = await request.json();
    if (!username || !password) {
      return NextResponse.json({ error: "Missing username or password" }, { status: 400 });
    }
    // Create a new user for the admin
    const newUserId = generateId();
    await db.insert(user).values({
      id: newUserId,
      name: username,
      email: `${username}@admin.local`,
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      role: "admin",
    });
    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
    await db.insert(adminCredentials).values({
      userId: newUserId,
      username,
      passwordHash,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
