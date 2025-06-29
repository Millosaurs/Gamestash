import { NextResponse } from "next/server";
import { db } from "@/db";
import { products, productLikes } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { getCachedSession } from "@/lib/session-cache";

const sessionCache = new Map();

export async function POST(request: Request) {
  try {
    // Get the product id from the URL
    const url = new URL(request.url);
    const productId = url.pathname.split("/").filter(Boolean).pop();

    // Use the same cache key logic as your settings route
    const cacheKey = request.headers.get("authorization") || "anon";
    let session = sessionCache.get(cacheKey);
    if (!session) {
      session = await getCachedSession();
      sessionCache.set(cacheKey, session);
    }

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = session.user.id;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Check if the like already exists
    const existing = await db
      .select()
      .from(productLikes)
      .where(
        and(
          eq(productLikes.productId, productId),
          eq(productLikes.userId, userId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      // Unlike: delete the like
      await db
        .delete(productLikes)
        .where(
          and(
            eq(productLikes.productId, productId),
            eq(productLikes.userId, userId)
          )
        );

      // Decrement likes count, but not below zero
      await db
        .update(products)
        .set({ likes: sql`GREATEST(${products.likes} - 1, 0)` })
        .where(eq(products.id, productId));

      return NextResponse.json({ success: true, liked: false });
    } else {
      // Like: insert new like
      await db.insert(productLikes).values({
        productId,
        userId,
      });

      // Increment likes count
      await db
        .update(products)
        .set({ likes: sql`${products.likes} + 1` })
        .where(eq(products.id, productId));

      return NextResponse.json({ success: true, liked: true });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
