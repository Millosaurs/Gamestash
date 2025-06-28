import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/db";
import { user as userTable } from "@/db/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state"); // userId

  if (!code || !state) {
    return NextResponse.redirect(
      new URL(
        "/dashboard/connect?error=missing_code",
        process.env.NEXT_PUBLIC_APP_URL
      )
    );
  }

  try {
    // Exchange code for access token
    const response = await fetch("https://connect.stripe.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_secret: process.env.STRIPE_SECRET_KEY!,
        code,
        grant_type: "authorization_code",
      }),
    });

    const data = await response.json();

    if (!data.stripe_user_id) {
      return NextResponse.redirect(
        new URL(
          "/dashboard/connect?error=stripe_error",
          process.env.NEXT_PUBLIC_APP_URL
        )
      );
    }

    // Update user in DB
    await db
      .update(userTable)
      .set({ stripeAccountId: data.stripe_user_id })
      .where(eq(userTable.id, state));

    // Redirect to dashboard
    return NextResponse.redirect(
      new URL("/dashboard/connect?success=1", process.env.NEXT_PUBLIC_APP_URL)
    );
  } catch (error) {
    return NextResponse.redirect(
      new URL(
        "/dashboard/connect?error=server_error",
        process.env.NEXT_PUBLIC_APP_URL
      )
    );
  }
}
