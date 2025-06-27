"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductDialog({
  open,
  onOpenChange,
  product,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: any;
}) {
  if (!product) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{product.title}</DialogTitle>
        </DialogHeader>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <b>ID:</b> {product.id}
              </div>
              <div>
                <b>Status:</b> {product.status}
              </div>
              <div>
                <b>Approved:</b> {product.approved ? "Yes" : "No"}
              </div>
              <div>
                <b>Rejected:</b> {product.rejected ? "Yes" : "No"}
              </div>
              <div>
                <b>Description:</b> {product.description}
              </div>
              <div>
                <b>Category:</b> {product.category}
              </div>
              <div>
                <b>Price:</b> ${product.price}
              </div>
              <div>
                <b>Created:</b> {product.createdAt}
              </div>
              <div>
                <b>Updated:</b> {product.updatedAt}
              </div>
              <div>
                <b>Admin Comment:</b> {product.adminComment}
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
