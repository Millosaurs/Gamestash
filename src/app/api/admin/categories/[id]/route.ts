import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = await context.params;
  await db.delete(categories).where(eq(categories.id, Number(id)));
  return NextResponse.json({ success: true });
}
