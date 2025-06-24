"use client";

import {
  Heart,
  Sparkles,
  Star,
  Eye,
  MapPin,
  Calendar,
  CheckCircle,
  Loader2,
  TrendingUp,
  Award,
  Users,
  Filter,
  Search,
  Grid3X3,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/header";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

export default function DevelopersPage() {
  const [developers, setDevelopers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [developerStats, setDeveloperStats] = useState<Record<string, any>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const router = useRouter();

  useEffect(() => {
    async function fetchDevelopers() {
      try {
        const response = await fetch("/api/developers");
        if (response.ok) {
          const data = await response.json();
          setDevelopers(data);
        }
      } catch (error) {
        console.error("Error fetching developers:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDevelopers();
  }, []);

  useEffect(() => {
    async function fetchAllDeveloperStats() {
      const stats: Record<string, any> = {};
      await Promise.all(
        developers.map(async (dev) => {
          try {
            const res = await fetch(`/api/developers/${dev.id}/analytics`);
            if (res.ok) {
              const data = await res.json();
              stats[dev.id] = data.totals;
            }
          } catch {}
        })
      );
      setDeveloperStats(stats);
    }
    if (developers.length > 0) fetchAllDeveloperStats();
  }, [developers]);

  // Get unique specialties for filter
  const allSpecialties = useMemo(() => {
    const specialties = new Set<string>();
    developers.forEach((dev) => {
      dev.specialties?.forEach((specialty: string) =>
        specialties.add(specialty)
      );
    });
    return Array.from(specialties);
  }, [developers]);

  // Filter and sort developers
  const filteredAndSortedDevelopers = useMemo(() => {
    let filtered = developers.filter((dev) => {
      const matchesSearch =
        dev.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dev.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dev.bio?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSpecialty =
        selectedSpecialty === "all" ||
        dev.specialties?.includes(selectedSpecialty);
      return matchesSearch && matchesSpecialty;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "featured":
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return Number(b.rating) - Number(a.rating);
        case "rating":
          return Number(b.rating) - Number(a.rating);
        case "views":
          return (b.totalViews || 0) - (a.totalViews || 0);
        case "likes":
          return (b.totalLikes || 0) - (a.totalLikes || 0);
        case "newest":
          return (
            new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime()
          );
        default:
          return 0;
      }
    });
  }, [developers, searchQuery, sortBy, selectedSpecialty]);

  const totalStats = useMemo(
    () => ({
      totalLikes: developers.reduce(
        (sum, dev) => sum + (dev.totalLikes || 0),
        0
      ),
      totalViews: developers.reduce(
        (sum, dev) => sum + (dev.totalViews || 0),
        0
      ),
      totalProducts: developers.reduce(
        (sum, dev) => sum + (dev.totalProducts || 0),
        0
      ),
    }),
    [developers]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative">
            <Loader2 className="animate-spin w-12 h-12 text-primary mb-4" />
            <div className="absolute inset-0 w-12 h-12 border-4 border-primary/20 rounded-full animate-pulse"></div>
          </div>
          <span className="text-lg text-muted-foreground animate-pulse">
            Loading developers...
          </span>
        </div>
      </div>
    );
  }

  function handleDeveloperClick(developerId: string) {
    router.push(`/developers/${developerId}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 font-sans">
      <Header />

      {/* Enhanced Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5"></div>
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>

        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
            <Sparkles className="h-4 w-4" />
            Discover Amazing Talent
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 font-display bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Meet Our Developers
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Talented creators and designers building the most amazing gaming
            setups. Discover their work and get inspired by their creativity.
          </p>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div className="bg-background/60 backdrop-blur-sm rounded-2xl p-4 border border-border/50 hover:bg-background/80 transition-all duration-300">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold text-foreground">
                  {developers.length}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                Active Developers
              </div>
            </div>

            <div className="bg-background/60 backdrop-blur-sm rounded-2xl p-4 border border-border/50 hover:bg-background/80 transition-all duration-300">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Heart className="h-5 w-5 text-red-400" />
                <span className="text-2xl font-bold text-foreground">
                  {totalStats.totalLikes.toLocaleString()}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">Total Likes</div>
            </div>

            <div className="bg-background/60 backdrop-blur-sm rounded-2xl p-4 border border-border/50 hover:bg-background/80 transition-all duration-300">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Eye className="h-5 w-5 text-blue-400" />
                <span className="text-2xl font-bold text-foreground">
                  {Math.round(totalStats.totalViews / 1000)}k
                </span>
              </div>
              <div className="text-sm text-muted-foreground">Total Views</div>
            </div>

            <div className="bg-background/60 backdrop-blur-sm rounded-2xl p-4 border border-border/50 hover:bg-background/80 transition-all duration-300">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Award className="h-5 w-5 text-yellow-400" />
                <span className="text-2xl font-bold text-foreground">
                  {totalStats.totalProducts}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">Products</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Filters Section */}
      <section className="py-8 border-b border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search developers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/50 backdrop-blur-sm border-border/50 focus:bg-background"
                />
              </div>

              {/* Specialty Filter */}
              <Select
                value={selectedSpecialty}
                onValueChange={setSelectedSpecialty}
              >
                <SelectTrigger className="w-48 bg-background/50 backdrop-blur-sm border-border/50">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Specialties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  {allSpecialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 bg-background/50 backdrop-blur-sm border-border/50">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured First</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="views">Most Views</SelectItem>
                  <SelectItem value="likes">Most Likes</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
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
            Showing {filteredAndSortedDevelopers.length} of {developers.length}{" "}
            developers
          </div>
        </div>
      </section>

      {/* Enhanced Developers Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {filteredAndSortedDevelopers.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Users className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No developers found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div
              className={`grid gap-8 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                  : "grid-cols-1 max-w-4xl mx-auto"
              }`}
            >
              {filteredAndSortedDevelopers.map((developer) => (
                <Card
                  key={developer.id}
                  className={`group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 border border-border/60 bg-background/80 backdrop-blur-sm hover:bg-background/95 ${
                    developer.featured ? "ring-2 ring-primary/20" : ""
                  } ${viewMode === "list" ? "flex flex-row" : ""}`}
                  onClick={() => handleDeveloperClick(developer.id)}
                >
                  <CardContent
                    className={`p-6 ${
                      viewMode === "list"
                        ? "flex items-center w-full gap-6"
                        : "flex flex-col items-center"
                    }`}
                  >
                    {/* Avatar Section */}
                    <div
                      className={`relative ${
                        viewMode === "list" ? "flex-shrink-0" : "mb-4"
                      }`}
                    >
                      <div className="relative w-20 h-20">
                        {developer.image ? (
                          <img
                            src={developer.image}
                            alt={developer.displayName}
                            className={`w-20 h-20 rounded-full object-cover border-4 transition-all duration-300 group-hover:scale-110 ${
                              developer.featured
                                ? "border-primary shadow-lg shadow-primary/25"
                                : "border-border group-hover:border-primary/50"
                            }`}
                          />
                        ) : (
                          <div
                            className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold bg-gradient-to-br from-primary/20 to-secondary/20 text-foreground border-4 transition-all duration-300 group-hover:scale-110 ${
                              developer.featured
                                ? "border-primary shadow-lg shadow-primary/25"
                                : "border-border group-hover:border-primary/50"
                            }`}
                          >
                            {developer.displayName?.charAt(0)?.toUpperCase() ||
                              "?"}
                          </div>
                        )}

                        {/* Status indicator */}
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                      </div>

                      {/* Floating badges */}
                      <div
                        className={`absolute -top-2 left-1/2 -translate-x-1/2 flex gap-1 ${
                          viewMode === "list"
                            ? "relative top-0 left-0 translate-x-0 mt-2"
                            : ""
                        }`}
                      >
                        {developer.featured && (
                          <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0 text-xs px-2 py-0.5 shadow-lg animate-pulse">
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            Featured
                          </Badge>
                        )}
                        {developer.verified && (
                          <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 text-xs px-2 py-0.5 shadow-lg">
                            <CheckCircle className="w-3 h-3 mr-1 fill-current" />
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div
                      className={`${viewMode === "list" ? "flex-1" : "w-full"}`}
                    >
                      {/* Name and Username */}
                      <div
                        className={`${
                          viewMode === "list"
                            ? "text-left mb-2"
                            : "text-center mb-3"
                        }`}
                      >
                        <h3 className="font-bold text-lg text-foreground truncate group-hover:text-primary transition-colors">
                          {developer.displayName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          @{developer.username}
                        </p>
                      </div>

                      {/* Bio */}
                      <p
                        className={`text-sm text-muted-foreground mb-4 ${
                          viewMode === "list"
                            ? "line-clamp-2 text-left"
                            : "line-clamp-2 text-center"
                        }`}
                      >
                        {developer.bio}
                      </p>

                      {/* Specialties */}
                      <div
                        className={`flex flex-wrap gap-1 mb-4 ${
                          viewMode === "list"
                            ? "justify-start"
                            : "justify-center"
                        }`}
                      >
                        {(developer.specialties || [])
                          .slice(0, 3)
                          .map((specialty: string, idx: number) => (
                            <Badge
                              key={specialty + idx}
                              variant="outline"
                              className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
                            >
                              {specialty}
                            </Badge>
                          ))}
                      </div>

                      {/* Stats Grid */}
                      <div
                        className={`grid grid-cols-4 gap-3 text-center text-xs mb-4 ${
                          viewMode === "list" ? "max-w-md" : ""
                        }`}
                      >
                        <div className="bg-muted/50 rounded-lg p-2 hover:bg-primary/10 transition-colors">
                          <div className="font-bold text-foreground text-sm">
                            {developerStats[developer.id]?.totalProducts ??
                              developer.totalProducts}
                          </div>
                          <div className="text-muted-foreground">Products</div>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-2 hover:bg-primary/10 transition-colors">
                          <div className="font-bold text-foreground text-sm">
                            {developerStats[
                              developer.id
                            ]?.totalViews?.toLocaleString() ??
                              developer.totalViews?.toLocaleString()}
                          </div>
                          <div className="text-muted-foreground">Views</div>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-2 hover:bg-primary/10 transition-colors">
                          <div className="flex items-center justify-center gap-1">
                            <Heart className="h-3 w-3 text-red-400" />
                            <span className="font-bold text-foreground text-sm">
                              {developerStats[
                                developer.id
                              ]?.totalLikes?.toLocaleString() ??
                                developer.totalLikes?.toLocaleString()}
                            </span>
                          </div>
                          <div className="text-muted-foreground">Likes</div>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-2 hover:bg-primary/10 transition-colors">
                          <div className="font-bold text-foreground text-sm">
                            {developerStats[developer.id]?.totalSales ?? 0}
                          </div>
                          <div className="text-muted-foreground">Sales</div>
                        </div>
                      </div>

                      {/* Meta Info */}
                      <div
                        className={`flex items-center gap-4 text-xs text-muted-foreground mb-4 ${
                          viewMode === "list"
                            ? "justify-start"
                            : "justify-center"
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate max-w-[8rem]">
                            {developer.location}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            Joined{" "}
                            {new Date(developer.joinedDate).getFullYear()}
                          </span>
                        </div>
                      </div>

                      {/* Recent Products - Only show in grid view */}
                      {viewMode === "grid" &&
                        developer.recentProducts?.length > 0 && (
                          <div className="w-full">
                            <h4 className="text-xs font-semibold text-foreground mb-3 text-center flex items-center justify-center gap-1">
                              <Sparkles className="h-3 w-3" />
                              Recent Work
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                              {developer.recentProducts
                                .slice(0, 2)
                                .map((product: any) => (
                                  <div
                                    key={product.id}
                                    className="relative aspect-[16/10] rounded-lg overflow-hidden group/product hover:scale-105 transition-transform"
                                  >
                                    <img
                                      src={
                                        product.imageUrl || "/placeholder.svg"
                                      }
                                      alt={product.title}
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover/product:from-black/90 transition-all" />
                                    <div className="absolute bottom-1 left-1 right-1">
                                      <div className="text-xs text-white font-medium line-clamp-1 mb-1">
                                        {product.title}
                                      </div>
                                      <div className="flex items-center justify-between text-xs">
                                        <span className="text-white/90 font-semibold">
                                          ${product.price}
                                        </span>
                                        <div className="flex items-center gap-1 text-white/80">
                                          <Heart className="h-3 w-3 fill-current" />
                                          <span>
                                            {product.likesCount ??
                                              product.likes}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
