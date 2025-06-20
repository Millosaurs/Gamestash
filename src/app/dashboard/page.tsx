"use client";

import { useState } from "react";
import {
  Sparkles,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  DollarSign,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "@/components/header";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { NewProductForm } from "@/components/product-comp/new-product";
import { EditProductForm } from "@/components/product-comp/edit-product";
import { SiteHeader } from "@/components/sidebar/site-header";

// Mock user data
const user = {
  name: "Alex Chen",
  email: "alex@example.com",
  avatar:
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
  totalProducts: 12,
  totalSales: 89,
  totalRevenue: 15420,
  totalViews: 125000,
};

// Mock products data
const mockProducts = [
  {
    id: 1,
    title: "Ultimate Minecraft RGB Battlestation",
    thumbnail:
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=300&h=200&fit=crop&q=80",
    price: 1299,
    status: "published",
    views: 12450,
    likes: 1247,
    sales: 23,
    tags: ["Minecraft", "RGB", "Gaming"],
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
  },
  {
    id: 2,
    title: "Minimalist Workspace Setup",
    thumbnail:
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=200&fit=crop&q=80",
    price: 999,
    status: "draft",
    views: 0,
    likes: 0,
    sales: 0,
    tags: ["Minimal", "Workspace", "Clean"],
    createdAt: "2024-01-18",
    updatedAt: "2024-01-18",
  },
  {
    id: 3,
    title: "Rust Gaming Command Center",
    thumbnail:
      "https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=300&h=200&fit=crop&q=80",
    price: 1599,
    status: "published",
    views: 8920,
    likes: 892,
    sales: 15,
    tags: ["Rust", "Gaming", "Professional"],
    createdAt: "2024-01-10",
    updatedAt: "2024-01-22",
  },
];

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editProductId, setEditProductId] = useState<number | null>(null);

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEditProduct = (productId: number) => {
    setEditProductId(productId);
    setEditOpen(true);
  };

  const handleDeleteProduct = (productId: number) => {
    // Handle delete logic
    console.log("Delete product:", productId);
  };

  const handlePreviewProduct = (productId: number) => {
    window.location.href = `/setup/${productId}`;
  };

  return (
    <>
      <SiteHeader />
      <div className="min-h-screen bg-background font-sans">
        <div className=" max-w-9xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2 font-display">
              Welcome back, {user.name}!
            </h1>
            <p className="text-muted-foreground">
              Manage your gaming setups and track your performance.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Products
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-display">
                  {user.totalProducts}
                </div>
                <p className="text-xs text-muted-foreground">
                  +2 from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Sales
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-display">
                  {user.totalSales}
                </div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-display">
                  ${user.totalRevenue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  +8% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Views
                </CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-display">
                  {Math.round(user.totalViews / 1000)}k
                </div>
                <p className="text-xs text-muted-foreground">
                  +15% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Products Section */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="font-display">Your Products</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Manage and track your gaming setup listings
                  </p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setOpen(true)}>
                      Create New Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    className="
    w-full
    max-w-lg
    sm:max-w-2xl
    md:max-w-3xl
    lg:max-w-5xl
    xl:max-w-6xl
    max-h-[90vh]
    p-0
    rounded-xl
    bg-background
    shadow-lg
    flex flex-col
  "
                  >
                    <DialogTitle className="px-6 pt-6">
                      Create New Product
                    </DialogTitle>
                    <div className="flex-1 overflow-y-auto p-6">
                      <NewProductForm onClose={() => setOpen(false)} />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={statusFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant={
                      statusFilter === "published" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setStatusFilter("published")}
                  >
                    Published
                  </Button>
                  <Button
                    variant={statusFilter === "draft" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("draft")}
                  >
                    Draft
                  </Button>
                </div>
              </div>

              {/* Products Table */}
              <div className="rounded-md border overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">Product</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right hidden sm:table-cell">
                          Views
                        </TableHead>
                        <TableHead className="text-right hidden sm:table-cell">
                          Likes
                        </TableHead>
                        <TableHead className="text-right hidden md:table-cell">
                          Sales
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img
                                src={product.thumbnail || "/placeholder.svg"}
                                alt={product.title}
                                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                              />
                              <div className="min-w-0">
                                <div className="font-medium text-foreground truncate">
                                  {product.title}
                                </div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {product.tags.slice(0, 2).map((tag) => (
                                    <Badge
                                      key={tag}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                  {product.tags.length > 2 && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      +{product.tags.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                product.status === "published"
                                  ? "default"
                                  : "secondary"
                              }
                              className={
                                product.status === "published"
                                  ? "bg-primary text-primary-foreground"
                                  : ""
                              }
                            >
                              {product.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ${product.price}
                          </TableCell>
                          <TableCell className="text-right hidden sm:table-cell">
                            {product.views.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right hidden sm:table-cell">
                            {product.likes.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right hidden md:table-cell">
                            {product.sales}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    handlePreviewProduct(product.id)
                                  }
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  Preview
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleEditProduct(product.id)}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleDeleteProduct(product.id)
                                  }
                                  className="text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No products found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery
                      ? "Try adjusting your search terms."
                      : "Get started by creating your first product."}
                  </p>
                  {!searchQuery && (
                    <Button
                      onClick={() =>
                        (window.location.href = "/dashboard/products/new")
                      }
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Product
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent
            className="
            w-full
            max-w-lg
            sm:max-w-2xl
            md:max-w-3xl
            lg:max-w-5xl
            xl:max-w-6xl
            max-h-[90vh]
            p-0
            rounded-xl
            bg-background
            shadow-lg
            flex flex-col
          "
          >
            <DialogTitle className="px-6 pt-6">Edit Product</DialogTitle>
            <div className="flex-1 overflow-y-auto p-6">
              {editProductId && (
                <EditProductForm
                  productId={editProductId}
                  onClose={() => setEditOpen(false)}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
