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

import { Badge } from "@/components/ui/badge";
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
  const [gameFilters, setGameFilters] = useState<
    { id: string; name: string; count?: number }[]
  >([]);
  const [categoryFilters, setCategoryFilters] = useState<
    { id: string; name: string; count?: number }[]
  >([]);
  const [filtersLoading, setFiltersLoading] = useState(true);

  useEffect(() => {
    async function fetchFilters() {
      setFiltersLoading(true);
      try {
        // Fetch games and categories from your API
        const [gamesRes, categoriesRes] = await Promise.all([
          fetch("/api/admin/games"),
          fetch("/api/admin/categories"),
        ]);
        const games = await gamesRes.json();
        const categories = await categoriesRes.json();

        // Optionally, fetch counts for each (if your API supports it)
        // Here we just set count to undefined
        setGameFilters(
          games.map((g: any) => ({
            id: g.value,
            name: g.label,
            count: undefined,
          }))
        );
        setCategoryFilters(
          categories.map((c: any) => ({
            id: c.value,
            name: c.label,
            count: undefined,
          }))
        );
      } catch (e) {
        setGameFilters([]);
        setCategoryFilters([]);
      } finally {
        setFiltersLoading(false);
      }
    }
    fetchFilters();
  }, []);

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
      <section className="py-8 ">
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
                value="" // Always reset after selection
                onValueChange={(v) => {
                  handleGameFilter(v);
                }}
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
                value="" // Always reset after selection
                onValueChange={(v) => {
                  handleCategoryFilter(v);
                }}
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
            <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm rounded-lg p-1 ">
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
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGameFilter(gameId);
                  }}
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
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering card clicks
                    handleCategoryFilter(categoryId);
                  }}
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
                          {game.count !== undefined
                            ? game.count.toLocaleString()
                            : ""}
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
                          {category.count !== undefined
                            ? category.count.toLocaleString()
                            : ""}
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
