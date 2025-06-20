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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import Header from "@/components/header";
import Link from "next/link";

// Game categories with better image URLs
const gameCategories = [
  {
    name: "Minecraft",
    img: "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?w=500&h=300&fit=crop&q=80",
    count: "3.2k setups",
  },
  {
    name: "Roblox",
    img: "https://images.unsplash.com/photo-1614294149010-950b698f72c0?w=500&h=300&fit=crop&q=80",
    count: "2.8k setups",
  },
  {
    name: "FiveM",
    img: "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=500&h=300&fit=crop&q=80",
    count: "1.9k setups",
  },
  {
    name: "Rust",
    img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&h=300&fit=crop&q=80",
    count: "1.5k setups",
  },
];

// Mock setups with better images - sorted with featured first

const stats = [
  { label: "Active Setups", value: "12.5k", icon: TrendingUp },
  { label: "Happy Customers", value: "8.2k", icon: Users },
  { label: "Average Rating", value: "4.8", icon: Star },
];

function ProductCard({ product }: { product: any }) {
  const [liked, setLiked] = useState(false);

  return (
    <div
      className="group cursor-pointer relative aspect-[16/9] rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col justify-end"
      tabIndex={0}
    >
      {/* Background Image */}
      <img
        src={product.imageUrl || "/placeholder.svg"}
        alt={product.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition-opacity duration-300" />

      {/* Featured Badge */}
      {product.featured && (
        <Badge className="absolute top-3 left-3 z-10 bg-primary text-primary-foreground border-0">
          <Star className="w-3 h-3 mr-1" />
          Featured
        </Badge>
      )}

      {/* Price & Heart Row */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
        <Badge
          variant="secondary"
          className="bg-black/50 text-white border-0 backdrop-blur-sm"
        >
          ${product.price}
        </Badge>
        <button
          className="p-2 rounded-full text-white hover:text-primary transition-colors"
          aria-label={liked ? "Unlike" : "Like"}
          onClick={(e) => {
            e.stopPropagation();
            setLiked((l) => !l);
          }}
          tabIndex={0}
          type="button"
          style={{ background: "none", border: "none" }}
        >
          {liked ? (
            <Heart className="h-6 w-6 fill-primary text-primary" />
          ) : (
            <Heart className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Content Overlay (always at bottom) */}
      <div className="relative z-10 p-4 mt-auto">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {product.tags.map((tag: string) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs px-2 py-0.5 bg-white/20 text-white border-0 backdrop-blur-sm"
            >
              {tag}
            </Badge>
          ))}
        </div>
        <h3 className="font-bold text-white text-lg mb-0 line-clamp-2 drop-shadow-lg">
          {product.title}
        </h3>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [latestProducts, setLatestProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products/latest")
      .then((res) => res.json())
      .then(setLatestProducts)
      .catch(() => setLatestProducts([]))
      .finally(() => setLoading(false)); // 2. Set loading to false after fetch
  }, []);
  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header */}
      <Header />

      {/* Stats Bar */}
      <div className="bg-muted/30 border-b border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center gap-4 sm:gap-8 text-sm">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-muted-foreground"
              >
                <stat.icon className="h-4 w-4" />
                <span className="font-medium text-foreground">
                  {stat.value}
                </span>
                <span className="hidden sm:inline">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Cards */}
      <section className="py-8 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1 font-display">
                Browse by Game
              </h2>
              <p className="text-muted-foreground">
                Find setups for your favorite games
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary/80 self-start sm:self-auto"
            >
              View all →
            </Button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {gameCategories.map((cat) => (
              <button
                key={cat.name}
                className="relative group rounded-2xl overflow-hidden aspect-[4/3] w-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all hover:scale-105"
                tabIndex={0}
                aria-label={cat.name}
              >
                <img
                  src={cat.img || "/placeholder.svg"}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition-colors duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                  <span className="block text-white font-bold text-sm mb-1 drop-shadow-lg">
                    {cat.name}
                  </span>
                  <span className="block text-white/80 text-xs drop-shadow">
                    {cat.count}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured & Latest Setups */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1 font-display">
                Featured Setups
              </h2>
              <p className="text-muted-foreground">
                Handpicked by our community
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:text-primary/80"
              >
                View all →
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin h-10 w-10 text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/explore">
              <Button
                variant="outline"
                size="lg"
                className="px-8 h-12 text-base"
              >
                Explore more!
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/20 mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center flex flex-col items-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-foreground font-display">
                SkriptStore
              </span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md text-center">
              The ultimate marketplace for gaming setups. Discover, buy, and
              sell the perfect gaming battlestation.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-muted-foreground">
              <span>Built with Next.js</span>
              <span>•</span>
              <span>Tailwind CSS</span>
              <span>•</span>
              <span>shadcn/ui</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
