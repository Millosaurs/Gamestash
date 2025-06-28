// app/api/stripe/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/db";
import { products, user as userTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId } = await req.json();

  // Fetch product and seller info
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.id, productId));

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const [seller] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, product.userId));

  if (!seller?.stripeAccountId) {
    return NextResponse.json(
      { error: "Seller not connected to Stripe" },
      { status: 400 }
    );
  }

  // Calculate amounts (in cents)
  const amount = Math.round(Number(product.price) * 100); // e.g. $10.00 -> 1000
  const platformFee = Math.round(amount * 0.25); // 25% fee

  // Create PaymentIntent
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "usd", // or your currency
    application_fee_amount: platformFee,
    transfer_data: {
      destination: seller.stripeAccountId,
    },
    // Optionally, add metadata, description, etc.
  });

  return NextResponse.json({ clientSecret: paymentIntent.client_secret });
}
