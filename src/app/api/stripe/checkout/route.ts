// app/api/stripe/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/db";
import { products, user as userTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil", // Use a stable version
});

export async function POST(req: NextRequest) {
  // 1. Authenticate user
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Parse request
  const { productId } = await req.json();

  // 3. Fetch product and seller info
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

  // 4. Fetch seller's Stripe account to get country
  let account: Stripe.Account;
  try {
    account = await stripe.accounts.retrieve(seller.stripeAccountId);
  } catch (err: any) {
    console.error("Stripe account retrieve error:", err);
    return NextResponse.json(
      {
        error: "Failed to retrieve seller Stripe account",
        details: err?.message || "No error message",
        stripeError: err,
      },
      { status: 500 }
    );
  }

  // 5. Calculate amounts (in cents)
  const amount = Math.round(Number(product.price) * 100); // e.g. $10.00 -> 1000
  const platformFee = Math.round(amount * 0.25); // 25% fee

  // 6. Build payment_intent_data
  const paymentIntentData: Stripe.Checkout.SessionCreateParams.PaymentIntentData =
    {
      application_fee_amount: platformFee,
      transfer_data: {
        destination: seller.stripeAccountId,
      },
      on_behalf_of: seller.stripeAccountId, // Always set this!
      metadata: {
        productId: product.id,
        buyerId: session.user.id,
        sellerId: seller.id,
      },
    };

  // Add on_behalf_of for non-US sellers
  if (account.country !== "US") {
    paymentIntentData.on_behalf_of = seller.stripeAccountId;
  }

  // 7. Create Stripe Checkout Session
  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.title,
              description: product.description,
              images: product.thumbnail ? [product.thumbnail] : [],
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      payment_intent_data: paymentIntentData,
      customer_email: session.user.email,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/product/${product.id}?checkout=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/product/${product.id}?checkout=cancel`,
      metadata: {
        productId: product.id,
        buyerId: session.user.id,
        sellerId: seller.id,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error("Stripe Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session", details: error?.message },
      { status: 500 }
    );
  }
}
