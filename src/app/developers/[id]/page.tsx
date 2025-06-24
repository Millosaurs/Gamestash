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

export default function DeveloperDetailPage() {
  const params = useParams();
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeveloper = async () => {
      setLoading(true);
      const res = await fetch(`/api/developers/${params.id}`);
      const data = await res.json();
      setDeveloper(data);
      setLoading(false);
    };
    if (params.id) fetchDeveloper();
  }, [params.id]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!params.id) return;
      const res = await fetch(`/api/developers/${params.id}/analytics`);
      const data = await res.json();
      setAnalytics(data.totals);
    };
    fetchAnalytics();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <Loader2 className="animate-spin w-8 h-8 text-primary mb-2" />
        <span className="text-muted-foreground">Loading developer...</span>
      </div>
    );
  }

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

  const handleProductClick = (id: string) => {
    window.location.href = `/product/${id}`;
  };

  const handleHeartClick = (e: React.MouseEvent, productId: number) => {
    e.stopPropagation();
    // Implement like logic here
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header */}
      <Header />

      {/* User Card (no banner) */}
      <div className="relative w-full flex justify-center mt-8 mb-12">
        <div className="bg-background/95 rounded-2xl shadow-lg flex flex-col md:flex-row items-center gap-6 px-6 py-6 border border-border max-w-3xl w-full">
          {/* Avatar and badges */}
          <div className="relative flex-shrink-0">
            <img
              src={
                (() => {
                  const img = (developer as any).image;
                  if (typeof img === "string" && img.length > 0) return img;
                  if (
                    typeof developer.avatar === "string" &&
                    developer.avatar.length > 0
                  )
                    return developer.avatar;
                  return "/placeholder.svg";
                })() as string
              }
              alt={developer.displayName}
              width={96}
              height={96}
              className={`w-24 h-24 rounded-full object-cover border-4 ${
                developer.featured ? "border-primary shadow-lg" : "border-muted"
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
                  {new Date(developer.joinedDate).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground font-display">
                {analytics?.totalProducts ?? developer.products.length}
              </div>
              <div className="text-sm text-muted-foreground">Products</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground font-display">
                {analytics?.totalLikes?.toLocaleString() ??
                  developer.totalLikes?.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Likes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground font-display">
                {analytics?.totalViews?.toLocaleString() ??
                  developer.totalViews?.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Views</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground font-display">
                {analytics?.totalSales ?? developer.totalSales}
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
                  product={{
                    ...product,
                    imageUrl:
                      product.imageUrl ||
                      product.image ||
                      product.thumbnail ||
                      "/placeholder.svg",
                  }}
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
