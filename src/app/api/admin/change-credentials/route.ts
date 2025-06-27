import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { db } from "@/db/index";
import { user, adminCredentials } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hash, verify } from "@node-rs/argon2";

export async function POST(request: NextRequest) {
  try {
    const session = await verifyAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { currentPassword, newPassword } = await request.json();
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    // Find admin credentials
    const creds = await db
      .select()
      .from(adminCredentials)
      .where(eq(adminCredentials.userId, session.adminId));
    if (!creds[0]) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }
    const valid = await verify(creds[0].passwordHash, currentPassword);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid current password" },
        { status: 403 }
      );
    }
    const newHash = await hash(newPassword, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
    await db
      .update(adminCredentials)
      .set({ passwordHash: newHash })
      .where(eq(adminCredentials.userId, session.adminId));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
