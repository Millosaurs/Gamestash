import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/db";
import { productSales } from "@/db/schema";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object as Stripe.PaymentIntent;
    const metadata = intent.metadata || {};

    try {
      await db.insert(productSales).values({
        productId: metadata.productId,
        buyerId: metadata.buyerId,
        sellerId: metadata.sellerId,
        amount: ((intent.amount_received ?? 0) / 100).toFixed(2),
        status: "completed",
        refunded: false,
        consentGiven: true,
        stripePaymentIntentId: intent.id,
      });

      return NextResponse.json({ received: true });
    } catch (err) {
      console.error("DB Insert Error:", err);
      return NextResponse.json(
        { error: "DB insert failed", details: String(err) },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
