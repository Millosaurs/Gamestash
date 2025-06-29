// lib/actions/products.ts
"use server";

import { db } from "@/db";
import {
  products,
  user,
  productLikes,
  dailyAnalytics,
  productSales,
  productViews,
} from "@/db/schema";
import { eq, desc, and, sql, count, gte, sum, lte } from "drizzle-orm";
import { getCachedSession } from "@/lib/session-cache";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

type Product = {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  images: string[] | null;
  price: string;
  game: string | null;
  category: string | null;
  views: number | null;
  likes: number | null;
  sales: number | null;
  tags: string[] | null;
  featured: boolean | null;
  video_url?: string | null;
  rating: string | null;
  createdAt: Date | string | null;
  updatedAt: Date | string | null;
  userName: string | null;
  userAvatar: string | null;
};

export interface CreateProductData {
  title: string;
  description: string;
  price: string;
  game?: string;
  category?: string;
  status: "draft" | "published";
  tags: string[];
  thumbnail?: string | null;
  video_url?: string | null;
  images: string[];
}

export interface UpdateProductData extends CreateProductData {
  id: string;
}

// Create new product
export async function createProduct(data: CreateProductData) {
  try {
    const session = await getCachedSession();

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    const newProduct = await db
      .insert(products)
      .values({
        userId: session.user.id,
        title: data.title,
        description: data.description,
        price: data.price,
        game: data.game,
        category: data.category,
        status: data.status,
        tags: data.tags,
        thumbnail: data.thumbnail,
        images: data.images,
        videoUrl: data.video_url,
      })
      .returning();

    revalidatePath("/dashboard");
    revalidatePath("/explore");
    revalidatePath("/");

    return { success: true, data: newProduct[0] };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error: "Failed to create product" };
  }
}

// Update existing product
export async function updateProduct(data: UpdateProductData) {
  try {
    const session = await getCachedSession();

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    // Check if user owns the product
    const existingProduct = await db
      .select()
      .from(products)
      .where(
        and(eq(products.id, data.id), eq(products.userId, session.user.id))
      )
      .limit(1);

    if (existingProduct.length === 0) {
      return { success: false, error: "Product not found or unauthorized" };
    }

    const updatedProduct = await db
      .update(products)
      .set({
        title: data.title,
        description: data.description,
        price: data.price,
        game: data.game,
        category: data.category,
        status: data.status,
        tags: data.tags,
        thumbnail: data.thumbnail,
        images: data.images,
        videoUrl: data.video_url,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(products.id, data.id))
      .returning();

    revalidatePath("/dashboard");
    revalidatePath("/explore");
    revalidatePath("/");

    return { success: true, data: updatedProduct[0] };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error: "Failed to update product" };
  }
}

