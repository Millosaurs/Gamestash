import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/index";
import {
  user,
  session,
  account,
  productLikes,
  productSales,
  productViews,
  products,
} from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

export async function DELETE(request: NextRequest) {
  const authSession = await auth.api.getSession({ headers: request.headers });

  if (!authSession?.user?.id) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const userId = authSession.user.id;

  try {
    await db.transaction(async (tx) => {
      const userProducts = await tx
        .select({ id: products.id })
        .from(products)
        .where(eq(products.userId, userId));

      const productIds = userProducts.map((p) => p.id);
      if (productIds.length > 0) {
        await tx
          .delete(productLikes)
          .where(inArray(productLikes.productId, productIds));
        await tx
          .delete(productSales)
          .where(inArray(productSales.productId, productIds));
        await tx
          .delete(productViews)
          .where(inArray(productViews.productId, productIds));
        await tx.delete(products).where(eq(products.userId, userId));
      }
      await tx.delete(productLikes).where(eq(productLikes.userId, userId));
      await tx.delete(productSales).where(eq(productSales.buyerId, userId));
      await tx.delete(productViews).where(eq(productViews.userId, userId));
      await tx.delete(account).where(eq(account.userId, userId));
      await tx.delete(session).where(eq(session.userId, userId));
      await tx.delete(user).where(eq(user.id, userId));
    });

    // Return a success response
    return NextResponse.json(
      { success: true, message: "Account deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete account:", error);
    return NextResponse.json(
      { message: "An error occurred while deleting your account." },
      { status: 500 }
    );
  }
}
