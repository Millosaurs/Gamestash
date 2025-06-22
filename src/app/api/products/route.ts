// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAllProducts } from "@/lib/actions/products";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const filters = {
      search: searchParams.get("search") || undefined,
      games: searchParams.get("games")?.split(",") || undefined,
      categories: searchParams.get("categories")?.split(",") || undefined,
      priceRange: searchParams.get("priceRange")
        ? JSON.parse(searchParams.get("priceRange")!)
        : undefined,
      sortBy: searchParams.get("sortBy") || "popular",
    };

    const result = await getAllProducts(filters);

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
