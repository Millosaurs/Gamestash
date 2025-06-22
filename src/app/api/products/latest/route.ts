// app/api/products/latest/route.ts
import { NextResponse } from "next/server";
import { getLatestProducts } from "@/lib/actions/products";

export async function GET() {
  try {
    const result = await getLatestProducts(6);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
