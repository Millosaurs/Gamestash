"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  Eye,
  EyeOff,
  ImagePlus,
  Loader2,
} from "lucide-react";
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
import { createProduct, CreateProductData } from "@/lib/actions/products";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";
import Image from "next/image";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@/lib/cropImage";

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

// Simple modal for cropping
function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-background rounded-lg shadow-lg p-4 max-w-lg w-full relative">
        <button
          className="absolute top-2 right-2 text-foreground"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>
  );
}

// Preview Component
const ProductPreview = ({
  formData,
  tags,
  thumbnail,
  images,
}: {
  formData: any;
  tags: string[];
  thumbnail: string | null;
  images: string[];
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const allImages = [thumbnail, ...images].filter(Boolean);

  function isValidYouTubeUrl(url: string) {
    return /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}(&.*)?$/.test(
      url.trim()
    );
  }

  return (
    <div className="bg-background border rounded-lg p-6 h-fit sticky top-20">
      <h3 className="text-lg font-semibold mb-4 font-display">Live Preview</h3>
      <div className="space-y-4">
        {/* Image Gallery */}
        {allImages.length > 0 && (
          <div className="space-y-2">
            <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden">
              <Image
                src={allImages[currentImageIndex] || "/placeholder.svg"}
                alt="Product preview"
                fill
                className="object-cover"
              />
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 relative w-16 aspect-video rounded border-2 overflow-hidden ${
                      currentImageIndex === index
                        ? "border-primary"
                        : "border-border"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
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
          {formData.videoUrl && isValidYouTubeUrl(formData.videoUrl) && (
            <div className="aspect-video rounded-lg overflow-hidden my-4">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${
                  formData.videoUrl.match(/(?:v=|\.be\/)([\w-]{11})/)?.[1]
                }`}
                title="YouTube video preview"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export function NewProductForm({ onClose }: { onClose?: () => void }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    game: "",
    category: "",
    status: "draft",
    videoUrl: "",
  });
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  // Cropper state
  const [showCrop, setShowCrop] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCroppingThumbnail, setIsCroppingThumbnail] = useState(true);
  const [pendingAdditionalImages, setPendingAdditionalImages] = useState<
    string[]
  >([]);
  const [compressionProgress, setCompressionProgress] = useState<number>(0);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);

  function isValidYouTubeUrl(url: string) {
    return /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}(&.*)?$/.test(
      url.trim()
    );
  }

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

  // Show cropper when user selects a thumbnail
  const handleThumbnailUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Show cropper immediately with original file
      const reader = new FileReader();
      reader.onload = (e) => {
        setCropImageSrc(e.target?.result as string);
        setShowCrop(true);
        setIsCroppingThumbnail(true);
        // Store the original file for later use
        (window as any)._originalCropFile = file;
      };
      reader.readAsDataURL(file);
    }
  };

  // Show cropper when user selects additional images
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    const availableSlots = 5 - images.length;
    const filesToProcess = files.slice(0, availableSlots);

    if (filesToProcess.length > 0) {
      // Show cropper for the first image immediately
      const reader = new FileReader();
      reader.onload = (e) => {
        setPendingAdditionalImages(
          filesToProcess.map((f) => URL.createObjectURL(f))
        );
        setIsCroppingThumbnail(false);
        setCropImageSrc(e.target?.result as string);
        setShowCrop(true);
        // Store the files for later use
        (window as any)._pendingCropFiles = filesToProcess;
        (window as any)._pendingCropIndex = 0;
      };
      reader.readAsDataURL(filesToProcess[0]);
    }
  };

  // Save cropped image as thumbnail or additional image
  const handleCropSave = async () => {
    if (!cropImageSrc || !croppedAreaPixels) return;
    setIsCompressing(true);
    setCompressionProgress(0);
    // Use the original file for cropping
    let fileToCrop: File | null = null;
    if (isCroppingThumbnail) {
      fileToCrop = (window as any)._originalCropFile || null;
    } else {
      const files = (window as any)._pendingCropFiles || [];
      const idx = (window as any)._pendingCropIndex || 0;
      fileToCrop = files[idx] || null;
    }
    if (!fileToCrop) {
      toast.error("No file to crop");
      setIsCompressing(false);
      setCompressionProgress(0);
      return;
    }
    // Convert file to data URL before cropping
    const fileToCropDataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      if (fileToCrop) {
        reader.readAsDataURL(fileToCrop);
      } else {
        reject(new Error("No file to crop"));
      }
    });
    // Crop the image
    const croppedImageDataUrl = await getCroppedImg(fileToCropDataUrl, croppedAreaPixels); // getCroppedImg returns a data URL string
    // Convert data URL to Blob for compression
    const croppedImageBlob = await (await fetch(croppedImageDataUrl)).blob();
    // Convert Blob to File for imageCompression
    const croppedImageFile = new File(
      [croppedImageBlob],
      fileToCrop?.name || "cropped-image.jpg",
      { type: croppedImageBlob.type, lastModified: Date.now() }
    );
    // Compress the cropped image
    const compressedFile = await imageCompression(croppedImageFile, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      onProgress: (progress) => setCompressionProgress(progress),
    });
    // Upload to Cloudinary
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!uploadPreset) {
      toast.error("Cloudinary upload preset is not configured.");
      setIsCompressing(false);
      setCompressionProgress(0);
      return;
    }
    let cloudinaryUrl = null;
    try {
      const uploadResult = await uploadToCloudinary(
        compressedFile,
        uploadPreset
      );
      cloudinaryUrl = uploadResult.secure_url;
    } catch (e) {
      toast.error("Cloudinary upload failed");
      setIsCompressing(false);
      setCompressionProgress(0);
      return;
    }
    if (isCroppingThumbnail) {
      setThumbnail(cloudinaryUrl);
      setShowCrop(false);
      setCropImageSrc(null);
      (window as any)._originalCropFile = null;
    } else {
      setImages((prev) => [...prev, cloudinaryUrl]);
      setPendingAdditionalImages((prev) => {
        const next = prev.slice(1);
        if (next.length > 0) {
          // Move to next file
          (window as any)._pendingCropIndex =
            ((window as any)._pendingCropIndex || 0) + 1;
          const nextFile = ((window as any)._pendingCropFiles || [])[
            (window as any)._pendingCropIndex
          ];
          if (nextFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
              setCropImageSrc(e.target?.result as string);
              setShowCrop(true);
            };
            reader.readAsDataURL(nextFile);
          } else {
            setShowCrop(false);
            setCropImageSrc(null);
          }
        } else {
          setShowCrop(false);
          setCropImageSrc(null);
          (window as any)._pendingCropFiles = null;
          (window as any)._pendingCropIndex = 0;
        }
        return next;
      });
    }
    setIsCompressing(false);
    setCompressionProgress(0);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (status: "draft" | "published") => {
    if (!formData.title || !formData.description || !formData.price) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (formData.videoUrl && !isValidYouTubeUrl(formData.videoUrl)) {
      toast.error("Please enter a valid YouTube video URL");
      return;
    }

    setIsLoading(true);

    try {
      const productData: CreateProductData = {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        game: formData.game,
        category: formData.category,
        status,
        tags,
        thumbnail,
        images,
        video_url: formData.videoUrl,
      };

      const result = await createProduct(productData);

      if (result.success) {
        toast.success(
          `Product ${
            status === "published" ? "published" : "saved as draft"
          } successfully!`
        );
        if (onClose) onClose();
      } else {
        toast.error(result.error || "Failed to create product");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = () => {
    window.open("/dashboard/products/preview", "_blank");
  };

  return (
    <div className="w-full font-sans ">
      {/* Cropper Modal */}
      <Modal open={showCrop} onClose={() => setShowCrop(false)}>
        <div className="w-full h-64 relative bg-black rounded">
          {cropImageSrc && (
            <Cropper
              image={cropImageSrc}
              crop={crop}
              zoom={zoom}
              aspect={16 / 9}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, croppedAreaPixels) =>
                setCroppedAreaPixels(croppedAreaPixels)
              }
            />
          )}
          {isCompressing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-10">
              <div className="w-2/3">
                <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-primary transition-all"
                    style={{ width: `${compressionProgress}%` }}
                  />
                </div>
                <p className="text-xs text-white mt-2 text-center">
                  Compressing image... {Math.round(compressionProgress)}%
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setShowCrop(false)}
            disabled={isCompressing}
          >
            Cancel
          </Button>
          <Button onClick={handleCropSave} disabled={isCompressing}>
            Crop & Save
          </Button>
        </div>
      </Modal>

      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-bold text-foreground font-display">
            Create New Product
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="lg:hidden"
          >
            {showPreview ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </Button>
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
            {isLoading ? (
              <Loader2 className="animate-spin w-4 h-4 " />
            ) : (
              "Publish"
            )}
          </Button>
        </div>
      </div>

      <div
        className={`grid gap-8 ${
          showPreview ? "lg:grid-cols-2" : "lg:grid-cols-1 max-w-2xl mx-auto"
        }`}
      >
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
                <p className="text-xs text-muted-foreground mb-2">
                  <b>Note:</b> Only 16:9 ratio images are supported. You can
                  crop your image after selecting.
                </p>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  {thumbnail ? (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                      <Image
                        src={thumbnail || "/placeholder.svg"}
                        alt="Thumbnail preview"
                        fill
                        className="object-cover"
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
                <div className="flex flex-wrap gap-4">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative w-24 aspect-video rounded-lg overflow-hidden border"
                    >
                      <Image
                        src={img}
                        alt={`Additional ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1"
                        onClick={() => handleRemoveImage(idx)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      id="additional-images-upload"
                    />
                    <Button
                      variant="outline"
                      className="w-24 h-20 flex flex-col items-center justify-center"
                      onClick={() =>
                        images.length < 5
                          ? document
                              .getElementById("additional-images-upload")
                              ?.click()
                          : toast.error(
                              "You can upload up to 5 additional images only."
                            )
                      }
                      disabled={images.length >= 5}
                    >
                      <ImagePlus className="w-8 h-8 mb-1" />
                      <span className="text-xs">Add</span>
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  You can upload up to 5 additional images. PNG, JPG up to 10MB
                  each.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* YouTube Video */}
          <div className="space-y-2">
            <Label htmlFor="videoUrl">YouTube Video URL</Label>
            <Input
              id="videoUrl"
              placeholder="https://www.youtube.com/watch?v=..."
              value={formData.videoUrl || ""}
              onChange={(e) => handleInputChange("videoUrl", e.target.value)}
              type="url"
              pattern="https://.*"
            />
            {formData.videoUrl && !isValidYouTubeUrl(formData.videoUrl) && (
              <p className="text-xs text-destructive">
                Please enter a valid YouTube video URL.
              </p>
            )}
          </div>
        </div>

        {/* Preview Section */}
        {showPreview && (
          <div className="lg:block hidden">
            <ProductPreview
              formData={formData}
              tags={tags}
              thumbnail={thumbnail}
              images={images}
            />
          </div>
        )}

        {/* Mobile Preview */}
        {showPreview && (
          <div className="lg:hidden">
            <ProductPreview
              formData={formData}
              tags={tags}
              thumbnail={thumbnail}
              images={images}
            />
          </div>
        )}
      </div>
    </div>
  );
}
