import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { db } from "@/db/index";
import {
  user,
  session,
  account,
  productLikes,
  productSales,
  productViews,
  adminCredentials,
  adminSessions,
  productApprovals,
  products,
} from "@/db/schema";
import { eq } from "drizzle-orm";

// GET: List all users
export async function GET(request: NextRequest) {
  const session = await verifyAdminSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const users = await db.select().from(user);
  return NextResponse.json({ users });
}

// PATCH: Ban/unban user
export async function PATCH(request: NextRequest) {
  const session = await verifyAdminSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { userId, banned } = await request.json();
  await db.update(user).set({ banned }).where(eq(user.id, userId));
  return NextResponse.json({ success: true });
}

// DELETE: Remove user
export async function DELETE(request: NextRequest) {
  const sessionData = await verifyAdminSession();
  if (!sessionData)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { userId } = await request.json();

  // Delete dependent records first to avoid foreign key constraint errors
  await db.delete(session).where(eq(session.userId, userId));
  await db.delete(account).where(eq(account.userId, userId));
  await db.delete(productLikes).where(eq(productLikes.userId, userId));
  await db.delete(productSales).where(eq(productSales.buyerId, userId));
  await db.delete(productSales).where(eq(productSales.sellerId, userId));
  await db.delete(productViews).where(eq(productViews.userId, userId));
  await db.delete(adminCredentials).where(eq(adminCredentials.userId, userId));
  await db.delete(adminSessions).where(eq(adminSessions.adminId, userId));
  await db.delete(productApprovals).where(eq(productApprovals.adminId, userId));
  // Delete all products owned by this user (and their dependent records)
  const userProducts = await db
    .select()
    .from(products)
    .where(eq(products.userId, userId));
  for (const product of userProducts) {
    await db.delete(productLikes).where(eq(productLikes.productId, product.id));
    await db.delete(productSales).where(eq(productSales.productId, product.id));
    await db.delete(productViews).where(eq(productViews.productId, product.id));
    await db
      .delete(productApprovals)
      .where(eq(productApprovals.productId, product.id));
    await db.delete(products).where(eq(products.id, product.id));
  }
  await db.delete(user).where(eq(user.id, userId));
  return NextResponse.json({ success: true });
}
