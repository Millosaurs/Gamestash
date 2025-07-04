import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { db } from "@/db/index";
import { alias } from "drizzle-orm/pg-core";
import { user, products, productSales } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Stripe from "stripe";

// GET: List all sales with product and user info
export async function GET(request: NextRequest) {
  const session = await verifyAdminSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const buyerUser = alias(user, "buyerUser");
  const sellerUser = alias(user, "sellerUser");

  const sales = await db
    .select({
      id: productSales.id,
      productId: productSales.productId,
      productTitle: products.title,
      productThumbnail: products.thumbnail,
      buyerId: productSales.buyerId,
      buyerName: buyerUser.name,
      sellerId: productSales.sellerId,
      sellerName: sellerUser.name,
      amount: productSales.amount,
      status: productSales.status,
      createdAt: productSales.createdAt,
      refunded: productSales.refunded,
      consentGiven: productSales.consentGiven,
    })
    .from(productSales)
    .leftJoin(products, eq(productSales.productId, products.id))
    .leftJoin(buyerUser, eq(productSales.buyerId, buyerUser.id))
    .leftJoin(sellerUser, eq(productSales.sellerId, sellerUser.id))
    .orderBy(desc(productSales.createdAt));
  return NextResponse.json({ sales });
}

// PATCH: Refund a sale (with Stripe)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export async function PATCH(request: NextRequest) {
  const session = await verifyAdminSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { saleId, refunded } = await request.json();

  // 1. Get the sale record
  const saleArr = await db
    .select()
    .from(productSales)
    .where(eq(productSales.id, saleId))
    .limit(1);

  const sale = saleArr[0];
  if (!sale) {
    return NextResponse.json({ error: "Sale not found" }, { status: 404 });
  }

  // 2. Get the Stripe PaymentIntent ID
  const stripePaymentIntentId = sale.stripePaymentIntentId;
  if (!stripePaymentIntentId) {
    return NextResponse.json(
      { error: "No Stripe payment intent ID" },
      { status: 400 }
    );
  }

  // 3. Trigger the refund if requested
  if (refunded) {
    try {
      await stripe.refunds.create({
        payment_intent: stripePaymentIntentId,
      });
    } catch (err: any) {
      return NextResponse.json(
        { error: "Stripe refund failed", details: err.message },
        { status: 500 }
      );
    }
  }

  // 4. Mark as refunded in your DB
  await db
    .update(productSales)
    .set({ refunded: !!refunded, status: refunded ? "refunded" : "completed" })
    .where(eq(productSales.id, saleId));

  return NextResponse.json({ success: true });
}

// DELETE: Remove a sale record
export async function DELETE(request: NextRequest) {
  const session = await verifyAdminSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { saleId } = await request.json();
  await db.delete(productSales).where(eq(productSales.id, saleId));
  return NextResponse.json({ success: true });
}
