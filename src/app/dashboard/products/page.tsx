// app/dashboard/products/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Package,
  Filter,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
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
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NewProductForm } from "@/components/product-comp/new-product";
import { EditProductForm } from "@/components/product-comp/edit-product";
import { SiteHeader } from "@/components/sidebar/site-header";
import { getUserProducts, deleteProduct } from "@/lib/actions/products";
import { useSession } from "@/lib/auth-client";
import { Product } from "@/lib/types/product";
import { toast } from "sonner";
import Link from "next/link";

type ViewMode = "table" | "grid";
type SortField = "title" | "price" | "status" | "createdAt" | "views" | "sales";
type SortOrder = "asc" | "desc";

export default function ProductsPage() {
  const { data: session, isPending } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editProductId, setEditProductId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      if (!session?.user) return;

      setLoading(true);
      try {
        const result = await getUserProducts();
        if (result.success) {
          setProducts(result.data || []);
        } else {
          toast.error(result.error || "Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [session]);

  const filteredAndSortedProducts = products
    .filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || product.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      // Handle different data types
      if (sortField === "price") {
        aValue = parseFloat(a.price);
        bValue = parseFloat(b.price);
      } else if (sortField === "createdAt") {
        aValue = new Date(a.createdAt || 0).getTime();
        bValue = new Date(b.createdAt || 0).getTime();
      } else if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
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
        setProducts(products.filter((p) => p.id !== productId));
      } else {
        toast.error(result.error || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const handlePreviewProduct = (productId: string) => {
    window.open(`/product/${productId}`, "_blank");
  };

  const handleViewAnalytics = (productId: string) => {
    window.location.href = `/dashboard/products/${productId}`;
  };

  const refreshProducts = async () => {
    const result = await getUserProducts();
    if (result.success) {
      setProducts(result.data || []);
    }
  };

  // Show loading state
  if (isPending || loading) {
    return (
      <>
        <SiteHeader title="Products" />
        <div className="min-h-screen bg-background font-sans">
          <div className="max-w-9xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="h-96 bg-gray-200 rounded"></div>
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
      <SiteHeader title="Products" />
      <div className="min-h-screen bg-background font-sans">
        <div className="max-w-9xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Link href="/dashboard" className="hover:text-foreground">
                Dashboard
              </Link>
              <span>/</span>
              <span>Products</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground font-display">
                  Your Products
                </h1>
                <p className="text-muted-foreground">
                  Manage and track all your gaming setup listings
                </p>
              </div>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-full max-w-lg sm:max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl max-h-[90vh] p-0 rounded-xl bg-background shadow-lg flex flex-col">
                  <DialogTitle className="px-6 pt-6">
                    Create New Product
                  </DialogTitle>
                  <div className="flex-1 overflow-y-auto p-6">
                    <NewProductForm
                      onClose={() => {
                        setOpen(false);
                        refreshProducts();
                      }}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold font-display">
                  {products.length}
                </div>
                <p className="text-sm text-muted-foreground">Total Products</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold font-display">
                  {products.filter((p) => p.status === "published").length}
                </div>
                <p className="text-sm text-muted-foreground">Published</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold font-display">
                  {products.filter((p) => p.status === "draft").length}
                </div>
                <p className="text-sm text-muted-foreground">Drafts</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold font-display">
                  {products
                    .reduce((sum, p) => sum + (p.views || 0), 0)
                    .toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">Total Views</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Controls */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full lg:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sort */}
                <Select
                  value={`${sortField}-${sortOrder}`}
                  onValueChange={(value) => {
                    const [field, order] = value.split("-") as [
                      SortField,
                      SortOrder
                    ];
                    setSortField(field);
                    setSortOrder(order);
                  }}
                >
                  <SelectTrigger className="w-full lg:w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt-desc">Newest First</SelectItem>
                    <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                    <SelectItem value="title-asc">Title A-Z</SelectItem>
                    <SelectItem value="title-desc">Title Z-A</SelectItem>
                    <SelectItem value="price-desc">Price High-Low</SelectItem>
                    <SelectItem value="price-asc">Price Low-High</SelectItem>
                    <SelectItem value="views-desc">Most Views</SelectItem>
                    <SelectItem value="sales-desc">Most Sales</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode Toggle */}
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "table" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("table")}
                    className="rounded-r-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-l-none"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products Display */}
          {viewMode === "table" ? (
            <Card>
              <CardContent className="py-4">
                <div className="rounded-md border overflow-hidden ">
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
                        {filteredAndSortedProducts.map((product) => (
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
                                  <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleViewAnalytics(product.id)
                                    }
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
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
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleEditProduct(product.id)
                                    }
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
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <img
                      src={product.thumbnail || "/placeholder.svg"}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
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
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                      {product.title}
                    </h3>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {(product.tags || []).slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold">
                        ${parseFloat(product.price).toLocaleString()}
                      </span>
                      <div className="text-sm text-muted-foreground">
                        {(product.views || 0).toLocaleString()} views
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProduct(product.id)}
                        className="flex-1"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewAnalytics(product.id)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Analytics
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handlePreviewProduct(product.id)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredAndSortedProducts.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No products found
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your search terms or filters."
                    : "Get started by creating your first product."}
                </p>
                {!searchQuery && statusFilter === "all" && (
                  <Button onClick={() => setOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Product
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Edit Product Dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="w-full max-w-lg sm:max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl max-h-[90vh] p-0 rounded-xl bg-background shadow-lg flex flex-col">
            <DialogTitle className="px-6 pt-6">Edit Product</DialogTitle>
            <div className="flex-1 overflow-y-auto p-6">
              {editProductId && (
                <EditProductForm
                  productId={editProductId}
                  onClose={() => {
                    setEditOpen(false);
                    refreshProducts();
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
