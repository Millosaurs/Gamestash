import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { db } from "@/db/index";
import { user, products, productSales, dailyAnalytics } from "@/db/schema";
import { count, sum } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const session = await verifyAdminSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Total users
  const totalUsers = await db.select({ count: count() }).from(user);
  // Total products
  const totalProducts = await db.select({ count: count() }).from(products);
  // Total sales
  const totalSales = await db.select({ count: count() }).from(productSales);
  // Total revenue
  const totalRevenue = await db
    .select({ revenue: sum(productSales.amount) })
    .from(productSales);
  // Daily analytics (last 30 days)
  const last30Days = await db.select().from(dailyAnalytics);

  return NextResponse.json({
    totalUsers: totalUsers[0].count,
    totalProducts: totalProducts[0].count,
    totalSales: totalSales[0].count,
    totalRevenue: totalRevenue[0].revenue,
    last30Days,
  });
}
