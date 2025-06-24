import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: Request, contextOrParams: any) {
  let userId: string | undefined;
  // Support both { params } and context.params
  if (contextOrParams?.params?.id) {
    userId = contextOrParams.params.id;
  } else if (contextOrParams?.id) {
    userId = contextOrParams.id;
  }

  try {
    if (!userId) {
      return NextResponse.json({ error: "Missing user id" }, { status: 400 });
    }

    // Get all products for this user
    const userProducts = await db
      .select({
        id: products.id,
        views: products.views,
        likes: products.likes,
        sales: products.sales,
        revenue: products.revenue,
      })
      .from(products)
      .where(eq(products.userId, userId));

    // Calculate totals
    const totals = userProducts.reduce(
      (acc, product) => ({
        totalProducts: acc.totalProducts + 1,
        totalViews: acc.totalViews + (product.views || 0),
        totalLikes: acc.totalLikes + (product.likes || 0),
        totalSales: acc.totalSales + (product.sales || 0),
        totalRevenue:
          acc.totalRevenue + parseFloat(String(product.revenue || "0")),
      }),
      {
        totalProducts: 0,
        totalViews: 0,
        totalLikes: 0,
        totalSales: 0,
        totalRevenue: 0,
      }
    );

    return NextResponse.json({ success: true, totals });
  } catch (error) {
    console.error("Error fetching developer analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
