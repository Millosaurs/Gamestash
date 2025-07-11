import { NextResponse } from "next/server";
import { db } from "@/db";
import { user, products, productLikes } from "@/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params since they're now async in Next.js 15
    const { id: developerId } = await context.params;

    // Get developer details
    const [developer] = await db
      .select()
      .from(user)
      .where(and(eq(user.id, developerId), eq(user.isDeveloper, true)));

    if (!developer) {
      return NextResponse.json(
        { error: "Developer not found" },
        { status: 404 }
      );
    }

    // Get all products by this developer, with likes count for each
    const allProductsRaw = await db
      .select()
      .from(products)
      .where(
        and(eq(products.userId, developerId), eq(products.status, "published"))
      )
      .orderBy(desc(products.createdAt));

    // Add likes count for each product
    const allProducts = await Promise.all(
      allProductsRaw.map(async (product) => {
        const likesCount = await db
          .select({ count: sql`count(*)`.mapWith(Number) })
          .from(productLikes)
          .where(eq(productLikes.productId, product.id));
        return {
          ...product,
          likesCount: likesCount[0]?.count || 0,
        };
      })
    );

    // Fetch analytics in the same request
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
      .where(eq(products.userId, developerId));

    const analytics = {
      totalProducts: Number(totals.totalProducts),
      totalViews: Number(totals.totalViews),
      totalLikes: Number(totals.totalLikes),
      totalSales: Number(totals.totalSales),
      totalRevenue: Number(totals.totalRevenue),
      avgRating: totals.avgRating !== null ? Number(totals.avgRating) : null,
    };

    const developerWithProducts = {
      ...developer,
      displayName: developer.displayName || developer.name,
      socialLinks: {
        twitter: developer.twitterUrl,
        instagram: developer.instagramUrl,
        youtube: developer.youtubeUrl,
        twitch: developer.twitchUrl,
        website: developer.website,
      },
      joinedDate: developer.createdAt,
      products: allProducts,
      analytics, // merged analytics here
    };

    return NextResponse.json(developerWithProducts);
  } catch (error) {
    console.error("Error fetching developer:", error);
    return NextResponse.json(
      { error: "Failed to fetch developer" },
      { status: 500 }
    );
  }
}
