import { NextResponse } from "next/server";
import { db } from "@/db";
import { user, products, productLikes } from "@/db/schema";
import { eq, sql, desc, and } from "drizzle-orm";
import { auth } from "@/lib/auth"; // Your Better Auth instance

export async function GET(request: Request) {
  try {
    // Get session using Better Auth
    const session = await auth.api.getSession({ headers: request.headers });

    //  want to restrict to authenticated users:
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get developers with their recent products
    const developers = await db
      .select({
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        name: user.name,
        image: user.image,
        bio: user.bio,
        location: user.location,
        website: user.website,
        twitterUrl: user.twitterUrl,
        instagramUrl: user.instagramUrl,
        youtubeUrl: user.youtubeUrl,
        twitchUrl: user.twitchUrl,
        verified: user.verified,
        featured: user.featured,
        specialties: user.specialties,
        totalProducts: user.totalProducts,
        totalLikes: user.totalLikes,
        totalViews: user.totalViews,
        totalSales: user.totalSales,
        rating: user.rating,
        createdAt: user.createdAt,
      })
      .from(user)
      .where(
        and(eq(user.isDeveloper, true), eq(user.profileVisibility, "public"))
      )
      .orderBy(desc(user.featured), desc(user.rating));

    // Get recent products for each developer
    const developersWithProducts = await Promise.all(
      developers.map(async (developer) => {
        const recentProducts = await db
          .select({
            id: products.id,
            title: products.title,
            thumbnail: products.thumbnail,
            price: products.price,
            originalPrice: products.originalPrice,
            likes: products.likes,
          })
          .from(products)
          .where(
            and(
              eq(products.userId, developer.id),
              eq(products.status, "published")
            )
          )
          .orderBy(desc(products.createdAt))
          .limit(2);

        // Fetch likes count for each product
        const productsWithLikes = await Promise.all(
          recentProducts.map(async (p) => {
            const likesCount = await db
              .select({ count: sql`count(*)`.mapWith(Number) })
              .from(productLikes)
              .where(eq(productLikes.productId, p.id));
            return {
              ...p,
              imageUrl: p.thumbnail,
              likesCount: likesCount[0]?.count || 0,
            };
          })
        );

        // Fetch analytics for this developer
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
          .where(eq(products.userId, developer.id));

        const analytics = {
          totalProducts: Number(totals.totalProducts),
          totalViews: Number(totals.totalViews),
          totalLikes: Number(totals.totalLikes),
          totalSales: Number(totals.totalSales),
          totalRevenue: Number(totals.totalRevenue),
          avgRating:
            totals.avgRating !== null ? Number(totals.avgRating) : null,
        };

        return {
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
          recentProducts: productsWithLikes,
          analytics,
        };
      })
    );

    return NextResponse.json(developersWithProducts);
  } catch (error) {
    console.error("Error fetching developers:", error);
    return NextResponse.json(
      { error: "Failed to fetch developers" },
      { status: 500 }
    );
  }
}
