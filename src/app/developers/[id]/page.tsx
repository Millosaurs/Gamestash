"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
  TrendingUp,
  Award,
  Users,
  Download,
  Share2,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/header";
import type { Product } from "@/types/product";
import { ProductCard } from "@/components/product-card";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import Link from "next/link";
// Assuming createCache is defined and available, if not, remove or replace
// import { createCache } from "@/lib/utils";

export type SocialLinks = {
  twitter?: string;
  instagram?: string;
  website?: string;
  youtube?: string;
  twitch?: string;
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
  totalProducts: number; // This might be redundant if products.length is used
  totalLikes: number;
  totalViews: number;
  totalSales: number;
  rating: number;
  specialties: string[];
  verified: boolean;
  featured: boolean;
  socialLinks: SocialLinks;
  products?: Product[]; // Made optional, as it might be undefined initially from API
  analytics?: {
    totalProducts?: number;
    totalLikes?: number;
    totalViews?: number;
    totalSales?: number;
    [key: string]: any;
  };
};

// Cache for developer analytics (1 min TTL)
// const analyticsCache = createCache<any>(60000); // Uncomment if createCache is available and used

export default function DeveloperDetailPage() {
  const params = useParams();
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false); // State not used in provided code

  useEffect(() => {
    const fetchDeveloper = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/developers/${params.id}`, {
          cache: "no-store", // Ensure fresh data
          keepalive: true, // Optimizes connection usage
        });

        if (!res.ok) {
          // Handle HTTP errors
          if (res.status === 404) {
            setDeveloper(null); // Explicitly set null for "not found"
          }
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data: Developer = await res.json();

        // Ensure products array exists, even if API sends null or undefined
        if (!Array.isArray(data.products)) {
          data.products = [];
        }

        setDeveloper(data);
      } catch (error) {
        console.error("Failed to fetch developer:", error);
        setDeveloper(null); // Set to null on error to show "Not Found" message
      } finally {
        setLoading(false);
      }
    };
    if (params.id) {
      fetchDeveloper();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-spin"></div>
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <div className="mt-6 text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Loading developer profile...
          </h3>
          <p className="text-sm text-muted-foreground">
            Please wait while we fetch the latest information
          </p>
        </div>
      </div>
    );
  }

  // If loading is false and developer is null, it means no developer was found or an error occurred.
  if (!developer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center font-sans">
        <div className="text-center bg-card p-8 rounded-2xl shadow-lg border border-border max-w-md">
          <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2 font-display">
            Developer Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            The developer profile you're looking for doesn't exist or has been
            removed.
          </p>
          <Button
            onClick={() => (window.location.href = "/developers")}
            size="lg"
            className="w-full"
          >
            Browse All Developers
          </Button>
        </div>
      </div>
    );
  }

  // --- BEGIN FIX FOR "developer.products is undefined" ---
  const developerProducts = developer.products || [];
  // --- END FIX ---

  // Use analytics from developer object
  const analytics = developer.analytics;

  const handleProductClick = (id: string) => {
    // Navigate to product detail page. Using Next.js Link would be better practice for client-side navigation.
    // For now, keeping your original window.location.href.
    window.location.href = `/product/${id}`;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${developer.displayName} - Developer Profile`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => alert("Profile link copied to clipboard!"))
        .catch((err) => console.error("Could not copy text: ", err));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 font-sans">
      {/* Header */}
      <Header />

      {/* Hero Section with Cover */}
      <div className="relative w-full">
        {/* Cover Image */}
        <div className="h-48 md:h-64 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]"></div>
        </div>

        {/* Profile Card Overlay */}
        <div className="relative -mt-24 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="bg-card/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-border/50 p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar Section */}
              <div className="relative flex-shrink-0">
                <div className="relative shadow-xl ring-4 ring-primary/10">
                  <img
                    src={
                      (() => {
                        // More robust image URL selection
                        const img = (developer as any).image; // Check for a general 'image' property first
                        if (typeof img === "string" && img.length > 0)
                          return img;
                        if (
                          typeof developer.avatar === "string" &&
                          developer.avatar.length > 0
                        )
                          return developer.avatar;
                        return "/placeholder.svg"; // Fallback if none exist
                      })() as string
                    }
                    alt={developer.displayName}
                    width={128}
                    height={128}
                    className={`w-32 h-32 md:w-36 md:h-36 rounded-2xl object-cover border-4 shadow-lg transition-transform hover:scale-105 ${
                      developer.featured
                        ? "border-primary shadow-primary/25"
                        : "border-background"
                    }`}
                  />
                  {developer.featured && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-br from-primary to-accent text-white rounded-full p-2 shadow-lg animate-pulse">
                      <Star className="w-5 h-5 fill-current" />
                    </div>
                  )}
                </div>
                {/* Status Badges */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                  {developer.verified && (
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs px-2 py-1 shadow-sm">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 min-w-0 w-full">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl md:text-4xl font-bold text-foreground font-display truncate">
                        {developer.displayName}
                      </h1>
                      {developer.featured && (
                        <Badge className="bg-gradient-to-r from-primary to-accent text-white border-0 px-3 py-1 shadow-lg animate-pulse">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <p className="text-lg text-muted-foreground mb-3">
                      @{developer.username}
                    </p>
                    {/* Quick Stats */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        <span className="font-medium">
                          {developer.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Joined{" "}
                          {new Date(developer.joinedDate).toLocaleDateString(
                            "en-US",
                            { month: "short", year: "numeric" }
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{developer.rating}</span>
                      </div>
                    </div>
                  </div>
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <Button onClick={handleShare} variant="outline" size="lg">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
                {/* Social Links */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {developer.socialLinks?.website && (
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="hover:bg-primary/10"
                    >
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
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="hover:bg-blue-50 hover:text-blue-600"
                    >
                      <a
                        href={developer.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="font-semibold">Twitter</span>
                      </a>
                    </Button>
                  )}
                  {developer.socialLinks?.instagram && (
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="hover:bg-pink-50 hover:text-pink-600"
                    >
                      <a
                        href={developer.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="font-semibold">Instagram</span>
                      </a>
                    </Button>
                  )}
                  {developer.socialLinks?.youtube && (
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="hover:bg-red-50 hover:text-red-600"
                    >
                      <a
                        href={developer.socialLinks.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="font-semibold">YouTube</span>
                      </a>
                    </Button>
                  )}
                  {developer.socialLinks?.twitch && (
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="hover:bg-purple-50 hover:text-purple-600"
                    >
                      <a
                        href={developer.socialLinks.twitch}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="font-semibold">Twitch</span>
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
            {/* Back to Developers */}
            <div className="mt-6">
              <Link
                href="/developers"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Users className="w-4 h-4" />
                Back to Developers
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-12">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 mb-12">
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/50 dark:to-blue-900/30">
            <CardContent className="p-6 text-center">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <ShoppingCart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-foreground font-display">
                {analytics?.totalProducts ?? developerProducts.length}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                Products
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/50 dark:to-red-900/30">
            <CardContent className="p-6 text-center">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Heart className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="text-2xl font-bold text-foreground font-display">
                {analytics?.totalLikes?.toLocaleString() ??
                  developer.totalLikes?.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                Likes
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/50 dark:to-green-900/30">
            <CardContent className="p-6 text-center">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Eye className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-2xl font-bold text-foreground font-display">
                {analytics?.totalViews?.toLocaleString() ??
                  developer.totalViews?.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                Views
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/50 dark:to-purple-900/30">
            <CardContent className="p-6 text-center">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-foreground font-display">
                {analytics?.totalSales ?? developer.totalSales}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                Sales
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-950/50 dark:to-yellow-900/30">
            <CardContent className="p-6 text-center">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
              </div>
              <div className="flex items-center justify-center gap-1 text-2xl font-bold text-foreground font-display">
                <Star className="h-5 w-5 fill-current text-yellow-500" />
                {developer.rating}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                Rating
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Content Tabs */}
        <Tabs defaultValue="products" className="mb-8">
          <TabsList className="grid w-full grid-cols-2 h-12 p-1 bg-muted/50 rounded-xl shadow-sm">
            <TabsTrigger value="products" className="rounded-lg font-medium">
              Products ({developerProducts.length})
            </TabsTrigger>
            <TabsTrigger value="about" className="rounded-lg font-medium">
              About
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-8">
            {/* Enhanced View Toggle */}
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground font-display mb-2">
                  All Products
                </h2>
                <p className="text-muted-foreground">
                  Discover {developer.displayName}'s complete collection
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex bg-muted/50 rounded-lg p-1">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="h-9 px-4 rounded-md"
                  >
                    <Grid3X3 className="h-4 w-4 mr-2" />
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="h-9 px-4 rounded-md"
                  >
                    <List className="h-4 w-4 mr-2" />
                    List
                  </Button>
                </div>
              </div>
            </div>
            {/* Products Display */}
            {developerProducts.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }
              >
                {developerProducts.map((product: Product) => (
                  <ProductCard
                    key={product.id}
                    product={{
                      ...product,
                      imageUrl:
                        product.imageUrl ||
                        (product as any).image || // Coerce to any if 'image' is not in Product type
                        (product as any).thumbnail || // Coerce to any if 'thumbnail' is not in Product type
                        "/placeholder.svg",
                    }}
                    viewMode={viewMode}
                    onCardClick={handleProductClick}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-muted/20 rounded-2xl">
                <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No Products Yet
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {developer.displayName} hasn't published any products yet.
                  Check back later for updates!
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="about" className="mt-8">
            <div className="max-w-4xl">
              <div className="bg-card rounded-2xl p-8 shadow-sm border border-border/50 mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-6 font-display">
                  About {developer.displayName}
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                  {developer.bio}
                </p>
                {developer.specialties.length > 0 && (
                  <>
                    <h3 className="text-xl font-semibold text-foreground mb-4 font-display">
                      Specialties & Skills
                    </h3>
                    <div className="flex flex-wrap gap-3 mb-8">
                      {developer.specialties.map((specialty, index) => (
                        <Badge
                          key={specialty}
                          variant="outline"
                          className={`text-sm px-4 py-2 rounded-full border-2 font-medium transition-colors hover:bg-primary hover:text-primary-foreground hover:border-primary ${
                            index % 4 === 0
                              ? "border-blue-200 text-blue-700 hover:bg-blue-600"
                              : index % 4 === 1
                              ? "border-green-200 text-green-700 hover:bg-green-600"
                              : index % 4 === 2
                              ? "border-purple-200 text-purple-700 hover:bg-purple-600"
                              : "border-orange-200 text-orange-700 hover:bg-orange-600"
                          }`}
                        >
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </>
                )}
                <h3 className="text-xl font-semibold text-foreground mb-4 font-display">
                  Connect & Follow
                </h3>
                <div className="flex flex-wrap gap-4">
                  {developer.socialLinks?.website && (
                    <Button
                      variant="outline"
                      size="lg"
                      asChild
                      className="hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <a
                        href={developer.socialLinks.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-5 h-5 mr-2" />
                        Visit Website
                      </a>
                    </Button>
                  )}
                  {developer.socialLinks?.twitter && (
                    <Button
                      variant="outline"
                      size="lg"
                      asChild
                      className="hover:bg-blue-500 hover:text-white transition-colors"
                    >
                      <a
                        href={developer.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Follow on Twitter
                      </a>
                    </Button>
                  )}
                  {developer.socialLinks?.instagram && (
                    <Button
                      variant="outline"
                      size="lg"
                      asChild
                      className="hover:bg-pink-500 hover:text-white transition-colors"
                    >
                      <a
                        href={developer.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Follow on Instagram
                      </a>
                    </Button>
                  )}
                  {developer.socialLinks?.youtube && (
                    <Button
                      variant="outline"
                      size="lg"
                      asChild
                      className="hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <a
                        href={developer.socialLinks.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Follow on YouTube
                      </a>
                    </Button>
                  )}
                  {developer.socialLinks?.twitch && (
                    <Button
                      variant="outline"
                      size="lg"
                      asChild
                      className="hover:bg-purple-500 hover:text-white transition-colors"
                    >
                      <a
                        href={developer.socialLinks.twitch}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Follow on Twitch
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
