"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function AnalyticsCards() {
  const [stats, setStats] = useState<{
    totalUsers: number;
    totalProducts: number;
    totalSales: number;
    totalRevenue: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  if (loading || !stats)
    return (
      <div className="flex items-center justify-center py-8 w-full">
        <Loader2 className="animate-spin w-6 h-6 mr-2 text-muted-foreground" />
        <span>Loading analytics...</span>
      </div>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full mb-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-3xl font-bold">{stats.totalUsers}</span>
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Total Products</CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-3xl font-bold">{stats.totalProducts}</span>
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Total Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-3xl font-bold">{stats.totalSales}</span>
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-3xl font-bold">
            ${Number(stats.totalRevenue).toLocaleString()}
          </span>
        </CardContent>
      </Card>
    </div>
  );
}
