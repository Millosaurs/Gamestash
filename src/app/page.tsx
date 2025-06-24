"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Loader2,
  Star,
  TrendingUp,
  Users,
  Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import Link from "next/link";
import Image from "next/image";

interface Product {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  price: string;
  tags: string[] | null;
  featured: boolean | null;
  rating: string | null;
  userName: string | null;
  views: number | null;
}

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

const gameCategories = [
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

export default function LandingPage() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Progressive JSON retrieval (if supported by backend)
  useEffect(() => {
    let controller = new AbortController();
    setLoading(true);
    setApiError(null);
    setProducts([]);
    async function fetchLatest() {
      try {
        const res = await fetch("/api/products/latest", {
          signal: controller.signal,
        });
        if (res.body && window.ReadableStream) {
          // Progressive streaming (browser support required)
          const reader = res.body.getReader();
          let received = "";
          let done = false;
          while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            if (value) {
              received += new TextDecoder().decode(value);
              try {
                // Try to parse as soon as possible
                const json = JSON.parse(received);
                setProducts(
                  Array.isArray(json)
                    ? json.filter((p) => p.featured).slice(0, 6)
                    : []
                );
                break;
              } catch (e) {
                // Not yet a full JSON, keep reading
              }
            }
          }
        } else {
          // Fallback: normal fetch
          const data = await res.json();
          setProducts(
            Array.isArray(data)
              ? data.filter((p) => p.featured).slice(0, 6)
              : []
          );
        }
      } catch (e) {
        setApiError("Failed to load products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchLatest();
    return () => controller.abort();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      window.location.href = `/explore?search=${encodeURIComponent(search)}`;
    }
  };

  // --- HERO & STATS ---
  // Calculate stats for hero section (if you want dynamic, fetch and sum like in /explore)
  // For now, use the static stats array for display

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 font-sans flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden flex flex-col items-center justify-center min-h-[60vh] border-b border-border/40 px-4 bg-gradient-to-b from-primary/5 via-background to-muted/20">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10 pointer-events-none" />
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex flex-col items-center w-full max-w-2xl z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
            <Sparkles className="h-4 w-4" />
            Discover Epic Setups
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 font-display text-foreground tracking-tight text-center bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Level Up Your Gaming
            <br />
            Experience
          </h1>
          <p className="text-muted-foreground mb-10 text-lg text-center max-w-xl">
            Discover, buy, and get inspired by premium, hand-picked gaming
            setups from the world's best creators.
          </p>
          <form
            onSubmit={handleSearch}
            className="w-full flex flex-col sm:flex-row items-center gap-3 mb-4"
          >
            <div className="relative flex-1 w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">
                <Search className="h-5 w-5 text-muted-foreground" />
              </span>
              <Input
                type="text"
                placeholder="Search for setups, games, or creators..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 h-12 text-base shadow-md bg-white/80 backdrop-blur border-0"
              />
            </div>
            <Button
              type="submit"
              className="h-12 px-8 font-semibold text-base bg-green-500 hover:bg-green-600 text-white shadow-md"
            >
              Search
            </Button>
          </form>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <Badge variant="secondary" className="bg-muted/50">
              No sign up required
            </Badge>
            <Badge variant="secondary" className="bg-muted/50">
              100% Secure Payments
            </Badge>
            <Badge variant="secondary" className="bg-muted/50">
              Trusted by 8,000+ gamers
            </Badge>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="w-full py-8 bg-background/60 border-b border-border/40 flex flex-col items-center">
        <div className="mx-auto w-full max-w-5xl px-4 flex flex-col items-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full justify-center text-center">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-background/60 backdrop-blur-sm rounded-2xl p-6 border border-border/50 hover:bg-background/80 transition-all duration-300 flex flex-col items-center gap-2 shadow-sm"
              >
                <div
                  className={`p-3 rounded-full ${stat.color} bg-muted/80 mb-2`}
                >
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
      </section>

      {/* Game Category Cards */}
      <section className="py-14 bg-muted/10 flex flex-col items-center">
        <div className="w-full max-w-6xl px-4 flex flex-col items-center">
          <div className="flex flex-col items-center mb-8 gap-2 w-full">
            <h2 className="text-3xl font-bold text-foreground font-display text-center">
              Browse by Game
            </h2>
            <p className="text-muted-foreground text-lg text-center">
              Find setups for your favorite games
            </p>
            <Link
              href="/explore"
              className="text-green-600 font-medium hover:underline mt-2"
            >
              Explore All &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 w-full justify-center">
            {gameCategories.map((cat) => (
              <Link
                key={cat.name}
                href={`/explore?search=${encodeURIComponent(cat.name)}`}
                className={`relative group rounded-2xl overflow-hidden aspect-[4/3] w-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-300 hover:scale-[1.04] hover:shadow-2xl shadow-md bg-white/80 backdrop-blur`}
                tabIndex={0}
                aria-label={cat.name}
              >
                <Image
                  src={cat.img || "/placeholder.svg"}
                  alt={cat.name}
                  width={400}
                  height={300}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 400px"
                  priority={false}
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
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Featured Products */}
      <section className="py-16 flex flex-col items-center">
        <div className="w-full max-w-6xl px-4 flex flex-col items-center">
          <div className="flex flex-col items-center mb-8 w-full">
            <h2 className="text-2xl font-bold font-display text-foreground text-center">
              Latest Featured Setups
            </h2>
            <Link
              href="/explore"
              className="text-green-600 font-medium hover:underline mt-2"
            >
              View All Setups &rarr;
            </Link>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-48 w-full">
              <Loader2 className="animate-spin h-10 w-10 text-primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center text-muted-foreground py-16 w-full">
              No featured setups found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 w-full justify-center">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="group relative rounded-2xl overflow-hidden border border-border/50 bg-card hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 shadow-md"
                >
                  {/* Image */}
                  <div className="relative aspect-[16/10] bg-muted">
                    <Image
                      src={product.thumbnail || "/placeholder.svg"}
                      alt={product.title}
                      width={640}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, 640px"
                      priority={false}
                    />
                    {/* Featured badge */}
                    {product.featured && (
                      <Badge className="absolute top-3 left-3 z-10 bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Featured
                      </Badge>
                    )}
                    {/* Price */}
                    <Badge
                      variant="secondary"
                      className="absolute top-3 right-3 bg-background/90 text-foreground border-0 font-bold"
                    >
                      ${product.price}
                    </Badge>
                  </div>
                  {/* Content */}
                  <div className="p-5 space-y-2">
                    <div className="flex flex-wrap gap-1.5">
                      {product.tags?.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs px-2 py-0.5 bg-muted/50 text-muted-foreground border-0"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <h3 className="font-bold text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                      {product.rating && (
                        <span>
                          <Star className="inline h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                          {product.rating}
                        </span>
                      )}
                      {product.userName && <span>by {product.userName}</span>}
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
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/30 mt-8 flex flex-col items-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <span className="font-bold text-2xl text-foreground font-display">
              Gamestash
            </span>
          </div>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg leading-relaxed text-center">
            The ultimate marketplace for gaming setups. Discover, buy, and sell
            the perfect gaming configurations trusted by thousands of players
            worldwide.
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
          <div className="mt-8 text-xs text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} Gamestash. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
