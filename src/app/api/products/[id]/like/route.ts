// app/api/products/[id]/like/route.ts
import { NextResponse } from "next/server";
import { toggleProductLike } from "@/lib/actions/products";

export async function POST(_: Request, { params }: any) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: "Product ID is required" },
      { status: 400 }
    );
  }

  try {
    const result = await toggleProductLike(id);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
  } catch (error) {
    console.error(
      "Error toggling like:",
      error instanceof Error ? error.stack : error
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