// Delete product
export async function deleteProduct(productId: string) {
  try {
    const session = await getCachedSession();

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    // Check if user owns the product
    const existingProduct = await db
      .select()
      .from(products)
      .where(
        and(eq(products.id, productId), eq(products.userId, session.user.id))
      )
      .limit(1);

    if (existingProduct.length === 0) {
      return { success: false, error: "Product not found or unauthorized" };
    }

    await db.delete(products).where(eq(products.id, productId));

    revalidatePath("/dashboard");
    revalidatePath("/explore");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}

// Get user's products
export async function getUserProducts() {
  try {
    const session = await getCachedSession();

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    const userProducts = await db
      .select({
        id: products.id,
        userId: products.userId,
        title: products.title,
        description: products.description,
        thumbnail: products.thumbnail,
        images: products.images,
        price: products.price,
        game: products.game,
        category: products.category,
        status: products.status,
        views: products.views,
        likes: products.likes,
        sales: products.sales,
        revenue: products.revenue,
        video_url: products.videoUrl,
        tags: products.tags,
        featured: products.featured,
        rating: products.rating,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .where(eq(products.userId, session.user.id))
      .orderBy(desc(products.updatedAt));

    return { success: true, data: userProducts };
  } catch (error) {
    console.error("Error fetching user products:", error);
    return { success: false, error: "Failed to fetch products" };
  }
}

// Get all published products (for explore page)
export async function getAllProducts(filters?: {
  search?: string;
  games?: string[];
  categories?: string[];
  priceRange?: [number, number];
  sortBy?: string;
}) {
  try {
    // Build an array of conditions
    const conditions = [eq(products.status, "published")];

    if (filters?.search) {
      conditions.push(sql`${products.title} ILIKE ${`%${filters.search}%`}`);
    }

    if (filters?.priceRange) {
      conditions.push(
        sql`${products.price}::numeric >= ${filters.priceRange[0]}`,
        sql`${products.price}::numeric <= ${filters.priceRange[1]}`
      );
    }

    // Combine conditions with 'and'
    const whereClause =
      conditions.length === 1 ? conditions[0] : and(...conditions);

    // Build the query
    let query = db
      .select({
        id: products.id,
        title: products.title,
        description: products.description,
        thumbnail: products.thumbnail,
        images: products.images,
        price: products.price,
        game: products.game,
        category: products.category,
        views: products.views,
        likes: products.likes,
        sales: products.sales,
        tags: products.tags,
        featured: products.featured,
        rating: products.rating,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        userName: user.name,
        userAvatar: user.image,
      })
      .from(products)
      .leftJoin(user, eq(products.userId, user.id))
      .where(whereClause);

    // Execute the query
    let results = await query;

    // JS-side filtering for games
    if (filters?.games && filters.games.length > 0) {
      results = results.filter((product: Product) =>
        filters.games!.some(
          (game: string) =>
            (product.game?.toLowerCase().includes(game.toLowerCase()) ??
              false) ||
            (product.tags?.some((tag: string) =>
              tag.toLowerCase().includes(game.toLowerCase())
            ) ??
              false)
        )
      );
    }

    // JS-side filtering for categories
    if (filters?.categories && filters.categories.length > 0) {
      results = results.filter((product: Product) =>
        filters.categories!.some(
          (category: string) =>
            (product.category?.toLowerCase().includes(category.toLowerCase()) ??
              false) ||
            (product.tags?.some((tag: string) =>
              tag.toLowerCase().includes(category.toLowerCase())
            ) ??
              false)
        )
      );
    }

    // Sorting
    results.sort((a: Product, b: Product) => {
      // Featured products first
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;

      // Secondary sorting
      switch (filters?.sortBy) {
        case "newest":
          return (
            new Date(b.createdAt ?? 0).getTime() -
            new Date(a.createdAt ?? 0).getTime()
          );
        case "price-low":
          return parseFloat(a.price) - parseFloat(b.price);
        case "price-high":
          return parseFloat(b.price) - parseFloat(a.price);
        case "rating":
          return parseFloat(b.rating ?? "0") - parseFloat(a.rating ?? "0");
        case "popular":
        default:
          return (b.likes ?? 0) - (a.likes ?? 0);
      }
    });

    return { success: true, data: results };
  } catch (error) {
    console.error("Error fetching all products:", error);
    return { success: false, error: "Failed to fetch products" };
  }
}

// Get latest products (for homepage)
export async function getLatestProducts(limit: number = 6) {
  try {
    const latestProducts = await db
      .select({
        id: products.id,
        title: products.title,
        description: products.description,
        thumbnail: products.thumbnail,
        images: products.images,
        price: products.price,
        game: products.game,
        category: products.category,
        views: products.views,
        likes: products.likes,
        sales: products.sales,
        tags: products.tags,
        featured: products.featured,
        rating: products.rating,
        createdAt: products.createdAt,
        userName: user.name,
        userAvatar: user.image,
      })
      .from(products)
      .leftJoin(user, eq(products.userId, user.id))
      .where(eq(products.status, "published"))
      .orderBy(desc(products.featured), desc(products.createdAt))
      .limit(limit);

    return { success: true, data: latestProducts };
  } catch (error) {
    console.error("Error fetching latest products:", error);
    return { success: false, error: "Failed to fetch latest products" };
  }
}

// Get single product by ID
export async function getProductById(productId: string) {
  try {
    const session = await getCachedSession();

    const product = await db
      .select({
        id: products.id,
        title: products.title,
        description: products.description,
        thumbnail: products.thumbnail,
        images: products.images,
        price: products.price,
        game: products.game,
        category: products.category,
        status: products.status,
        views: products.views,
        likes: products.likes,
        sales: products.sales,
        tags: products.tags,
        featured: products.featured,
        video_url: products.videoUrl,
        rating: products.rating,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        userId: products.userId,
        userName: user.name,
        userAvatar: user.image,
      })
      .from(products)
      .leftJoin(user, eq(products.userId, user.id))
      .where(eq(products.id, productId))
      .limit(1);

    if (product.length === 0) {
      return { success: false, error: "Product not found" };
    }

    // Check if the current user has purchased this product
    let hasPurchased = false;
    let liked = false;

    if (session?.user) {
      // Check purchase
      const sale = await db
        .select()
        .from(productSales)
        .where(
          and(
            eq(productSales.productId, productId),
            eq(productSales.buyerId, session.user.id),
            eq(productSales.status, "completed")
          )
        )
        .limit(1);

      hasPurchased = sale.length > 0;

      // Check like
      const like = await db
        .select()
        .from(productLikes)
        .where(
          and(
            eq(productLikes.productId, productId),
            eq(productLikes.userId, session.user.id)
          )
        )
        .limit(1);

      liked = like.length > 0;
    }

    // Increment view count
    await db
      .update(products)
      .set({ views: sql`${products.views} + 1` })
      .where(eq(products.id, productId));

    return {
      success: true,
      data: {
        ...product[0],
        hasPurchased,
        liked,
      },
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return { success: false, error: "Failed to fetch product" };
  }
}

// Get user stats
export async function getUserStats() {
  try {
    const session = await getCachedSession();

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    const userProducts = await db
      .select({
        views: products.views,
        likes: products.likes,
        sales: products.sales,
        price: products.price,
      })
      .from(products)
      .where(eq(products.userId, session.user.id));

    const stats = userProducts.reduce(
      (acc, product) => ({
        totalProducts: acc.totalProducts + 1,
        totalViews: acc.totalViews + (product.views || 0),
        totalLikes: acc.totalLikes + (product.likes || 0),
        totalSales: acc.totalSales + (product.sales || 0),
        totalRevenue:
          acc.totalRevenue +
          (product.sales || 0) * parseFloat(product.price || "0"),
      }),
      {
        totalProducts: 0,
        totalViews: 0,
        totalLikes: 0,
        totalSales: 0,
        totalRevenue: 0,
      }
    );

    return { success: true, data: stats };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return { success: false, error: "Failed to fetch stats" };
  }
}

export async function trackProductView(
  productId: string,
  ipAddress?: string,
  userAgent?: string,
  referrer?: string
) {
  try {
    const session = await getCachedSession();

    // Insert view record
    await db.insert(productViews).values({
      productId,
      userId: session?.user?.id || null,
      ipAddress,
      userAgent,
      referrer,
    });

    // Update product view count
    await db
      .update(products)
      .set({ views: sql`${products.views} + 1` })
      .where(eq(products.id, productId));

    // Update user total views
    const product = await db
      .select({ userId: products.userId })
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (product.length > 0) {
      await db
        .update(user)
        .set({ totalViews: sql`${user.totalViews} + 1` })
        .where(eq(user.id, product[0].userId));
    }

    return { success: true };
  } catch (error) {
    console.error("Error tracking view:", error);
    return { success: false, error: "Failed to track view" };
  }
}

// Toggle product like
export async function toggleProductLike(productId: string) {
  try {
    const session = await getCachedSession();

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    // Check if already liked
    const existingLike = await db
      .select()
      .from(productLikes)
      .where(
        and(
          eq(productLikes.productId, productId),
          eq(productLikes.userId, session.user.id)
        )
      )
      .limit(1);

    if (existingLike.length > 0) {
      // Unlike
      await db
        .delete(productLikes)
        .where(
          and(
            eq(productLikes.productId, productId),
            eq(productLikes.userId, session.user.id)
          )
        );

      await db
        .update(products)
        .set({ likes: sql`GREATEST(${products.likes} - 1, 0)` })
        .where(eq(products.id, productId));

      // Optionally revalidate
      // revalidatePath(`/products/${productId}`);

      return { success: true, liked: false };
    } else {
      // Like
      await db.insert(productLikes).values({
        productId,
        userId: session.user.id,
        // createdAt: new Date().toISOString(), // if you have this field
      });

      await db
        .update(products)
        .set({ likes: sql`${products.likes} + 1` })
        .where(eq(products.id, productId));

      // Optionally revalidate
      // revalidatePath(`/products/${productId}`);

      return { success: true, liked: true };
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return { success: false, error: "Failed to toggle like" };
  }
}

// Get product analytics
export async function getProductAnalytics(
  productId: string,
  days: number = 30
) {
  try {
    const session = await getCachedSession();

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    // Check if user owns the product
    const product = await db
      .select()
      .from(products)
      .where(
        and(eq(products.id, productId), eq(products.userId, session.user.id))
      )
      .limit(1);

    if (product.length === 0) {
      return { success: false, error: "Product not found or unauthorized" };
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Generate daily stats (mock data for now - replace with actual tracking)
    const dailyStats = await db
      .select({
        date: dailyAnalytics.date,
        views: dailyAnalytics.views,
        likes: dailyAnalytics.likes,
        sales: dailyAnalytics.sales,
        revenue: dailyAnalytics.revenue,
      })
      .from(dailyAnalytics)
      .where(
        and(
          eq(dailyAnalytics.productId, productId),
          gte(dailyAnalytics.date, startDate.toISOString())
        )
      )
      .orderBy(dailyAnalytics.date);

    // Fill in missing dates with zeros
    const filledStats = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const existingStat = dailyStats.find(
        (stat) => new Date(stat.date).toDateString() === date.toDateString()
      );

      filledStats.push({
        date: date.toISOString().split("T")[0],
        views: existingStat?.views || 0,
        likes: existingStat?.likes || 0,
        sales: existingStat?.sales || 0,
        revenue: parseFloat(existingStat?.revenue || "0"),
      });
    }
    // Get total stats from product table
    const totalStats = {
      totalViews: product[0].views || 0,
      totalLikes: product[0].likes || 0,
      totalSales: product[0].sales || 0,
    };

    // Get recent views (mock data for now)
    const recentViews = await db
      .select({
        id: productViews.id,
        userId: productViews.userId,
        userName: user.name,
        userImage: user.image,
        ipAddress: productViews.ipAddress,
        referrer: productViews.referrer,
        createdAt: productViews.createdAt,
      })
      .from(productViews)
      .leftJoin(user, eq(productViews.userId, user.id))
      .where(eq(productViews.productId, productId))
      .orderBy(desc(productViews.createdAt))
      .limit(10);

    return {
      success: true,
      data: {
        product: product[0],
        dailyStats: filledStats, // Use filledStats instead of dailyStats
        totalStats,
        recentViews,
      },
    };
  } catch (error) {
    console.error("Error fetching product analytics:", error);
    return { success: false, error: "Failed to fetch analytics" };
  }
}

// Get user dashboard analytics

export async function getUserDashboardAnalytics(days: number = 30) {
  try {
    const session = await getCachedSession();

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get user's products with stats
    const userProducts = await db
      .select({
        id: products.id,
        title: products.title,
        thumbnail: products.thumbnail,
        price: products.price,
        status: products.status,
        views: products.views,
        likes: products.likes,
        sales: products.sales,
        revenue: products.revenue,
        createdAt: products.createdAt,
      })
      .from(products)
      .where(eq(products.userId, session.user.id))
      .orderBy(desc(products.createdAt));

    // Generate daily stats from the date range (mock data for now)
    const dailyStatsRaw = await db
      .select({
        date: dailyAnalytics.date,
        views: sum(dailyAnalytics.views).as("views"),
        likes: sum(dailyAnalytics.likes).as("likes"),
        sales: sum(dailyAnalytics.sales).as("sales"),
        revenue: sum(dailyAnalytics.revenue).as("revenue"),
      })
      .from(dailyAnalytics)
      .innerJoin(products, eq(dailyAnalytics.productId, products.id))
      .where(
        and(
          eq(products.userId, session.user.id),
          gte(dailyAnalytics.date, startDate.toISOString())
        )
      )
      .groupBy(dailyAnalytics.date)
      .orderBy(dailyAnalytics.date);

    // Fill in missing dates with zeros
    const dailyStats = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const existingStat = dailyStatsRaw.find(
        (stat) => new Date(stat.date).toDateString() === date.toDateString()
      );

      dailyStats.push({
        date: date.toISOString().split("T")[0],
        views: Number(existingStat?.views || 0),
        likes: Number(existingStat?.likes || 0),
        sales: Number(existingStat?.sales || 0),
        revenue: Number(existingStat?.revenue || 0),
      });
    }

    // Get top performing products
    const topProducts = userProducts
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5)
      .map((product) => ({
        ...product,
        views: product.views || 0,
        likes: product.likes || 0,
        sales: product.sales || 0,
        revenue: parseFloat(String(product.revenue || "0")),
      }));

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

    return {
      success: true,
      data: {
        products: userProducts,
        dailyStats,
        topProducts,
        totals,
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard analytics:", error);
    return { success: false, error: "Failed to fetch analytics" };
  }
}

export async function aggregateDailyStats(targetDate?: string) {
  const date = targetDate || new Date().toISOString().split("T")[0];
  const startOfDay = new Date(date + "T00:00:00Z");
  const endOfDay = new Date(date + "T23:59:59Z");

  // Get all products to aggregate
  const allProducts = await db.select({ id: products.id }).from(products);

  for (const product of allProducts) {
    // Count views for this product on this date
    const viewsCount = await db
      .select({ count: count() })
      .from(productViews)
      .where(
        and(
          eq(productViews.productId, product.id),
          gte(productViews.createdAt, startOfDay.toISOString()),
          lte(productViews.createdAt, endOfDay.toISOString())
        )
      );

    // Count likes for this product on this date
    const likesCount = await db
      .select({ count: count() })
      .from(productLikes)
      .where(
        and(
          eq(productLikes.productId, product.id),
          gte(productLikes.createdAt, startOfDay.toISOString()),
          lte(productLikes.createdAt, endOfDay.toISOString())
        )
      );

    // Count sales for this product on this date
    const salesData = await db
      .select({
        count: count(),
        revenue: sum(productSales.amount),
      })
      .from(productSales)
      .where(
        and(
          eq(productSales.productId, product.id),
          gte(productSales.createdAt, startOfDay.toISOString()),
          lte(productSales.createdAt, endOfDay.toISOString())
        )
      );

    // Insert or update daily analytics
    await db
      .insert(dailyAnalytics)
      .values({
        date: startOfDay.toISOString(),
        productId: product.id,
        views: viewsCount[0].count,
        likes: likesCount[0].count,
        sales: salesData[0].count,
        revenue: salesData[0].revenue || "0.00",
      })
      .onConflictDoUpdate({
        target: [dailyAnalytics.date, dailyAnalytics.productId],
        set: {
          views: viewsCount[0].count,
          likes: likesCount[0].count,
          sales: salesData[0].count,
          revenue: salesData[0].revenue || "0.00",
        },
      });
  }
}
