"use client";

import {
  Heart,
  ShoppingCart,
  Sparkles,
  Filter,
  TrendingUp,
  Star,
  Users,
  Menu,
  X,
  Loader2,
  ChevronRight,
  Play,
  ArrowRight,
  Zap,
  Shield,
  Award,
  Search,
  SlidersHorizontal,
  ChevronDown,
  Grid3X3,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { useEffect, useState } from "react";
import Header from "@/components/header";
import Link from "next/link";
import { getAllProducts } from "@/lib/actions/products";

// Types
interface Product {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  images: string[] | null;
  price: string;
  game: string | null;
  category: string | null;
  views: number | null;
  likes: number | null;
  sales: number | null;
  tags: string[] | null;
  featured: boolean | null;
  rating: string | null;
  createdAt: Date | string | null;
  updatedAt: Date | string | null;
  userName: string | null;
  userAvatar: string | null;
}

interface GameCategory {
  name: string;
  img: string;
  count: string;
  gradient: string;
}

interface Filters {
  search: string;
  games: string[];
  categories: string[];
  priceRange: [number, number];
  sortBy: string;
}

// Game categories with gradients
const gameCategories: GameCategory[] = [
  {
    name: "Minecraft",
    img: "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?w=500&h=300&fit=crop&q=80",
    count: "3.2k setups",
    gradient: "from-green-500/80 to-blue-500/80",
  },
  {
    name: "Roblox",
    img: "https://images.unsplash.com/photo-1614294149010-950b698f72c0?w=500&h=300&fit=crop&q=80",
    count: "2.8k setups",
    gradient: "from-red-500/80 to-yellow-500/80",
  },
  {
    name: "FiveM",
    img: "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=500&h=300&fit=crop&q=80",
    count: "1.9k setups",
    gradient: "from-purple-500/80 to-pink-500/80",
  },
  {
    name: "Rust",
    img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&h=300&fit=crop&q=80",
    count: "1.5k setups",
    gradient: "from-orange-500/80 to-red-500/80",
  },
  {
    name: "CS2",
    img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&h=300&fit=crop&q=80",
    count: "1.2k setups",
    gradient: "from-blue-500/80 to-purple-500/80",
  },
  {
    name: "Valorant",
    img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&h=300&fit=crop&q=80",
    count: "950 setups",
    gradient: "from-pink-500/80 to-red-500/80",
  },
];

const stats = [
  {
    label: "Active Setups",
    value: "12.5k",
    icon: TrendingUp,
    color: "text-green-500",
  },
  {
    label: "Happy Customers",
    value: "8.2k",
    icon: Users,
    color: "text-blue-500",
  },
  {
    label: "Average Rating",
    value: "4.8",
    icon: Star,
    color: "text-yellow-500",
  },
];

const gameOptions = [
  "Minecraft",
  "Roblox",
  "FiveM",
  "Rust",
  "CS2",
  "Valorant",
  "Fortnite",
  "Apex Legends",
  "League of Legends",
  "World of Warcraft",
];

const categoryOptions = [
  "Server",
  "Plugin",
  "Script",
  "Config",
  "Mod",
  "Pack",
  "Tool",
  "Template",
  "Theme",
  "Addon",
];

const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

function ProductCard({ product }: { product: Product }) {
  const [liked, setLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="group cursor-pointer relative rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10 bg-card border border-border/50">
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
        <img
          src={product.thumbnail || "/placeholder.svg"}
          alt={product.title}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Featured Badge */}
        {product.featured && (
          <Badge className="absolute top-3 left-3 z-10 bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg">
            <Star className="w-3 h-3 mr-1 fill-current" />
            Featured
          </Badge>
        )}

        {/* Price & Actions */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
          <Badge
            variant="secondary"
            className="bg-background/90 text-foreground border-0 backdrop-blur-sm font-bold"
          >
            ${product.price}
          </Badge>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 rounded-full bg-background/90 hover:bg-background text-foreground hover:text-primary transition-all duration-200"
            aria-label={liked ? "Unlike" : "Like"}
            onClick={(e) => {
              e.stopPropagation();
              setLiked(!liked);
            }}
          >
            <Heart
              className={`h-4 w-4 transition-all duration-200 ${
                liked ? "fill-red-500 text-red-500" : ""
              }`}
            />
          </Button>
        </div>

        {/* Quick Actions Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex-1 bg-primary/90 hover:bg-primary text-primary-foreground backdrop-blur-sm"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Buy Now
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-background/90 hover:bg-background border-border/50 backdrop-blur-sm"
            >
              <Play className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {product.tags?.slice(0, 3).map((tag: string) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs px-2 py-0.5 bg-muted/50 text-muted-foreground border-0 hover:bg-muted transition-colors"
            >
              {tag}
            </Badge>
          ))}
          {product.tags && product.tags.length > 3 && (
            <Badge
              variant="secondary"
              className="text-xs px-2 py-0.5 bg-muted/50 text-muted-foreground border-0"
            >
              +{product.tags.length - 3}
            </Badge>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-foreground text-lg line-clamp-2 group-hover:text-primary transition-colors">
          {product.title}
        </h3>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            {product.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{product.rating}</span>
              </div>
            )}
            {product.views && (
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <span>
                  {product.views > 1000
                    ? `${(product.views / 1000).toFixed(1)}k`
                    : product.views}
                </span>
              </div>
            )}
          </div>
          {product.userName && (
            <span className="text-xs">by {product.userName}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterSidebar({
  filters,
  onFiltersChange,
  isOpen,
  onClose,
}: {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const handleGameChange = (game: string, checked: boolean) => {
    const newGames = checked
      ? [...filters.games, game]
      : filters.games.filter((g) => g !== game);
    onFiltersChange({ ...filters, games: newGames });
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter((c) => c !== category);
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handlePriceChange = (value: number[]) => {
    onFiltersChange({ ...filters, priceRange: [value[0], value[1]] });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      games: [],
      categories: [],
      priceRange: [0, 100],
      sortBy: "popular",
    });
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Clear Filters */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Filters</h3>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear All
        </Button>
      </div>

      {/* Games */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm text-foreground">Games</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {gameOptions.map((game) => (
            <div key={game} className="flex items-center space-x-2">
              <Checkbox
                id={`game-${game}`}
                checked={filters.games.includes(game)}
                onCheckedChange={(checked) =>
                  handleGameChange(game, checked as boolean)
                }
              />
              <label
                htmlFor={`game-${game}`}
                className="text-sm text-muted-foreground cursor-pointer"
              >
                {game}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm text-foreground">Categories</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {categoryOptions.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={filters.categories.includes(category)}
                onCheckedChange={(checked) =>
                  handleCategoryChange(category, checked as boolean)
                }
              />
              <label
                htmlFor={`category-${category}`}
                className="text-sm text-muted-foreground cursor-pointer"
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm text-foreground">Price Range</h4>
        <div className="px-2">
          <Slider
            value={filters.priceRange}
            onValueChange={handlePriceChange}
            max={100}
            min={0}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (isOpen !== undefined) {
    // Mobile sheet version
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>
              Filter products by your preferences
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop sidebar version
  return (
    <div className="w-80 bg-card border border-border/50 rounded-2xl p-6 h-fit sticky top-6">
      <FilterContent />
    </div>
  );
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    games: [],
    categories: [],
    priceRange: [0, 100],
    sortBy: "popular",
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const result = await getAllProducts({
        search: filters.search || undefined,
        games: filters.games.length > 0 ? filters.games : undefined,
        categories:
          filters.categories.length > 0 ? filters.categories : undefined,
        priceRange: filters.priceRange,
        sortBy: filters.sortBy,
      });

      if (result.success) {
        setProducts(result.data || []);
      } else {
        console.error("Failed to fetch products:", result.error);
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const handleSearchChange = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  };

  const handleSortChange = (sortBy: string) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  };

  const handleCategoryClick = (categoryName: string) => {
    const newGames = filters.games.includes(categoryName)
      ? filters.games.filter((g) => g !== categoryName)
      : [...filters.games, categoryName];
    setFilters((prev) => ({ ...prev, games: newGames }));
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header */}
      <Header />

      {/* Stats Bar */}
      <div className="bg-muted/30 border-b border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left"
              >
                <div className={`p-3 rounded-full bg-muted ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Cards */}
      <section className="py-12 bg-muted/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2 font-display">
                Browse by Game
              </h2>
              <p className="text-muted-foreground text-lg">
                Find setups for your favorite games
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {gameCategories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => handleCategoryClick(cat.name)}
                className={`relative group rounded-2xl overflow-hidden aspect-[4/3] w-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                  filters.games.includes(cat.name)
                    ? "ring-2 ring-primary ring-offset-2"
                    : ""
                }`}
                tabIndex={0}
                aria-label={cat.name}
              >
                <img
                  src={cat.img || "/placeholder.svg"}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${cat.gradient} group-hover:opacity-90 transition-opacity duration-300`}
                />
                <div className="absolute inset-0 flex flex-col justify-end p-3 z-10">
                  <span className="text-white font-bold text-sm mb-1 drop-shadow-lg">
                    {cat.name}
                  </span>
                  <span className="text-white/90 text-xs drop-shadow">
                    {cat.count}
                  </span>
                </div>
                {filters.games.includes(cat.name) && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                    <Star className="h-3 w-3 fill-current" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Search and Controls */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for setups..."
                  value={filters.search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 pr-4 h-11 text-base"
                />
              </div>

              {/* Sort */}
              <Select value={filters.sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-full lg:w-48 h-11">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-11 px-3"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-11 px-3"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden h-11 gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
            </div>

            {/* Active Filters */}
            {(filters.games.length > 0 || filters.categories.length > 0) && (
              <div className="flex flex-wrap gap-2">
                {filters.games.map((game) => (
                  <Badge
                    key={game}
                    variant="secondary"
                    className="gap-1 cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() =>
                      handleFiltersChange({
                        ...filters,
                        games: filters.games.filter((g) => g !== game),
                      })
                    }
                  >
                    {game}
                    <X className="h-3 w-3" />
                  </Badge>
                ))}
                {filters.categories.map((category) => (
                  <Badge
                    key={category}
                    variant="secondary"
                    className="gap-1 cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() =>
                      handleFiltersChange({
                        ...filters,
                        categories: filters.categories.filter(
                          (c) => c !== category
                        ),
                      })
                    }
                  >
                    {category}
                    <X className="h-3 w-3" />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-8">
            {/* Desktop Filters Sidebar */}
            <div className="hidden lg:block">
              <FilterSidebar
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </div>

            {/* Mobile Filters Sheet */}
            <FilterSidebar
              filters={filters}
              onFiltersChange={handleFiltersChange}
              isOpen={mobileFiltersOpen}
              onClose={() => setMobileFiltersOpen(false)}
            />

            {/* Products Grid */}
            <div className="flex-1">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="text-center">
                    <Loader2 className="animate-spin h-12 w-12 text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Loading amazing setups...
                    </p>
                  </div>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-16">
                  <div className="max-w-md mx-auto">
                    <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      No setups found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your filters or search terms to find what
                      you're looking for.
                    </p>
                    <Button
                      onClick={() =>
                        handleFiltersChange({
                          search: "",
                          games: [],
                          categories: [],
                          priceRange: [0, 100],
                          sortBy: "popular",
                        })
                      }
                    >
                      Clear All Filters
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-muted-foreground">
                      Showing {products.length} setups
                    </p>
                  </div>

                  <div
                    className={`grid gap-6 ${
                      viewMode === "grid"
                        ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                        : "grid-cols-1"
                    }`}
                  >
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/30 mt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-primary to-primary/80 shadow-lg">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-bold text-2xl text-foreground font-display">
                SkriptStore
              </span>
            </div>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
              The ultimate marketplace for gaming setups. Discover, buy, and
              sell the perfect gaming configurations trusted by thousands of
              players worldwide.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-6 text-sm text-muted-foreground">
              <Badge variant="secondary" className="bg-muted/50">
                Built with Next.js
              </Badge>
              <Badge variant="secondary" className="bg-muted/50">
                Tailwind CSS
              </Badge>
              <Badge variant="secondary" className="bg-muted/50">
                shadcn/ui
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
