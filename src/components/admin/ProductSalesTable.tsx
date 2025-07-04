"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// Adjust this interface to match your API response
interface Sale {
  id: string;
  productId: string;
  productTitle: string;
  productThumbnail?: string;
  buyerId: string;
  buyerName?: string;
  sellerId: string;
  sellerName?: string;
  amount: string;
  status: string;
  createdAt: string;
  refunded: boolean;
  consentGiven: boolean;
}

export default function SalesTable() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [refundLoading, setRefundLoading] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/sales")
      .then((res) => res.json())
      .then((data) => {
        setSales(data.sales || []);
        setLoading(false);
      });
  }, []);

  const handleRefund = async (saleId: string) => {
    setRefundLoading(saleId);
    await fetch("/api/admin/sales", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ saleId, refunded: true }),
    });
    setSales((prev) =>
      prev.map((s) =>
        s.id === saleId ? { ...s, refunded: true, status: "refunded" } : s
      )
    );
    setRefundLoading(null);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-8 w-full">
        <Loader2 className="animate-spin w-6 h-6 mr-2 text-muted-foreground" />
        <span>Loading sales...</span>
      </div>
    );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Sales</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Product</th>
                <th className="p-2 text-left">Buyer</th>
                <th className="p-2 text-left">Seller</th>
                <th className="p-2 text-left">Amount</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sales.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No sales found.
                  </td>
                </tr>
              ) : (
                sales.map((s) => (
                  <tr key={s.id} className="border-b hover:bg-muted">
                    <td className="p-2 flex items-center gap-2">
                      {s.productThumbnail ? (
                        <div className="w-16 aspect-video bg-muted rounded overflow-hidden flex items-center justify-center">
                          <img
                            src={s.productThumbnail}
                            alt={s.productTitle}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ) : (
                        <div className="w-16 aspect-video bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                          No Image
                        </div>
                      )}
                      <span>{s.productTitle}</span>
                    </td>
                    <td className="p-2">{s.buyerName || s.buyerId}</td>
                    <td className="p-2">{s.sellerName || s.sellerId}</td>
                    <td className="p-2">${s.amount}</td>
                    <td className="p-2">
                      {s.refunded ? (
                        <span className="text-red-500">Refunded</span>
                      ) : (
                        s.status
                      )}
                    </td>
                    <td className="p-2">
                      {new Date(s.createdAt).toLocaleString()}
                    </td>
                    <td className="p-2 space-x-2">
                      {!s.refunded && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRefund(s.id)}
                          disabled={refundLoading === s.id}
                        >
                          {refundLoading === s.id ? (
                            <Loader2 className="animate-spin w-4 h-4 mr-1 inline" />
                          ) : null}
                          Refund
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
