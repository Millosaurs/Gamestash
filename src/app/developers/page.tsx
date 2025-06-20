"use client";

import {
  Heart,
  Sparkles,
  Star,
  Eye,
  MapPin,
  Calendar,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/header";

// Mock developers data
const developers = [
  {
    id: 1,
    username: "NeonGamer",
    displayName: "Alex Chen",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
    bio: "Professional gaming setup designer with 5+ years of experience. Specializing in RGB and high-performance builds.",
    location: "San Francisco, CA",
    joinedDate: "2019-03-15",
    totalProducts: 12,
    totalLikes: 15420,
    totalViews: 125000,
    rating: 4.8,
    specialties: ["RGB", "Gaming", "High-end"],
    verified: true,
    featured: true,
    socialLinks: {
      twitter: "https://twitter.com/neongamer",
      instagram: "https://instagram.com/neongamer",
      website: "https://neongamer.dev",
    },
    recentProducts: [
      {
        id: 1,
        title: "Ultimate Minecraft RGB Battlestation",
        imageUrl:
          "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=300&h=200&fit=crop&q=80",
        price: 1299,
        originalPrice: 1499,
        likes: 1247,
      },
      {
        id: 9,
        title: "Rust Survival Gaming Setup",
        imageUrl:
          "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=200&fit=crop&q=80",
        price: 1599,
        originalPrice: 1799,
        likes: 892,
      },
    ],
  },
  {
    id: 2,
    username: "CleanDesk",
    displayName: "Sarah Johnson",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    bio: "Minimalist design enthusiast. Creating clean, productive workspaces that inspire creativity and focus.",
    location: "Austin, TX",
    joinedDate: "2020-01-20",
    totalProducts: 8,
    totalLikes: 9200,
    totalViews: 78000,
    rating: 4.6,
    specialties: ["Minimal", "Clean", "Productivity"],
    verified: true,
    featured: false,
    socialLinks: {
      instagram: "https://instagram.com/cleandesk",
      website: "https://cleandesk.co",
    },
    recentProducts: [
      {
        id: 2,
        title: "Roblox Creator Studio Setup",
        imageUrl:
          "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=200&fit=crop&q=80",
        price: 999,
        originalPrice: 1199,
        likes: 892,
      },
    ],
  },
  {
    id: 3,
    username: "CreatorPro",
    displayName: "Mike Rodriguez",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    bio: "Content creator and professional gamer. Building setups that perform under pressure and look amazing on stream.",
    location: "Los Angeles, CA",
    joinedDate: "2018-11-10",
    totalProducts: 15,
    totalLikes: 22100,
    totalViews: 180000,
    rating: 4.9,
    specialties: ["Professional", "Streaming", "Gaming"],
    verified: true,
    featured: true,
    socialLinks: {
      twitter: "https://twitter.com/creatorpro",
      youtube: "https://youtube.com/creatorpro",
      twitch: "https://twitch.tv/creatorpro",
    },
    recentProducts: [
      {
        id: 4,
        title: "Rust Survival Gaming Setup with Dual Monitors",
        imageUrl:
          "https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=300&h=200&fit=crop&q=80",
        price: 1499,
        originalPrice: 1699,
        likes: 2034,
      },
    ],
  },
  {
    id: 4,
    username: "TechMaster",
    displayName: "David Kim",
    avatar:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face",
    bio: "Tech enthusiast and hardware expert. Pushing the boundaries of what's possible with cutting-edge technology.",
    location: "Seattle, WA",
    joinedDate: "2019-07-22",
    totalProducts: 10,
    totalLikes: 18900,
    totalViews: 145000,
    rating: 4.7,
    specialties: ["High-end", "Tech", "Innovation"],
    verified: true,
    featured: false,
    socialLinks: {
      twitter: "https://twitter.com/techmaster",
      website: "https://techmaster.dev",
    },
    recentProducts: [
      {
        id: 6,
        title: "FiveM Roleplay Command Center",
        imageUrl:
          "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=300&h=200&fit=crop&q=80",
        price: 1799,
        originalPrice: 1999,
        likes: 3240,
      },
    ],
  },
  {
    id: 5,
    username: "BudgetGamer",
    displayName: "Emma Wilson",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    bio: "Proving that great gaming setups don't have to break the bank. Affordable builds that deliver maximum value.",
    location: "Denver, CO",
    joinedDate: "2020-09-05",
    totalProducts: 6,
    totalLikes: 12500,
    totalViews: 95000,
    rating: 4.3,
    specialties: ["Budget", "Value", "Starter"],
    verified: false,
    featured: false,
    socialLinks: {
      youtube: "https://youtube.com/budgetgamer",
    },
    recentProducts: [
      {
        id: 8,
        title: "Budget FiveM Racing Setup",
        imageUrl:
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&h=200&fit=crop&q=80",
        price: 399,
        originalPrice: 499,
        likes: 2340,
      },
    ],
  },
  {
    id: 6,
    username: "WhiteSpace",
    displayName: "James Park",
    avatar:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face",
    bio: "Minimalist designer focused on creating serene, distraction-free workspaces that promote deep focus.",
    location: "Portland, OR",
    joinedDate: "2021-02-14",
    totalProducts: 4,
    totalLikes: 7800,
    totalViews: 52000,
    rating: 4.5,
    specialties: ["Minimal", "Clean", "Zen"],
    verified: false,
    featured: false,
    socialLinks: {
      instagram: "https://instagram.com/whitespace",
    },
    recentProducts: [
      {
        id: 7,
        title: "Minimalist Rust Gaming Setup",
        imageUrl:
          "https://images.unsplash.com/photo-1541746972996-4e0b0f93e586?w=300&h=200&fit=crop&q=80",
        price: 1199,
        originalPrice: 1399,
        likes: 1890,
      },
    ],
  },
];

// Sort developers - featured first, then by rating
const sortedDevelopers = [...developers].sort((a, b) => {
  if (a.featured && !b.featured) return -1;
  if (!a.featured && b.featured) return 1;
  return b.rating - a.rating;
});

export default function DevelopersPage() {
  const handleDeveloperClick = (developerId: number) => {
    window.location.href = `/developers/${developerId}`;
  };

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
                    <img
                      src={developer.avatar || "/placeholder.svg"}
                      alt={developer.displayName}
                      className={`w-20 h-20 rounded-full object-cover border-4 ${
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
                    {developer.specialties.slice(0, 3).map((specialty) => (
                      <Badge
                        key={specialty}
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
                        {developer.totalProducts}
                      </div>
                      <div className="text-muted-foreground">Products</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1">
                        <Heart className="h-3 w-3 text-red-400" />
                        <span className="font-bold text-foreground">
                          {developer.totalLikes.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-muted-foreground">Likes</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-3 w-3 fill-current text-yellow-400" />
                        <span className="font-bold text-foreground">
                          {developer.rating}
                        </span>
                      </div>
                      <div className="text-muted-foreground">Rating</div>
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
                        {developer.recentProducts.slice(0, 2).map((product) => (
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
                                  <span>{product.likes}</span>
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
