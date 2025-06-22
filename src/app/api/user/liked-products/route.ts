// app/api/user/liked-products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { productLikes, products, user } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { headers } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const likedProducts = await db
      .select({
        id: products.id,
        title: products.title,
        thumbnail: products.thumbnail,
        price: products.price,
        createdAt: productLikes.createdAt,
      })
      .from(productLikes)
      .innerJoin(products, eq(productLikes.productId, products.id))
      .where(eq(productLikes.userId, session.user.id))
      .orderBy(desc(productLikes.createdAt));

    return NextResponse.json(likedProducts);
  } catch (error) {
    console.error("Error fetching liked products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
