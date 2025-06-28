// app/setup/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Heart,
  Star,
  Eye,
  Share2,
  ShoppingCart,
  User,
  Calendar,
  Tag,
  ArrowLeft,
  Check,
  Shield,
  Truck,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  ExternalLink,
  MessageCircle,
  TrendingUp,
  Award,
  Zap,
  Clock,
  MapPin,
  Users,
  Star as StarIcon,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProductById } from "@/lib/actions/products";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import Link from "next/link";
import Header from "@/components/header";
import Image from "next/image";
import { cn } from "@/lib/utils";

function isValidYouTubeUrl(url: string) {
  return /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}(&.*)?$/.test(
    url.trim()
  );
}

function getYouTubeVideoId(url: string): string | null {
  const match = url.match(/(?:v=|\.be\/)([\w-]{11})/);
  return match ? match[1] : null;
}

function ProductImageGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!images.length) return null;

  return (
    <div className="space-y-4">
      {/* Main Image - now 16:9 aspect ratio */}
      <div className="relative group">
        <div className="aspect-video  overflow-hidden bg-muted">
          <Image
            src={images[currentImage]}
            alt={`${title} - Image ${currentImage + 1}`}
            fill
            className="object-cover transition-transform duration-300 rounded-2xl group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />

          {/* Navigation buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Fullscreen button */}

          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
              {currentImage + 1} / {images.length}
            </div>
          )}
        </div>
      </div>

      {/* Thumbnail Grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.slice(0, 4).map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={cn(
                "aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200",
                currentImage === index
                  ? "border-primary ring-2 ring-primary/20 scale-105"
                  : "border-muted hover:border-muted-foreground"
              )}
            >
              <Image
                src={image}
                alt={`${title} thumbnail ${index + 1}`}
                width={100}
                height={100}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
          {images.length > 4 && (
            <div className="aspect-square rounded-lg bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
              +{images.length - 4}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ProductVideo({ videoUrl }: { videoUrl?: string }) {
  if (!videoUrl || !isValidYouTubeUrl(videoUrl)) return null;

  const videoId = getYouTubeVideoId(videoUrl);
  if (!videoId) return null;

  return (
    <div className="rounded-2xl overflow-hidden bg-black">
      <div className="aspect-video relative">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
          title="Product demonstration video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0"
        />
      </div>
    </div>
  );
}

function RatingStars({
  rating,
  reviews,
}: {
  rating: number;
  reviews?: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={cn(
              "w-4 h-4",
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
            )}
          />
        ))}
      </div>
    </div>
  );
}

function PriceDisplay({
  price,
  originalPrice,
}: {
  price: number;
  originalPrice?: number;
}) {
  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <div className="flex items-center gap-3">
      <span className="text-4xl font-bold text-foreground">
        ${price.toLocaleString()}
      </span>
      {originalPrice && originalPrice > price && (
        <>
          <span className="text-xl text-muted-foreground line-through">
            ${originalPrice.toLocaleString()}
          </span>
          <Badge variant="destructive" className="text-xs">
            -{discount}%
          </Badge>
        </>
      )}
    </div>
  );
}

function TrustBadges() {
  return (
    <div className="grid grid-cols-3 gap-4 py-6">
      <div className="flex items-center gap-2 text-sm">
        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
          <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
        </div>
        <span className="text-muted-foreground">Secure Payment</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
          <Truck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </div>
        <span className="text-muted-foreground">Fast Delivery</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
          <RefreshCw className="w-4 h-4 text-purple-600 dark:text-purple-400" />
        </div>
        <span className="text-muted-foreground">30-day Returns</span>
      </div>
    </div>
  );
}

function SellerCard({ product }: { product: any }) {
  return (
    <Card className="border-0 shadow-lg bg-card w-full">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16 ring-2 ring-primary/20">
            <AvatarImage
              src={product.userAvatar}
              alt={product.userName || "Seller"}
            />
            <AvatarFallback className="text-lg font-semibold">
              {product.userName?.charAt(0) || "S"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{product.userName}</h3>
              <Badge variant="secondary" className="text-xs">
                <Award className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Member since {new Date(product.createdAt).getFullYear()}
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                98% positive
              </div>
            </div>
            <RatingStars rating={4.8} reviews={0} />
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <MessageCircle className="w-4 h-4 mr-2" />
            Contact Seller
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <User className="w-4 h-4 mr-2" />
            View Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const { data: session } = useSession();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchProduct() {
      if (!productId) return;

      setLoading(true);
      try {
        const result = await getProductById(productId);
        if (result.success && result.data) {
          setProduct(result.data);
          setLikeCount(result.data.likes || 0);
        } else {
          toast.error(result.error || "Failed to load product");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [productId]);

  const handleLike = async () => {
    if (!session?.user) {
      toast.error("Please login to like products");
      return;
    }

    try {
      const response = await fetch(`/api/products/${productId}/like`, {
        method: "POST",
      });

      const result = await response.json();

      if (result.success) {
        setLiked(result.liked);
        setLikeCount((prev) => (result.liked ? prev + 1 : prev - 1));
        toast.success(
          result.liked ? "Added to favorites!" : "Removed from favorites"
        );
      } else {
        toast.error(result.error || "Failed to toggle like");
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to toggle like");
    }
  };

  const handleBuyNow = async () => {
    if (!session?.user) {
      toast.error("Please login to purchase");
      return;
    }

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      } else {
        toast.error(data.error || "Failed to start checkout");
      }
    } catch (error) {
      toast.error("Failed to start checkout");
    }
  };

  const handleGetNow = () => {
    // Redirect to download page or show download modal
    window.location.href = `/products/${product.id}/download`;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <div className="aspect-square bg-muted rounded-2xl"></div>
                  <div className="grid grid-cols-4 gap-3">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square bg-muted rounded-lg"
                      ></div>
                    ))}
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="h-12 bg-muted rounded w-3/4"></div>
                  <div className="h-6 bg-muted rounded w-1/2"></div>
                  <div className="h-32 bg-muted rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold text-foreground">
                Product not found
              </h1>
              <p className="text-muted-foreground">
                The product you're looking for doesn't exist or has been
                removed.
              </p>
              <Link href="/explore">
                <Button size="lg" className="mt-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Explore
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  const images = [product.thumbnail, ...(product.images || [])].filter(Boolean);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Product Images */}
            <div className="space-y-6">
              <ProductImageGallery images={images} title={product.title} />
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              {/* Header */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="space-y-2 flex-1 min-w-0">
                    <h1 className="text-4xl font-extrabold text-foreground leading-tight truncate">
                      {product.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4">
                      <RatingStars
                        rating={product.rating || 4.5}
                        reviews={product.reviewCount}
                      />
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Eye className="w-4 h-4" />
                        <span>
                          {product.views?.toLocaleString() || 0} views
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLike}
                      className={cn(
                        "transition-all duration-200",
                        liked &&
                          "bg-red-50 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800"
                      )}
                      aria-label={
                        liked ? "Remove from favorites" : "Add to favorites"
                      }
                    >
                      <Heart
                        className={cn("w-4 h-4 mr-2", liked && "fill-current")}
                      />
                      <span className="sr-only">Favorite</span>
                      {likeCount}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                      aria-label="Share product"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <PriceDisplay
                  price={parseFloat(product.price)}
                  originalPrice={
                    product.originalPrice
                      ? parseFloat(product.originalPrice)
                      : undefined
                  }
                />
                <p className="text-lg text-muted-foreground leading-relaxed line-clamp-4">
                  {product.description}
                </p>

                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Button
                  onClick={product.hasPurchased ? handleGetNow : handleBuyNow}
                  size="lg"
                  className={cn(
                    "w-full text-lg py-6 font-semibold shadow-md",
                    product.hasPurchased
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  )}
                >
                  {product.hasPurchased ? (
                    <>
                      <Download className="w-5 h-5 mr-2" />
                      Get Now
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Buy Now
                    </>
                  )}
                </Button>

                <TrustBadges />
              </div>
            </div>
          </div>

          {/* Seller Info full width */}
          <div className="mb-12">
            <SellerCard product={product} />
          </div>

          {/* Product Details Tabs */}
          <div className="space-y-8">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {product.video_url && (
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">Product Demo</h3>
                    <ProductVideo videoUrl={product.video_url} />
                  </div>
                )}

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl">What You Get</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>High-quality digital assets</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Instant download</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Commercial license included</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>24/7 customer support</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl">
                      Product Specifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">
                            Game
                          </h4>
                          <p className="text-lg">
                            {product.game || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">
                            Category
                          </h4>
                          <p className="text-lg">
                            {product.category || "Not specified"}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">
                            Created
                          </h4>
                          <p className="text-lg">
                            {new Date(product.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">
                            Status
                          </h4>
                          <Badge
                            variant={
                              product.status === "published"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {product.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}
