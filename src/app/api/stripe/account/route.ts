// app/api/stripe/account/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user as userTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [dbUser] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, session.user.id));

  if (!dbUser?.stripeAccountId) {
    return NextResponse.json(null);
  }

  try {
    const account = await stripe.accounts.retrieve(dbUser.stripeAccountId);
    return NextResponse.json({
      id: account.id,
      connectDate: dbUser.connectDate,
    });
  } catch (error) {
    return NextResponse.json(null);
  }
}
