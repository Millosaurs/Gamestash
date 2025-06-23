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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getProductById } from "@/lib/actions/products";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import Link from "next/link";
import Header from "@/components/header";

function isValidYouTubeUrl(url: string) {
  return /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}(&.*)?$/.test(
    url.trim()
  );
}

function getYouTubeVideoId(url: string): string | null {
  const match = url.match(/(?:v=|\.be\/)([\w-]{11})/);
  return match ? match[1] : null;
}

function ProductPreview({ videoUrl }: { videoUrl?: string }) {
  if (!videoUrl || !isValidYouTubeUrl(videoUrl)) return null;

  const videoId = getYouTubeVideoId(videoUrl);
  if (!videoId) return null;

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-2 font-display">
        Product Video Preview
      </h3>
      <div className="aspect-video rounded-lg overflow-hidden bg-black">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video preview"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
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
  const [selectedImage, setSelectedImage] = useState(0);

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
      } else {
        toast.error(result.error || "Failed to toggle like");
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to toggle like");
    }
  };

  const handleAddToCart = () => {
    if (!session?.user) {
      toast.error("Please login to add items to cart");
      return;
    }

    // Add to cart logic here
    toast.success("Added to cart!");
  };

  const handleBuyNow = () => {
    if (!session?.user) {
      toast.error("Please login to purchase");
      return;
    }
    window.location.href = `/checkout/${productId}`;
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
      // Fallback: copy to clipboard
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
            <div className="animate-pulse">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="aspect-video bg-gray-200 rounded-lg"></div>
                <div className="space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
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
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground mb-4">
                Product not found
              </h1>
              <Link href="/explore">
                <Button>Back to Explore</Button>
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
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/explore" className="hover:text-foreground">
              Explore
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                <img
                  src={images[selectedImage] || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-12 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index
                          ? "border-primary"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-3xl font-bold text-foreground font-display">
                    {product.title}
                  </h1>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLike}
                      className={liked ? "text-red-500" : ""}
                    >
                      <Heart
                        className={`w-4 h-4 mr-1 ${
                          liked ? "fill-current" : ""
                        }`}
                      />
                      {likeCount}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleShare}>
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{product.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Eye className="w-4 h-4" />
                    <span>{product.views?.toLocaleString()} views</span>
                  </div>
                </div>

                <div className="text-3xl font-bold text-primary mb-4">
                  ${parseFloat(product.price).toLocaleString()}
                </div>

                <p className="text-muted-foreground mb-4">
                  {product.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {(product.tags || []).map((tag: string) => (
                    <Badge key={tag} variant="secondary">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Purchase Section */}
              <Card>
                <CardContent className="px-6">
                  <div className="space-y-4">
                    <Button onClick={handleBuyNow} className="w-full">
                      Buy Now
                    </Button>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Shield className="w-4 h-4" />
                        <span>Secure Payment</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Truck className="w-4 h-4" />
                        <span>Fast Delivery</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <RefreshCw className="w-4 h-4" />
                        <span>30-day Returns</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Seller Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Seller Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={product.userAvatar} />
                      <AvatarFallback>
                        {product.userName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{product.userName}</div>
                      <div className="text-sm text-muted-foreground">
                        Member since {new Date(product.createdAt).getFullYear()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          {/* Product Video Preview */}
          <ProductPreview videoUrl={product.video_url} />

          {/* Product Details */}
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Game</h4>
                  <p className="text-muted-foreground">
                    {product.game || "Not specified"}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Category</h4>
                  <p className="text-muted-foreground">
                    {product.category || "Not specified"}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Created</h4>
                  <p className="text-muted-foreground">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Status</h4>
                  <Badge
                    variant={
                      product.status === "published" ? "default" : "secondary"
                    }
                  >
                    {product.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
