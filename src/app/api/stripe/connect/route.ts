// app/api/stripe/connect/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import Stripe from "stripe";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.STRIPE_CLIENT_ID!,
    scope: "read_write",
    redirect_uri: process.env.NEXT_PUBLIC_STRIPE_REDIRECT_URI!,
    state: session.user.id, // for CSRF protection
    // You can add more params if needed
  });

  const url = `https://connect.stripe.com/oauth/authorize?${params.toString()}`;
  return NextResponse.json({ url });
}
