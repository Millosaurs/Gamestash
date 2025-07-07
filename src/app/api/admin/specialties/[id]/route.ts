import { db } from "@/db";
import { specialties } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, context: any) {
  const { id } = context.params;
  await db.delete(specialties).where(eq(specialties.id, Number(id)));
  return NextResponse.json({ success: true });
}
