"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProductDetailsDialog from "@/components/admin/ProductDetailsDialog";
import { Loader2 } from "lucide-react";

interface Product {
  id: string;
  title: string;
  status: string;
  approved: boolean;
  rejected: boolean;
  adminComment: string | null;
  description: string;
  category: string;
  price: string;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
}

export default function ProductTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [approveLoading, setApproveLoading] = useState<string | null>(null);
  const [rejectLoading, setRejectLoading] = useState<string | null>(null);
  const [removeLoading, setRemoveLoading] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      });
  }, []);

  const handleApprove = async (productId: string) => {
    setApproveLoading(productId);
    await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, approved: true, rejected: false }),
    });
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, approved: true, rejected: false } : p
      )
    );
    setApproveLoading(null);
  };

  const handleReject = async (productId: string) => {
    setRejectLoading(productId);
    await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, approved: false, rejected: true }),
    });
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, approved: false, rejected: true } : p
      )
    );
    setRejectLoading(null);
  };

  const handleRemove = async (productId: string) => {
    setRemoveLoading(productId);
    await fetch("/api/admin/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setRemoveLoading(null);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-8 w-full">
        <Loader2 className="animate-spin w-6 h-6 mr-2 text-muted-foreground" />
        <span>Loading products...</span>
      </div>
    );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Image</th>
                <th className="p-2 text-left">Title</th>
                <th className="p-2 text-left">Category</th>
                <th className="p-2 text-left">Price</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b hover:bg-muted cursor-pointer"
                    onClick={() => {
                      setSelected(p);
                      setDialogOpen(true);
                    }}
                  >
                    <td className="p-2">
                      {p.thumbnail ? (
                        <div className="w-32 aspect-video bg-muted rounded overflow-hidden flex items-center justify-center">
                          <img
                            src={p.thumbnail}
                            alt={p.title}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ) : (
                        <div className="w-32 aspect-video bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                          No Image
                        </div>
                      )}
                    </td>
                    <td className="p-2">{p.title}</td>
                    <td className="p-2">{p.category}</td>
                    <td className="p-2">${p.price}</td>
                    <td className="p-2">{p.status}</td>
                    <td
                      className="p-2 space-x-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemove(p.id)}
                        disabled={removeLoading === p.id}
                      >
                        {removeLoading === p.id ? (
                          <Loader2 className="animate-spin w-4 h-4 mr-1 inline" />
                        ) : null}
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <ProductDetailsDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          product={selected}
        />
      </CardContent>
    </Card>
  );
}
