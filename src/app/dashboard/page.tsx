// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { NewProductForm } from "@/components/product-comp/new-product";
import { EditProductForm } from "@/components/product-comp/edit-product";
import { SiteHeader } from "@/components/sidebar/site-header";
import {
  getUserProducts,
  getUserStats,
  deleteProduct,
} from "@/lib/actions/products";
import { useSession } from "@/lib/auth-client";
import { Product, UserStats } from "@/lib/types/product";
import { toast } from "sonner";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalProducts: 0,
    totalViews: 0,
    totalLikes: 0,
    totalSales: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editProductId, setEditProductId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!session?.user) return;

      setLoading(true);
      try {
        const [productsResult, statsResult] = await Promise.all([
          getUserProducts(),
          getUserStats(),
        ]);

        if (productsResult.success) {
          setProducts(productsResult.data || []);
        } else {
          toast.error(productsResult.error || "Failed to fetch products");
        }

        if (statsResult.success) {
          setUserStats(
            statsResult.data || {
              totalProducts: 0,
              totalViews: 0,
              totalLikes: 0,
              totalSales: 0,
              totalRevenue: 0,
            }
          );
        } else {
          toast.error(statsResult.error || "Failed to fetch stats");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [session]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEditProduct = (productId: string) => {
    setEditProductId(productId);
    setEditOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const result = await deleteProduct(productId);

      if (result.success) {
        toast.success("Product deleted successfully");
        // Refresh the products list
        const productsResult = await getUserProducts();
        if (productsResult.success) {
          setProducts(productsResult.data || []);
        }
      } else {
        toast.error(result.error || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const handlePreviewProduct = (productId: string) => {
    window.open(`/dashboard/products/${productId}`, "_blank");
  };

  const handleViewProduct = (productId: string) => {
    window.location.href = `/dashboard/products/${productId}`;
  };

  // Show loading state
  if (isPending || loading) {
    return (
      <>
        <SiteHeader />
        <div className="min-h-screen bg-background font-sans">
          <div className="max-w-9xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Redirect if not authenticated
  if (!session?.user) {
    window.location.href = "/login";
    return null;
  }

  return (
    <>
      <SiteHeader />
      <div className="min-h-screen bg-background font-sans">
        <div className="max-w-9xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2 font-display">
              Welcome back, {session.user.name}!
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
                  {userStats.totalProducts}
                </div>
                <p className="text-xs text-muted-foreground">
                  Your listed products
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
                  {userStats.totalSales}
                </div>
                <p className="text-xs text-muted-foreground">Products sold</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-display">
                  ${userStats.totalRevenue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Total earnings</p>
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
                  {userStats.totalViews > 1000
                    ? `${Math.round(userStats.totalViews / 1000)}k`
                    : userStats.totalViews}
                </div>
                <p className="text-xs text-muted-foreground">Profile views</p>
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
                <div className="flex gap-2">
                  <Link href="/dashboard/analytics">
                    <Button variant="outline">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Analytics
                    </Button>
                  </Link>
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => setOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
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
                        <NewProductForm
                          onClose={() => {
                            setOpen(false);
                            // Refresh data after creating
                            getUserProducts().then((result) => {
                              if (result.success)
                                setProducts(result.data || []);
                            });
                            getUserStats().then((result) => {
                              if (result.success)
                                setUserStats(
                                  result.data || {
                                    totalProducts: 0,
                                    totalViews: 0,
                                    totalLikes: 0,
                                    totalSales: 0,
                                    totalRevenue: 0,
                                  }
                                );
                            });
                          }}
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
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
                                  {(product.tags || [])
                                    .slice(0, 2)
                                    .map((tag) => (
                                      <Badge
                                        key={tag}
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {tag}
                                      </Badge>
                                    ))}
                                  {(product.tags || []).length > 2 && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      +{(product.tags || []).length - 2}
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
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : ""
                              }
                            >
                              {product.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ${parseFloat(product.price).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right hidden sm:table-cell">
                            {(product.views || 0).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right hidden sm:table-cell">
                            {(product.likes || 0).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right hidden md:table-cell">
                            {product.sales || 0}
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
                                  onClick={() => handleViewProduct(product.id)}
                                >
                                  <TrendingUp className="mr-2 h-4 w-4" />
                                  View Analytics
                                </DropdownMenuItem>
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
                    <Button onClick={() => setOpen(true)}>
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
                  onClose={() => {
                    setEditOpen(false);
                    // Refresh data after editing
                    getUserProducts().then((result) => {
                      if (result.success) setProducts(result.data || []);
                    });
                    getUserStats().then((result) => {
                      if (result.success)
                        setUserStats(
                          result.data || {
                            totalProducts: 0,
                            totalViews: 0,
                            totalLikes: 0,
                            totalSales: 0,
                            totalRevenue: 0,
                          }
                        );
                    });
                  }}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
