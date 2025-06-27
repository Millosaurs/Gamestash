import { NextRequest, NextResponse } from "next/server";
import { verifyAdminLogin, createAdminSession } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    const admin = await verifyAdminLogin(username, password);
    if (!admin) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    await createAdminSession(admin.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
