import { db } from "@/db";
import { games } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  await db.delete(games).where(eq(games.id, Number(id)));
  return NextResponse.json({ success: true });
}
