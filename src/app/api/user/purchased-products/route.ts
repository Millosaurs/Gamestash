// app/api/user/purchased-products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getCachedSession } from "@/lib/session-cache";
import { db } from "@/db";
import { productSales, products } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

// Add session cache
const sessionCache = new Map();

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = session.user.id;

    const purchasedProducts = await db
      .select({
        id: productSales.id,
        amount: productSales.amount,
        status: productSales.status,
        createdAt: productSales.createdAt,
        product: {
          id: products.id,
          title: products.title,
          thumbnail: products.thumbnail,
        },
      })
      .from(productSales)
      .innerJoin(products, eq(productSales.productId, products.id))
      .where(eq(productSales.buyerId, session.user.id))
      .orderBy(desc(productSales.createdAt));

    return NextResponse.json(purchasedProducts);
  } catch (error) {
    console.error("Error fetching purchased products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
