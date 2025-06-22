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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import Header from "@/components/header";
import Link from "next/link";

// Types
interface Product {
  id: string;
  title: string;
  price: number;
  imageUrl?: string;
  tags: string[];
  featured?: boolean;
  rating?: number;
  downloads?: number;
  author?: string;
}

interface GameCategory {
  name: string;
  img: string;
  count: string;
  gradient: string;
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

const features = [
  {
    icon: Zap,
    title: "Instant Download",
    description: "Get your setups instantly after purchase",
  },
  {
    icon: Shield,
    title: "Quality Guaranteed",
    description: "All setups are tested and verified",
  },
  {
    icon: Award,
    title: "Community Reviewed",
    description: "Rated by thousands of users",
  },
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
          src={product.imageUrl || "/placeholder.svg"}
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
          {product.tags.slice(0, 3).map((tag: string) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs px-2 py-0.5 bg-muted/50 text-muted-foreground border-0 hover:bg-muted transition-colors"
            >
              {tag}
            </Badge>
          ))}
          {product.tags.length > 3 && (
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
            {product.downloads && (
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <span>
                  {product.downloads > 1000
                    ? `${(product.downloads / 1000).toFixed(1)}k`
                    : product.downloads}
                </span>
              </div>
            )}
          </div>
          {product.author && (
            <span className="text-xs">by {product.author}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section className="relative py-16 sm:py-24 bg-gradient-to-br from-background via-background to-muted/30 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
            <Sparkles className="w-3 h-3 mr-1" />
            New setups added daily
          </Badge>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 font-display">
            The Ultimate
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {" "}
              Gaming{" "}
            </span>
            Marketplace
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover premium gaming setups, scripts, and configurations. Join
            thousands of gamers who trust SkriptStore for their gaming needs.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for setups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 h-12 text-base rounded-full border-2 border-border/50 focus:border-primary transition-colors"
            />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="px-8 h-12 text-base rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Explore Setups
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 h-12 text-base rounded-full border-2 hover:bg-accent transition-all duration-300"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    // Simulate API call with better mock data
    const mockProducts: Product[] = [
      {
        id: "1",
        title: "Ultimate Minecraft Server Setup",
        price: 29.99,
        imageUrl:
          "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?w=500&h=300&fit=crop&q=80",
        tags: ["Minecraft", "Server", "Plugin"],
        featured: true,
        rating: 4.8,
        downloads: 1250,
        author: "CraftMaster",
      },
      {
        id: "2",
        title: "Roblox Studio Advanced Scripts",
        price: 19.99,
        imageUrl:
          "https://images.unsplash.com/photo-1614294149010-950b698f72c0?w=500&h=300&fit=crop&q=80",
        tags: ["Roblox", "Script", "Studio"],
        rating: 4.6,
        downloads: 890,
        author: "RobloxPro",
      },
      {
        id: "3",
        title: "FiveM Racing Server Pack",
        price: 39.99,
        imageUrl:
          "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=500&h=300&fit=crop&q=80",
        tags: ["FiveM", "Racing", "Server"],
        rating: 4.9,
        downloads: 2100,
        author: "SpeedDemon",
      },
    ];

    setTimeout(() => {
      setLatestProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Stats Bar */}
      <div className="bg-muted/30 border-y border-border/40">
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

      {/* Features Section */}
      <section className="py-12 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center group hover:bg-background rounded-2xl p-6 transition-all duration-300 hover:shadow-lg border border-transparent hover:border-border/50"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Cards */}
      <section className="py-12 bg-background">
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
            <Button
              variant="ghost"
              size="lg"
              className="text-primary hover:text-primary/80 self-start sm:self-auto group"
            >
              View all
              <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {gameCategories.map((cat) => (
              <button
                key={cat.name}
                className="relative group rounded-2xl overflow-hidden aspect-[4/3] w-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-300 hover:scale-105 hover:shadow-xl"
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
                <div className="absolute inset-0 flex flex-col justify-end p-4 z-10">
                  <span className="text-white font-bold text-lg mb-1 drop-shadow-lg">
                    {cat.name}
                  </span>
                  <span className="text-white/90 text-sm drop-shadow">
                    {cat.count}
                  </span>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ChevronRight className="h-5 w-5 text-white" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured & Latest Setups */}
      <section className="py-16 bg-muted/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2 font-display">
                Featured Setups
              </h2>
              <p className="text-muted-foreground text-lg">
                Handpicked by our community
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex gap-2">
                {["all", "featured", "latest"].map((filter) => (
                  <Button
                    key={filter}
                    variant={activeFilter === filter ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveFilter(filter)}
                    className="capitalize"
                  >
                    {filter}
                  </Button>
                ))}
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <Loader2 className="animate-spin h-12 w-12 text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Loading amazing setups...
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {latestProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <div className="text-center mt-12">
                <Link href="/explore">
                  <Button
                    size="lg"
                    className="px-8 h-12 text-base rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    Explore All Setups
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/30 mt-0">
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
