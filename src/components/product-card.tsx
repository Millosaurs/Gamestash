import { Heart, Eye, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge"; // <-- Correct import
import { useState } from "react";
import Image from "next/image";

export function ProductCard({
  product,
  viewMode,
  onCardClick,
}: {
  product: any;
  viewMode: "grid" | "list";
  onCardClick: (id: string) => void;
}) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(product.likes || 0);
  const [isLiking, setIsLiking] = useState(false);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiking) return;
    setIsLiking(true);
    try {
      const response = await fetch(`/api/products/${product.id}/like`, {
        method: "POST",
      });
      const result = await response.json();
      if (result.success) {
        setLiked(result.liked);
        setLikeCount((prev: number) => (result.liked ? prev + 1 : prev - 1));
      } else {
        console.error("Failed to toggle like:", result.error);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const cardBase =
    "transition-all duration-200 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md border border-border/30 shadow-lg hover:shadow-2xl hover:-translate-y-1 focus:ring-2 focus:ring-primary outline-none";
  const featuredBadge =
    "absolute top-3 left-3 bg-gradient-to-r from-green-500 to-emerald-400 text-white border-0 text-xs px-2 py-1 rounded shadow";

  const Content = () => (
    <div className="flex flex-col h-full justify-between flex-1 min-w-0">
      <div>
        <h3 className="font-bold text-base md:text-lg text-foreground line-clamp-2 mb-1 hover:text-primary transition-colors">
          {product.title}
        </h3>
        <p
          className={`text-sm text-muted-foreground mb-2 ${
            viewMode === "grid" ? "line-clamp-2" : "line-clamp-3"
          }`}
        >
          {product.description}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {product.tags?.map((tag: string) => (
            <Badge
              key={tag}
              className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-auto">
        <div className="font-bold text-lg md:text-xl text-primary">
          ${product.price}
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through ml-2">
              ${product.originalPrice}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            <span>{likeCount.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{product.views?.toLocaleString() ?? 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-current text-yellow-400" />
            <span>{product.rating ?? 0}</span>
          </div>
        </div>
      </div>
    </div>
  );

  // --- GRID VIEW ---
  if (viewMode === "grid") {
    return (
      <div
        tabIndex={0}
        onClick={() => onCardClick(product.id)}
        className={`cursor-pointer flex flex-col rounded-2xl ${cardBase} h-full`}
        aria-label={product.title}
        style={{ minHeight: 400, maxHeight: 400 }}
      >
        {/* Image */}
        <div className="relative w-full aspect-[16/9] rounded-t-2xl overflow-hidden group">
          <Image
            src={product.imageUrl || "/placeholder.svg"}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Heart icon */}
          <button
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 text-primary hover:bg-primary hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary shadow disabled:opacity-50"
            aria-label={liked ? "Unlike" : "Like"}
            onClick={handleLikeClick}
            disabled={isLiking}
            type="button"
          >
            {liked ? (
              <Heart className="h-5 w-5 fill-primary text-primary" />
            ) : (
              <Heart className="h-5 w-5" />
            )}
          </button>
          {/* Featured badge */}
          {product.featured && (
            <Badge className={featuredBadge}>
              <Star className="w-3 h-3 mr-1 inline" />
              Featured
            </Badge>
          )}
        </div>
        <div className="flex-1 flex flex-col p-4">
          <Content />
        </div>
      </div>
    );
  }

  // --- LIST VIEW ---
  return (
    <div
      tabIndex={0}
      onClick={() => onCardClick(product.id)}
      className={`cursor-pointer flex flex-row gap-6 p-4 rounded-2xl ${cardBase} min-h-[180px]`}
      aria-label={product.title}
    >
      {/* Image */}
      <div className="relative w-48 aspect-[16/9] rounded-xl overflow-hidden flex-shrink-0 group">
        <Image
          src={product.imageUrl || "/placeholder.svg"}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Heart icon */}
        <button
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 text-primary hover:bg-primary hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary shadow disabled:opacity-50"
          aria-label={liked ? "Unlike" : "Like"}
          onClick={handleLikeClick}
          disabled={isLiking}
          type="button"
        >
          {liked ? (
            <Heart className="h-5 w-5 fill-primary text-primary" />
          ) : (
            <Heart className="h-5 w-5" />
          )}
        </button>
        {/* Featured badge */}
        {product.featured && (
          <Badge className={featuredBadge}>
            <Star className="w-3 h-3 mr-1 inline" />
            Featured
          </Badge>
        )}
      </div>
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <Content />
      </div>
    </div>
  );
}
