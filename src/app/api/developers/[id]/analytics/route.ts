import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const userId = context.params.id;
  try {
    if (!userId) {
      return NextResponse.json({ error: "Missing user id" }, { status: 400 });
    }
    // Aggregate analytics in a single query for performance using sql helper
    const [totals] = await db
      .select({
        totalProducts: sql`COUNT(*)`,
        totalViews: sql`COALESCE(SUM(${products.views}), 0)`,
        totalLikes: sql`COALESCE(SUM(${products.likes}), 0)`,
        totalSales: sql`COALESCE(SUM(${products.sales}), 0)`,
        totalRevenue: sql`COALESCE(SUM(${products.revenue}), 0)`,
        avgRating: sql`COALESCE(ROUND(AVG(${products.rating}), 1), 0)`,
      })
      .from(products)
      .where(eq(products.userId, userId));
    return NextResponse.json({
      success: true,
      totals: {
        totalProducts: Number(totals.totalProducts),
        totalViews: Number(totals.totalViews),
        totalLikes: Number(totals.totalLikes),
        totalSales: Number(totals.totalSales),
        totalRevenue: Number(totals.totalRevenue),
        avgRating: totals.avgRating !== null ? Number(totals.avgRating) : null,
      },
    });
  } catch (error) {
    console.error("Error fetching developer analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
