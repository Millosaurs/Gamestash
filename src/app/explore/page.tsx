"use client";

import React from "react";

import { useEffect, useState } from "react";
import {
  Sparkles,
  Search,
  Grid3X3,
  List,
  X,
  SlidersHorizontal,
  TrendingUp,
  Heart,
  Eye,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "@/components/header";
import Image from "next/image";
import { createCache } from "@/lib/utils";

// Cache for stats (1 min TTL)
const statsCache = createCache<{
  totalLikes: number;
  totalViews: number;
  totalProducts: number;
}>(60000);

// Mock data for filters and products
const gameFilters = [
  { id: "minecraft", name: "Minecraft", count: 3200 },
  { id: "roblox", name: "Roblox", count: 2800 },
  { id: "fivem", name: "FiveM", count: 1900 },
  { id: "rust", name: "Rust", count: 1500 },
];

const categoryFilters = [
  { id: "rgb", name: "RGB", count: 4200 },
  { id: "minimal", name: "Minimal", count: 2800 },
  { id: "professional", name: "Professional", count: 1900 },
  { id: "budget", name: "Budget", count: 3500 },
  { id: "premium", name: "Premium", count: 1600 },
  { id: "streaming", name: "Streaming", count: 2200 },
];

const mockProducts = [
  {
    id: 1,
    title: "Ultimate Minecraft RGB Battlestation",
    imageUrl:
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=600&h=400&fit=crop&q=80",
    username: "NeonGamer",
    userAvatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=face",
    likes: 1247,
    views: 12450,
    tags: ["Minecraft", "RGB"],
    price: 1299,
    originalPrice: 1499,
    uploadedAt: "2 hours ago",
    rating: 4.8,
    featured: true,
    description:
      "A vibrant RGB setup designed for ultimate Minecraft gaming with high-end peripherals and immersive lighting.",
  },
  {
    id: 2,
    title: "Roblox Creator Studio Setup",
    imageUrl:
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=400&fit=crop&q=80",
    username: "CleanDesk",
    userAvatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face",
    likes: 892,
    views: 7430,
    tags: ["Roblox", "Minimal"],
    price: 999,
    uploadedAt: "5 hours ago",
    rating: 4.6,
    featured: false,
    description:
      "A clean and minimal desk setup optimized for Roblox game development and creator workflows.",
  },
  {
    id: 3,
    title: "Minecraft Modded Gaming Station",
    imageUrl:
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop&q=80",
    username: "CozyStreamer",
    userAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
    likes: 567,
    views: 5210,
    tags: ["Minecraft", "Cozy"],
    price: 799,
    uploadedAt: "1 day ago",
    rating: 4.4,
    featured: false,
    description:
      "A cozy gaming station tailored for modded Minecraft adventures with comfortable seating and ambient lighting.",
  },
  {
    id: 4,
    title: "Rust Survival Gaming Setup with Dual Monitors",
    imageUrl:
      "https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=600&h=400&fit=crop&q=80",
    username: "CreatorPro",
    userAvatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
    likes: 2034,
    views: 18470,
    tags: ["Rust", "Professional"],
    price: 1499,
    uploadedAt: "3 hours ago",
    rating: 4.9,
    featured: true,
    description:
      "Professional-grade Rust gaming setup featuring dual monitors for enhanced visibility and productivity.",
  },
  {
    id: 5,
    title: "Roblox Kid's RGB Gaming Setup",
    imageUrl:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop&q=80",
    username: "RetroKing",
    userAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face",
    likes: 1560,
    views: 9820,
    tags: ["Roblox", "Budget"],
    price: 499,
    uploadedAt: "6 hours ago",
    rating: 4.2,
    featured: false,
    description:
      "An affordable RGB gaming setup perfect for kids who love playing Roblox with style and comfort.",
  },
  {
    id: 6,
    title: "FiveM Roleplay Command Center",
    imageUrl:
      "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=600&h=400&fit=crop&q=80",
    username: "TechMaster",
    userAvatar:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=32&h=32&fit=crop&crop=face",
    likes: 3240,
    views: 26530,
    tags: ["FiveM", "High-end"],
    price: 1799,
    uploadedAt: "4 hours ago",
    rating: 4.7,
    featured: true,
    description:
      "High-end command center built for FiveM roleplay enthusiasts with premium gear and immersive experience.",
  },
  {
    id: 7,
    title: "Minimalist Rust Gaming Setup",
    imageUrl:
      "https://images.unsplash.com/photo-1541746972996-4e0b0f93e586?w=600&h=400&fit=crop&q=80",
    username: "WhiteSpace",
    userAvatar:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=32&h=32&fit=crop&crop=face",
    likes: 1890,
    views: 15200,
    tags: ["Rust", "Minimal"],
    price: 1199,
    uploadedAt: "1 day ago",
    rating: 4.5,
    featured: false,
    description:
      "A clean and minimalist gaming setup ideal for Rust players who prefer simplicity and performance.",
  },
  {
    id: 8,
    title: "Budget FiveM Racing Setup",
    imageUrl:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop&q=80",
    username: "BudgetGamer",
    userAvatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face",
    likes: 2340,
    views: 28900,
    tags: ["FiveM", "Budget"],
    price: 399,
    uploadedAt: "2 days ago",
    rating: 4.3,
    featured: false,
    description:
      "A budget-friendly racing setup built for FiveM players looking for performance without breaking the bank.",
  },
];

import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product-card";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("popular");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();

        if (searchQuery) params.set("search", searchQuery);
        if (selectedGames.length > 0)
          params.set("games", selectedGames.join(","));
        if (selectedCategories.length > 0)
          params.set("categories", selectedCategories.join(","));
        if (priceRange[0] > 0 || priceRange[1] < 10000) {
          params.set("priceRange", JSON.stringify(priceRange));
        }
        params.set("sortBy", sortBy);

        const response = await fetch(`/api/products?${params.toString()}`);
        const data = await response.json();

        if (response.ok) {
          setProducts(data);
        } else {
          console.error("Failed to fetch products:", data.error);
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [searchQuery, selectedGames, selectedCategories, priceRange, sortBy]);

  const handleGameFilter = (gameId: string) => {
    setSelectedGames((prev) =>
      prev.includes(gameId)
        ? prev.filter((id) => id !== gameId)
        : [...prev, gameId]
    );
  };

  const handleCategoryFilter = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const clearAllFilters = () => {
    setSelectedGames([]);
    setSelectedCategories([]);
    setPriceRange([0, 10000]);
    setSearchQuery("");
  };

  const handleCardClick = (productId: string) => {
    window.location.href = `/product/${productId}`;
  };

  // Filter and sort products
  const filteredProducts = products.filter((product) => {
    // Search filter
    if (
      searchQuery &&
      !product.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Price filter
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }

    // Game filter
    if (selectedGames.length > 0) {
      const hasMatchingGame = product.tags.some((tag: string) =>
        selectedGames.some((gameId) => {
          const game = gameFilters.find((g) => g.id === gameId);
          return game && tag.toLowerCase().includes(game.name.toLowerCase());
        })
      );
      if (!hasMatchingGame) return false;
    }

    // Category filter
    if (selectedCategories.length > 0) {
      const hasMatchingCategory = product.tags.some((tag: string) =>
        selectedCategories.some((categoryId) => {
          const category = categoryFilters.find((c) => c.id === categoryId);
          return (
            category && tag.toLowerCase().includes(category.name.toLowerCase())
          );
        })
      );
      if (!hasMatchingCategory) return false;
    }

    return true;
  });

  // Sort products
  const sortedAndFilteredProducts = [...filteredProducts].sort((a, b) => {
    // Always show featured first
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;

    // Then apply secondary sorting
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        );
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "popular":
      default:
        return b.likes - a.likes;
    }
  });

  const activeFiltersCount =
    selectedGames.length +
    selectedCategories.length +
    (priceRange[0] > 0 || priceRange[1] < 10000 ? 1 : 0) +
    (searchQuery ? 1 : 0);

  const ProductsGrid = () => {
    if (loading) {
      return (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} viewMode={viewMode} />
          ))}
        </div>
      );
    }

    if (sortedAndFilteredProducts.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">No products found</div>
          <p className="text-sm text-muted-foreground">
            Try adjusting your filters or search terms
          </p>
        </div>
      );
    }

    return (
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
            : "space-y-4"
        }
      >
        {sortedAndFilteredProducts.map((product) => (
          <React.Fragment key={product.id}>
            <div
              className={
                viewMode === "grid"
                  ? "bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-200 cursor-pointer flex flex-col"
                  : "bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-200 cursor-pointer flex flex-row gap-4"
              }
              onClick={() => handleCardClick(product.id)}
            >
              <div
                className={
                  viewMode === "grid"
                    ? "relative aspect-[16/10] w-full"
                    : "relative w-40 h-28 flex-shrink-0"
                }
              >
                {/* Featured badge */}
                {product.featured && (
                  <Badge className="absolute top-3 left-3 z-10 bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
                <Image
                  src={
                    product.imageUrl || product.thumbnail || "/placeholder.svg"
                  }
                  alt={product.title}
                  fill={viewMode === "grid"}
                  width={viewMode === "list" ? 160 : undefined}
                  height={viewMode === "list" ? 112 : undefined}
                  className="object-cover w-full h-full"
                  sizes={
                    viewMode === "grid"
                      ? "(max-width: 768px) 100vw, 400px"
                      : "160px"
                  }
                  priority={false}
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-1">
                    {(product.tags?.slice(0, 3) || []).map((tag: string) => (
                      <span
                        key={tag}
                        className="inline-block bg-muted/50 text-xs px-2 py-0.5 rounded-full text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-bold text-lg text-foreground line-clamp-2">
                    {product.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                  <span className="font-bold text-primary text-base">
                    ${product.price}
                  </span>
                  {product.rating && (
                    <span>
                      <Sparkles className="inline h-3 w-3 text-yellow-400 mr-1" />
                      {product.rating}
                    </span>
                  )}
                  {product.username && <span>by {product.username}</span>}
                  {product.views && (
                    <span>
                      {product.views > 1000
                        ? `${(product.views / 1000).toFixed(1)}k`
                        : product.views}{" "}
                      views
                    </span>
                  )}
                </div>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    );
  };

  // --- HERO & STATS ---
  // Calculate stats for hero section with cache
  const cacheKey = JSON.stringify(sortedAndFilteredProducts.map((p) => p.id));
  let cachedStats = statsCache.get(cacheKey);
  let totalLikes, totalViews, totalProducts;
  if (cachedStats) {
    ({ totalLikes, totalViews, totalProducts } = cachedStats);
  } else {
    totalLikes = sortedAndFilteredProducts.reduce(
      (sum, p) => sum + (p.likes || 0),
      0
    );
    totalViews = sortedAndFilteredProducts.reduce(
      (sum, p) => sum + (p.views || 0),
      0
    );
    totalProducts = sortedAndFilteredProducts.length;
    statsCache.set(cacheKey, { totalLikes, totalViews, totalProducts });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 font-sans">
      {/* Header */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Header />
      </div>

      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5"></div>
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
            <Sparkles className="h-4 w-4" />
            Discover Epic projects
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 font-display bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Explore Gaming projects
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Find, filter, and get inspired by the best gaming projects from our
            creative community. Use the filters to discover your perfect match.
          </p>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div className="bg-background/60 backdrop-blur-sm rounded-2xl p-4 border border-border/50 hover:bg-background/80 transition-all duration-300">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Grid3X3 className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold text-foreground">
                  {totalProducts}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">projects</div>
            </div>
            <div className="bg-background/60 backdrop-blur-sm rounded-2xl p-4 border border-border/50 hover:bg-background/80 transition-all duration-300">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Heart className="h-5 w-5 text-red-400" />
                <span className="text-2xl font-bold text-foreground">
                  {totalLikes.toLocaleString()}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">Total Likes</div>
            </div>
            <div className="bg-background/60 backdrop-blur-sm rounded-2xl p-4 border border-border/50 hover:bg-background/80 transition-all duration-300">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Eye className="h-5 w-5 text-blue-400" />
                <span className="text-2xl font-bold text-foreground">
                  {totalViews > 1000
                    ? `${(totalViews / 1000).toFixed(1)}k`
                    : totalViews}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">Total Views</div>
            </div>
            <div className="bg-background/60 backdrop-blur-sm rounded-2xl p-4 border border-border/50 hover:bg-background/80 transition-all duration-300">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Award className="h-5 w-5 text-yellow-400" />
                <span className="text-2xl font-bold text-foreground">
                  {products.filter((p) => p.featured).length}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">Featured</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Bar */}
      <section className="py-8 border-b border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/50 border-border/50 focus:bg-background"
                />
              </div>
              {/* Price Range */}
              <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm rounded-lg px-3 py-2 border border-border/50">
                <span className="text-sm text-muted-foreground">Price:</span>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={10000}
                  min={0}
                  step={50}
                  className="w-32"
                />
                <span className="text-xs text-muted-foreground">
                  ${priceRange[0]} - ${priceRange[1]}
                </span>
              </div>
              {/* Games Filter */}
              <Select
                value={selectedGames[0] || ""}
                onValueChange={(v) => handleGameFilter(v)}
              >
                <SelectTrigger className="w-40 bg-background/50 backdrop-blur-sm border-border/50">
                  <Grid3X3 className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Games" />
                </SelectTrigger>
                <SelectContent>
                  {gameFilters.map((game) => (
                    <SelectItem key={game.id} value={game.id}>
                      {game.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Categories Filter */}
              <Select
                value={selectedCategories[0] || ""}
                onValueChange={(v) => handleCategoryFilter(v)}
              >
                <SelectTrigger className="w-40 bg-background/50 backdrop-blur-sm border-border/50">
                  <List className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categoryFilters.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 bg-background/50 backdrop-blur-sm border-border/50">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm rounded-lg p-1 border border-border/50">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-8 w-8 p-0"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {/* Results count */}
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {sortedAndFilteredProducts.length} of {products.length}{" "}
            projects
          </div>
        </div>
      </section>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-6 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {selectedGames.map((gameId) => {
            const game = gameFilters.find((g) => g.id === gameId);
            return (
              <Badge key={gameId} variant="secondary" className="gap-1">
                {game?.name}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleGameFilter(gameId)}
                />
              </Badge>
            );
          })}
          {selectedCategories.map((categoryId) => {
            const category = categoryFilters.find((c) => c.id === categoryId);
            return (
              <Badge key={categoryId} variant="secondary" className="gap-1">
                {category?.name}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleCategoryFilter(categoryId)}
                />
              </Badge>
            );
          })}
          {(priceRange[0] > 0 || priceRange[1] < 10000) && (
            <Badge variant="secondary" className="gap-1">
              ${priceRange[0]} - ${priceRange[1]}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setPriceRange([0, 10000])}
              />
            </Badge>
          )}
        </div>
      )}

      {/* Products Grid Section */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Products Grid */}
          <ProductsGrid />
          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="px-8">
              Load More Results
            </Button>
          </div>
        </div>
      </section>

      {/* Mobile Filters Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="fixed right-0 top-0 h-full w-80 bg-background border-l border-border overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold font-display">Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMobileFilters(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Mobile filter content - same as desktop sidebar */}
              <div className="space-y-6">
                {/* Search */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3 font-display">
                    Search
                  </h4>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search projects..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3 font-display">
                    Price Range
                  </h4>
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={10000}
                      min={0}
                      step={50}
                      className="mb-4"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Games Filter */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3 font-display">
                    Games
                  </h4>
                  <div className="space-y-2">
                    {gameFilters.map((game) => (
                      <div
                        key={game.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`mobile-${game.id}`}
                          checked={selectedGames.includes(game.id)}
                          onCheckedChange={() => handleGameFilter(game.id)}
                        />
                        <label
                          htmlFor={`mobile-${game.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                        >
                          {game.name}
                        </label>
                        <span className="text-xs text-muted-foreground">
                          {game.count.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Categories Filter */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3 font-display">
                    Categories
                  </h4>
                  <div className="space-y-2">
                    {categoryFilters.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`mobile-${category.id}`}
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={() =>
                            handleCategoryFilter(category.id)
                          }
                        />
                        <label
                          htmlFor={`mobile-${category.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                        >
                          {category.name}
                        </label>
                        <span className="text-xs text-muted-foreground">
                          {category.count.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {activeFiltersCount > 0 && (
                  <Button
                    variant="outline"
                    onClick={clearAllFilters}
                    className="w-full"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Clear All Filters ({activeFiltersCount})
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
