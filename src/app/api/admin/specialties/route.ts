import { db } from "@/db";
import { specialties } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const result = await db.select().from(specialties).orderBy(specialties.label);
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const { value, label } = await req.json();
  if (!value || !label) {
    return NextResponse.json(
      { error: "Missing value or label" },
      { status: 400 }
    );
  }
  try {
    const [specialty] = await db
      .insert(specialties)
      .values({ value, label })
      .returning();
    return NextResponse.json(specialty);
  } catch (e) {
    return NextResponse.json(
      { error: "Specialty already exists" },
      { status: 400 }
    );
  }
}
