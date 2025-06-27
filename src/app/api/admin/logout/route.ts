// /api/admin/logout/route.ts
import { NextResponse } from "next/server";
import { destroyAdminSession } from "@/lib/admin-auth";

export async function POST() {
  await destroyAdminSession();
  return NextResponse.json({ success: true });
}
