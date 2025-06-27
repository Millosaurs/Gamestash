import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { db } from "@/db/index";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET: List all products
export async function GET(request: NextRequest) {
  const session = await verifyAdminSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const allProducts = await db.select().from(products);
  return NextResponse.json({ products: allProducts });
}

// PATCH: Approve/Reject product
export async function PATCH(request: NextRequest) {
  const session = await verifyAdminSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId, approved, rejected, adminComment } = await request.json();
  await db
    .update(products)
    .set({ approved, rejected, adminComment })
    .where(eq(products.id, productId));
  return NextResponse.json({ success: true });
}
// DELETE: Remove product
export async function DELETE(request: NextRequest) {
  const session = await verifyAdminSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId } = await request.json();
  await db.delete(products).where(eq(products.id, productId));
  return NextResponse.json({ success: true });
}
