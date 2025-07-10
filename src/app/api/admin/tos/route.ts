// app/api/admin/tos/route.ts
import { NextRequest, NextResponse } from "next/server";
// 1. Import the revalidation functions
import { revalidatePath, revalidateTag } from "next/cache";
import { db } from "@/db";
import { tos } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyAdminSession } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const session = await verifyAdminSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, content } = await req.json();
  if (!id || !content)
    return NextResponse.json({ error: "Missing fields " }, { status: 400 });

  await db
    .update(tos)
    .set({ content, updatedAt: new Date() })
    .where(eq(tos.id, id));

  revalidatePath("/admin/tos");
  revalidateTag("tos");

  return NextResponse.json({ success: true, revalidated: true });
}
