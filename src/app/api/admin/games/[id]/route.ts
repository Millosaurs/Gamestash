import { db } from "@/db";
import { games } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  context: Promise<{ params: { id: string } }>
) {
  const { params } = await context;
  const id = Number(params.id);
  await db.delete(games).where(eq(games.id, id));
  return NextResponse.json({ success: true });
}
