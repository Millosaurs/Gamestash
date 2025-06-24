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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/header";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

export default function DevelopersPage() {
  const [developers, setDevelopers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [developerStats, setDeveloperStats] = useState<Record<string, any>>({});
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

  // Sort developers - featured first, then by rating (move inside component, useMemo for perf)
  const sortedDevelopers = useMemo(() => {
    return [...developers].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return Number(b.rating) - Number(a.rating);
    });
  }, [developers]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <Loader2 className="animate-spin w-8 h-8 text-primary mb-2" />
        <span className="text-muted-foreground">Loading developers...</span>
      </div>
    );
  }

  // Handle developer card click (for now, just log the developer id)
  function handleDeveloperClick(developerId: string) {
    router.push(`/developers/${developerId}`);
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="py-10 bg-background">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 font-display">
            Meet Our Developers
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground mb-6">
            Talented creators and designers building the most amazing gaming
            setups. Discover their work and get inspired.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-400" />
              <span className="font-medium text-foreground">
                {developers.length}
              </span>
              <span>Active Developers</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-400" />
              <span className="font-medium text-foreground">
                {developers
                  .reduce((sum, dev) => sum + dev.totalLikes, 0)
                  .toLocaleString()}
              </span>
              <span>Total Likes</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-blue-400" />
              <span className="font-medium text-foreground">
                {Math.round(
                  developers.reduce((sum, dev) => sum + dev.totalViews, 0) /
                    1000
                )}
                k
              </span>
              <span>Total Views</span>
            </div>
          </div>
        </div>
      </section>

      {/* Developers Grid */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {sortedDevelopers.map((developer) => (
              <Card
                key={developer.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.025] border border-border/60 bg-background/90"
                onClick={() => handleDeveloperClick(developer.id)}
              >
                <CardContent className="p-6 flex flex-col items-center">
                  {/* Avatar with overlay badges */}
                  <div className="relative mb-3 w-20 h-20">
                    {developer.image ? (
                      <img
                        src={developer.image}
                        alt={developer.displayName}
                        className={`w-20 h-20 rounded-full object-cover border-4 ${
                          developer.featured
                            ? "border-primary shadow-lg"
                            : "border-muted"
                        }`}
                      />
                    ) : (
                      <div
                        className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold bg-muted text-foreground border-4 ${
                          developer.featured
                            ? "border-primary shadow-lg"
                            : "border-muted"
                        }`}
                        aria-label={developer.displayName}
                      >
                        {developer.displayName?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                    )}
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

                  {/* Name and Username */}
                  <div className="w-full text-center mb-2">
                    <div className="flex items-center justify-center gap-2">
                      <h3 className="font-bold text-foreground truncate max-w-[10rem] sm:max-w-[12rem]">
                        {developer.displayName}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      @{developer.username}
                    </p>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2 text-center">
                    {developer.bio}
                  </p>

                  {/* Specialties */}
                  <div className="flex flex-wrap justify-center gap-1 mb-3">
                    {(developer.specialties || [])
                      .slice(0, 3)
                      .map((specialty: string, idx: number) => (
                        <Badge
                          key={specialty + idx}
                          variant="outline"
                          className="text-xs"
                        >
                          {specialty}
                        </Badge>
                      ))}
                  </div>

                  {/* Stats */}
                  <div className="flex justify-center gap-6 text-center text-xs mb-3 w-full">
                    <div>
                      <div className="font-bold text-foreground">
                        {developerStats[developer.id]?.totalProducts ??
                          developer.totalProducts}
                      </div>
                      <div className="text-muted-foreground">Products</div>
                    </div>
                    <div>
                      <div className="font-bold text-foreground">
                        {developerStats[
                          developer.id
                        ]?.totalViews?.toLocaleString() ??
                          developer.totalViews?.toLocaleString()}
                      </div>
                      <div className="text-muted-foreground">Views</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1">
                        <Heart className="h-3 w-3 text-red-400" />
                        <span className="font-bold text-foreground">
                          {developerStats[
                            developer.id
                          ]?.totalLikes?.toLocaleString() ??
                            developer.totalLikes?.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-muted-foreground">Likes</div>
                    </div>
                    <div>
                      <div className="font-bold text-foreground">
                        {developerStats[developer.id]?.totalSales ?? 0}
                      </div>
                      <div className="text-muted-foreground">Sales</div>
                    </div>
                  </div>

                  {/* Location & Join Date */}
                  <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate max-w-[6rem]">
                        {developer.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        Joined {new Date(developer.joinedDate).getFullYear()}
                      </span>
                    </div>
                  </div>

                  {/* Recent Products Preview */}
                  {developer.recentProducts.length > 0 && (
                    <div className="w-full">
                      <h4 className="text-xs font-semibold text-foreground mb-2 text-center">
                        Recent Work
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {(developer.recentProducts || [])
                          .slice(0, 2)
                          .map((product: any) => (
                            <div
                              key={product.id}
                              className="relative aspect-[16/10] rounded-lg overflow-hidden"
                            >
                              <img
                                src={product.imageUrl || "/placeholder.svg"}
                                alt={product.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/50" />
                              <div className="absolute bottom-1 left-1 right-1">
                                <div className="text-xs text-white font-medium line-clamp-1 mb-1">
                                  {product.title}
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-white/80">
                                    ${product.price}
                                  </span>
                                  <div className="flex items-center gap-1 text-white/80">
                                    <Heart className="h-3 w-3" />
                                    <span>
                                      {product.likesCount ?? product.likes}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
