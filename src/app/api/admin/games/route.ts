import { db } from "@/db";
import { games } from "@/db/schema";
import { verifyAdminSession } from "@/lib/admin-auth";
import { NextRequest, NextResponse } from "next/server";

// GET: List all games
export async function GET() {
  const session = await verifyAdminSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result = await db.select().from(games).orderBy(games.label);
  return NextResponse.json(result);
}

// POST: Add a new game
export async function POST(req: NextRequest) {
  const { value, label } = await req.json();
  if (!value || !label) {
    return NextResponse.json(
      { error: "Missing value or label" },
      { status: 400 }
    );
  }
  try {
    const [game] = await db.insert(games).values({ value, label }).returning();
    return NextResponse.json(game);
  } catch (e) {
    return NextResponse.json({ error: "Game already exists" }, { status: 400 });
  }
}
