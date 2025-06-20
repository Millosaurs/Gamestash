"use client";

import type React from "react";
import { useState } from "react";
import {
  Heart,
  Sparkles,
  Star,
  Eye,
  MapPin,
  Calendar,
  ExternalLink,
  ShoppingCart,
  Grid3X3,
  List,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/header";
export type SocialLinks = {
  twitter?: string;
  instagram?: string;
  website?: string;
  youtube?: string;
  twitch?: string;
};

export type Product = {
  id: number;
  title: string;
  imageUrl: string;
  price: number;
  originalPrice?: number;
  likes: number;
  views: number;
  tags: string[];
  rating: number;
  featured: boolean;
  uploadedAt: string;
};

export type Developer = {
  id: number;
  username: string;
  displayName: string;
  avatar: string;
  coverImage: string;
  bio: string;
  location: string;
  joinedDate: string;
  totalProducts: number;
  totalLikes: number;
  totalViews: number;
  totalSales: number;
  rating: number;
  specialties: string[];
  verified: boolean;
  featured: boolean;
  socialLinks: SocialLinks;
  products: Product[];
};
// Mock developer data (in a real app, this would come from an API)
const getDeveloperById = (id: string) => {
  const developers: Record<string, Developer> = {
    "1": {
      id: 1,
      username: "NeonGamer",
      displayName: "Alex Chen",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
      coverImage:
        "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=1200&h=400&fit=crop&q=80",
      bio: "Professional gaming setup designer with 5+ years of experience. Specializing in RGB and high-performance builds that deliver both aesthetics and performance. I believe every gamer deserves a setup that inspires them to achieve greatness.",
      location: "San Francisco, CA",
      joinedDate: "2019-03-15",
      totalProducts: 12,
      totalLikes: 15420,
      totalViews: 125000,
      totalSales: 89,
      rating: 4.8,
      specialties: ["RGB", "Gaming", "High-end", "Custom Builds"],
      verified: true,
      featured: true,
      socialLinks: {
        twitter: "https://twitter.com/neongamer",
        instagram: "https://instagram.com/neongamer",
        website: "https://neongamer.dev",
      },
      products: [
        {
          id: 1,
          title: "Ultimate Minecraft RGB Battlestation",
          imageUrl:
            "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=600&h=400&fit=crop&q=80",
          price: 1299,
          originalPrice: 1499,
          likes: 1247,
          views: 12450,
          tags: ["Minecraft", "RGB"],
          rating: 4.8,
          featured: true,
          uploadedAt: "2 hours ago",
        },
        {
          id: 9,
          title: "Rust Survival Gaming Setup",
          imageUrl:
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop&q=80",
          price: 1599,
          originalPrice: 1799,
          likes: 892,
          views: 8920,
          tags: ["Rust", "RGB", "Futuristic"],
          rating: 4.6,
          featured: false,
          uploadedAt: "1 day ago",
        },
        {
          id: 10,
          title: "FiveM Streaming Command Center",
          imageUrl:
            "https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=600&h=400&fit=crop&q=80",
          price: 1899,
          originalPrice: 2199,
          likes: 1456,
          views: 15600,
          tags: ["Streaming", "FiveM", "Professional"],
          rating: 4.9,
          featured: true,
          uploadedAt: "3 days ago",
        },
        {
          id: 11,
          title: "Roblox Neon Gaming Paradise",
          imageUrl:
            "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop&q=80",
          price: 1199,
          originalPrice: 1399,
          likes: 743,
          views: 6890,
          tags: ["Neon", "Roblox", "Gaming"],
          rating: 4.5,
          featured: false,
          uploadedAt: "5 days ago",
        },
      ],
    },
    "2": {
      id: 2,
      username: "CleanDesk",
      displayName: "Sarah Johnson",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      coverImage:
        "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=1200&h=400&fit=crop&q=80",
      bio: "Minimalist design enthusiast creating clean, productive workspaces that inspire creativity and focus. Less is more - every element serves a purpose.",
      location: "Austin, TX",
      joinedDate: "2020-01-20",
      totalProducts: 8,
      totalLikes: 9200,
      totalViews: 78000,
      totalSales: 45,
      rating: 4.6,
      specialties: ["Minimal", "Clean", "Productivity", "Workspace"],
      verified: true,
      featured: false,
      socialLinks: {
        instagram: "https://instagram.com/cleandesk",
        website: "https://cleandesk.co",
      },
      products: [
        {
          id: 2,
          title: "Roblox Creator Studio Setup",
          imageUrl:
            "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=400&fit=crop&q=80",
          price: 999,
          originalPrice: 1199,
          likes: 892,
          views: 7430,
          tags: ["Roblox", "Minimal"],
          rating: 4.6,
          featured: false,
          uploadedAt: "5 hours ago",
        },
      ],
    },
  };
  return developers[id as keyof typeof developers] || null;
};

export function ProductCard({
  product,
  viewMode,
  onCardClick,
}: {
  product: Product;
  viewMode: "grid" | "list";
  onCardClick: (id: number) => void;
}) {
  const [liked, setLiked] = useState(false);

  const cardBase =
    "transition-all duration-200 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md border border-border/30 shadow-lg hover:shadow-2xl hover:-translate-y-1 focus:ring-2 focus:ring-primary outline-none";
  const featuredBadge =
    "absolute top-3 left-3 bg-gradient-to-r from-green-500 to-emerald-400 text-white border-0 text-xs px-2 py-1 rounded shadow";
  // For accessibility, allow keyboard "Enter" to open card
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onCardClick(product.id);
  };

  if (viewMode === "grid") {
    return (
      <div
        tabIndex={0}
        onClick={() => onCardClick(product.id)}
        onKeyDown={handleKeyDown}
        className={`group cursor-pointer relative aspect-[16/9] rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-200 flex flex-col justify-end focus:ring-2 focus:ring-primary ${cardBase}`}
        aria-label={product.title}
      >
        {/* Background Image */}
        <img
          src={product.imageUrl || "/placeholder.svg"}
          alt={product.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition-colors duration-300" />

        {/* Featured Badge */}
        {product.featured && (
          <Badge className={featuredBadge}>
            <Star className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        )}

        {/* Price & Heart Row */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
          <Badge
            variant="secondary"
            className="bg-black/50 text-white border-0 backdrop-blur-sm shadow"
          >
            ${product.price}
          </Badge>
          <button
            className="p-2 rounded-full text-white hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label={liked ? "Unlike" : "Like"}
            onClick={(e) => {
              e.stopPropagation();
              setLiked((l) => !l);
            }}
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
            {product.tags.map((tag) => (
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

  // List view
  return (
    <div
      tabIndex={0}
      onClick={() => onCardClick(product.id)}
      onKeyDown={handleKeyDown}
      className={`cursor-pointer flex gap-4 p-4 rounded-2xl border border-border/50 hover:border-border hover:shadow-lg transition-all duration-200 focus:ring-2 focus:ring-primary ${cardBase}`}
      aria-label={product.title}
    >
      <div className="relative w-48 aspect-[16/9] rounded-xl overflow-hidden flex-shrink-0">
        <img
          src={product.imageUrl || "/placeholder.svg"}
          alt={product.title}
          className="w-full h-full object-cover"
        />
        {/* Heart icon in image corner */}
        <div className="absolute top-2 right-2 z-10">
          <button
            className="p-2 rounded-full text-white hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label={liked ? "Unlike" : "Like"}
            onClick={(e) => {
              e.stopPropagation();
              setLiked((l) => !l);
            }}
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
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-lg text-foreground line-clamp-2 hover:text-primary transition-colors">
              {product.title}
            </h3>
            {/* Featured badge next to title */}
            {product.featured && (
              <Badge className="bg-primary text-primary-foreground border-0 ml-2">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>
          {/* Price below title */}
          <div className="font-bold text-xl text-primary mb-2">
            ${product.price}
          </div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {product.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            <span>{product.likes.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{product.views.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-current text-yellow-400" />
            <span>{product.rating}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DeveloperDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const developer = getDeveloperById(params.id);

  if (!developer) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-sans">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2 font-display">
            Developer Not Found
          </h1>
          <p className="text-muted-foreground mb-4">
            The developer you're looking for doesn't exist.
          </p>
          <Button onClick={() => (window.location.href = "/developers")}>
            Back to Developers
          </Button>
        </div>
      </div>
    );
  }

  const handleProductClick = (productId: number) => {
    window.location.href = `/setup/${productId}`;
  };

  const handleHeartClick = (e: React.MouseEvent, productId: number) => {
    e.stopPropagation();
    // Implement like logic here
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header */}
      <Header />

      {/* Breadcrumbs */}
      <div className="border-b border-border/40 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="hover:text-foreground cursor-pointer">Home</span>
            <span className="mx-2">/</span>
            <a
              href="/developers"
              className="hover:text-foreground cursor-pointer"
            >
              Developers
            </a>
            <span className="mx-2">/</span>
            <span className="text-foreground font-medium">
              {developer.displayName}
            </span>
          </div>
        </div>
      </div>

      {/* Banner with fade and overlay card */}
      <div className="relative h-64 md:h-80 w-full">
        <img
          src={developer.coverImage || "/placeholder.svg"}
          alt={`${developer.displayName} cover`}
          className="w-full h-full object-cover"
        />
        {/* Fade at bottom */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(24,24,27,0.95) 100%)",
          }}
        />
        {/* Overlay card */}
        <div className="absolute left-1/2 bottom-0 w-full max-w-3xl px-4 -translate-x-1/2 translate-y-1/2">
          <div className="bg-background/95 rounded-2xl shadow-lg flex flex-col md:flex-row items-center gap-6 px-6 py-6 border border-border">
            {/* Avatar and badges */}
            <div className="relative flex-shrink-0">
              <img
                src={developer.avatar || "/placeholder.svg"}
                alt={developer.displayName}
                className={`w-24 h-24 rounded-full object-cover border-4 ${
                  developer.featured
                    ? "border-primary shadow-lg"
                    : "border-muted"
                }`}
              />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {developer.featured && (
                  <Badge className="bg-primary text-primary-foreground border-0 text-xs px-2 py-0.5 shadow">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
                {developer.verified && (
                  <Badge className="bg-blue-100 text-blue-700 border-0 text-xs px-2 py-0.5 flex items-center gap-1 shadow">
                    <CheckCircle className="w-3 h-3" />
                    Verified
                  </Badge>
                )}
              </div>
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
                <div className="min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-display truncate">
                    {developer.displayName}
                  </h1>
                  <p className="text-base text-muted-foreground truncate">
                    @{developer.username}
                  </p>
                </div>
                {/* Social Links */}
                <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                  {developer.socialLinks?.website && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={developer.socialLinks.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Website
                      </a>
                    </Button>
                  )}
                  {developer.socialLinks?.twitter && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={developer.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Twitter
                      </a>
                    </Button>
                  )}
                  {developer.socialLinks?.instagram && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={developer.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Instagram
                      </a>
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate max-w-[8rem]">
                    {developer.location}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Joined{" "}
                    {new Date(developer.joinedDate).toLocaleDateString(
                      "en-US",
                      { month: "long", year: "numeric" }
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground font-display">
                {developer.totalProducts}
              </div>
              <div className="text-sm text-muted-foreground">Products</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground font-display">
                {developer.totalLikes.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Likes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground font-display">
                {Math.round(developer.totalViews / 1000)}k
              </div>
              <div className="text-sm text-muted-foreground">Views</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground font-display">
                {developer.totalSales}
              </div>
              <div className="text-sm text-muted-foreground">Sales</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-1 text-2xl font-bold text-foreground font-display">
                <Star className="h-5 w-5 fill-current text-yellow-400" />
                {developer.rating}
              </div>
              <div className="text-sm text-muted-foreground">Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="products" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products">
              Products ({developer.products.length})
            </TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-6">
            {/* View Toggle */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground font-display">
                All Products
              </h2>
              <div className="flex border border-border rounded-lg p-1">
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

            {/* Products Grid/List */}
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {developer.products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode={viewMode}
                  onCardClick={handleProductClick}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="about" className="mt-6">
            <div className="max-w-3xl">
              <h2 className="text-xl font-bold text-foreground mb-4 font-display">
                About {developer.displayName}
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {developer.bio}
              </p>

              <h3 className="text-lg font-semibold text-foreground mb-3 font-display">
                Specialties
              </h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {developer.specialties.map((specialty) => (
                  <Badge key={specialty} variant="outline" className="text-sm">
                    {specialty}
                  </Badge>
                ))}
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-3 font-display">
                Connect
              </h3>
              <div className="flex flex-wrap gap-3">
                {developer.socialLinks?.website && (
                  <Button variant="outline" asChild>
                    <a
                      href={developer.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Website
                    </a>
                  </Button>
                )}
                {developer.socialLinks?.twitter && (
                  <Button variant="outline" asChild>
                    <a
                      href={developer.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Twitter
                    </a>
                  </Button>
                )}
                {developer.socialLinks?.instagram && (
                  <Button variant="outline" asChild>
                    <a
                      href={developer.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Instagram
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="text-center py-12">
              <h2 className="text-xl font-bold text-foreground mb-2 font-display">
                Reviews Coming Soon
              </h2>
              <p className="text-muted-foreground">
                Customer reviews and testimonials will be available here.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
