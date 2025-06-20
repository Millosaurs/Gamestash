// components/product-comp/edit-product.tsx
"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Upload, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// You can pass these as props or import from a shared file
const gameOptions = [
  { value: "minecraft", label: "Minecraft" },
  { value: "roblox", label: "Roblox" },
  { value: "fivem", label: "FiveM" },
  { value: "rust", label: "Rust" },
  { value: "valorant", label: "Valorant" },
  { value: "csgo", label: "CS:GO" },
];

const categoryOptions = [
  { value: "rgb", label: "RGB" },
  { value: "minimal", label: "Minimal" },
  { value: "professional", label: "Professional" },
  { value: "budget", label: "Budget" },
  { value: "premium", label: "Premium" },
  { value: "streaming", label: "Streaming" },
];

const mockProduct = {
  id: 1,
  title: "Ultimate Minecraft RGB Battlestation",
  description:
    "A complete gaming setup designed for Minecraft enthusiasts. Features RGB lighting, dual monitors, and optimized performance for the best gaming experience.",
  price: "1299",
  game: "minecraft",
  category: "rgb",
  status: "published",
  tags: ["Minecraft", "RGB", "Gaming", "Dual Monitor"],
  thumbnail:
    "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=600&h=400&fit=crop&q=80",
  images: [
    "https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop&q=80",
  ],
};

function ProductPreview({
  formData,
  tags,
  thumbnail,
  images,
}: {
  formData: {
    title: string;
    description: string;
    price: string;
    game: string;
    category: string;
    status: string;
  };
  tags: string[];
  thumbnail: string | null;
  images: string[];
}) {
  const allImages = [thumbnail, ...images].filter(Boolean);

  return (
    <div className="bg-background border rounded-lg p-6 h-fit sticky top-20">
      <h3 className="text-lg font-semibold mb-4 font-display">Live Preview</h3>
      <div className="space-y-4">
        {/* Image Gallery */}
        {allImages.length > 0 && (
          <div className="space-y-2">
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              <img
                src={allImages[0] || "/placeholder.svg"}
                alt="Product preview"
                className="w-full h-full object-cover"
              />
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Product Info */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold font-display">
            {formData.title || "Product Title"}
          </h2>
          {formData.price && (
            <p className="text-2xl font-bold text-primary">${formData.price}</p>
          )}
          <div className="flex gap-2 flex-wrap">
            {formData.game && (
              <Badge variant="outline">
                {gameOptions.find((g) => g.value === formData.game)?.label}
              </Badge>
            )}
            {formData.category && (
              <Badge variant="outline">
                {
                  categoryOptions.find((c) => c.value === formData.category)
                    ?.label
                }
              </Badge>
            )}
          </div>
          {tags.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {tags.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          <div className="space-y-2">
            <h3 className="font-semibold">Description</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {formData.description ||
                "Product description will appear here..."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EditProductForm({
  onClose,
  productId,
}: {
  onClose?: () => void;
  productId: number;
}) {
  // In a real app, fetch product by productId
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    game: "",
    category: "",
    status: "draft",
  });
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulate fetch
    setFormData({
      title: mockProduct.title,
      description: mockProduct.description,
      price: mockProduct.price,
      game: mockProduct.game,
      category: mockProduct.category,
      status: mockProduct.status,
    });
    setTags(mockProduct.tags);
    setThumbnail(mockProduct.thumbnail);
    setImages(mockProduct.images);
  }, [productId]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags((prev) => [...prev, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleThumbnailUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnail(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (status: "draft" | "published") => {
    setIsLoading(true);
    setTimeout(() => {
      console.log("Product updated:", {
        ...formData,
        status,
        tags,
        thumbnail,
        images,
      });
      setIsLoading(false);
      if (onClose) onClose();
    }, 1000);
  };

  const handlePreview = () => {
    window.open(`/setup/${productId}`, "_blank");
  };

  return (
    <div className="w-full font-sans px-2 sm:px-4 md:px-6">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-bold text-foreground font-display">
            Edit Product
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={handlePreview}>
            Preview
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSubmit("draft")}
            disabled={isLoading}
          >
            Save Draft
          </Button>
          <Button
            onClick={() => handleSubmit("published")}
            disabled={
              isLoading ||
              !formData.title ||
              !formData.description ||
              !formData.price
            }
          >
            {isLoading ? "Updating..." : "Update"}
          </Button>
        </div>
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Form Section */}
        <div className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Product Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter product title..."
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your gaming setup..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="game">Game</Label>
                  <Select
                    value={formData.game}
                    onValueChange={(value) => handleInputChange("game", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select game" />
                    </SelectTrigger>
                    <SelectContent>
                      {gameOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleInputChange("category", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                />
                <Button onClick={handleAddTag} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          {/* Thumbnail */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Thumbnail Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  {thumbnail ? (
                    <div className="relative inline-block">
                      <img
                        src={thumbnail || "/placeholder.svg"}
                        alt="Thumbnail preview"
                        className="max-w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => setThumbnail(null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-2">
                        Upload thumbnail image
                      </p>
                      <p className="text-sm text-muted-foreground">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  className="hidden"
                  id="thumbnail-upload"
                />
                <Button
                  variant="outline"
                  onClick={() =>
                    document.getElementById("thumbnail-upload")?.click()
                  }
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {thumbnail ? "Change Thumbnail" : "Upload Thumbnail"}
                </Button>
              </div>
            </CardContent>
          </Card>
          {/* Additional Images */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Additional Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="images-upload"
                />
                <Button
                  variant="outline"
                  onClick={() =>
                    document.getElementById("images-upload")?.click()
                  }
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Add Images
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Live Preview Section */}
        <div className="hidden lg:block">
          <ProductPreview
            formData={formData}
            tags={tags}
            thumbnail={thumbnail}
            images={images}
          />
        </div>
      </div>
      {/* Mobile Preview (below form) */}
      <div className="block lg:hidden mt-8">
        <ProductPreview
          formData={formData}
          tags={tags}
          thumbnail={thumbnail}
          images={images}
        />
      </div>
    </div>
  );
}
