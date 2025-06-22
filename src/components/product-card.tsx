"use client";

import React, { useState } from "react";
import { Heart, Star, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/app/developers/[id]/page"; // Adjust path if needed

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
        <img
          src={product.imageUrl || "/placeholder.svg"}
          alt={product.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition-colors duration-300" />
        {product.featured && (
          <Badge className={featuredBadge}>
            <Star className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        )}
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
        <div className="relative z-10 p-4 mt-auto">
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
            {product.featured && (
              <Badge className="bg-primary text-primary-foreground border-0 ml-2">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>
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
