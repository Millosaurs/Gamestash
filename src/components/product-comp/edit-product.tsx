"use client";

import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  ImagePlus,
  Loader2,
  PaperclipIcon,
  AlertCircleIcon,
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
import { toast } from "sonner";
import {
  getProductById,
  updateProduct,
  UpdateProductData,
} from "@/lib/actions/products";
import { uploadToCloudinary } from "@/lib/cloudinary";
import imageCompression from "browser-image-compression";
import Image from "next/image";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@/lib/cropImage";
import { getPresignedUploadUrl, deleteS3Object } from "@/lib/actions/s3";
import { useFileUpload, formatBytes } from "@/hooks/use-file-upload";
import { getCloudinaryPublicId } from "@/lib/utils/cloudinary";
import { deleteCloudinaryImageAction } from "@/lib/actions/deleteCloudinaryImage";

const ALLOWED_EXTENSIONS = [".zip", ".rar"];
const MAX_SIZE = 100 * 1024 * 1024; // 100MB

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

// File Upload Card for .zip/.rar
function FileUploadCard({
  productFileKey,
  setProductFileKey,
  productFile,
  setProductFile,
  initialFileName,
}: {
  productFileKey: string | null;
  setProductFileKey: (key: string | null) => void;
  productFile: File | null;
  setProductFile: (file: File | null) => void;
  initialFileName?: string | null;
}) {
  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    maxSize: MAX_SIZE,
    accept: ".zip,.rar",
    initialFiles: [],
  });

  const [fileUploading, setFileUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [removingFile, setRemovingFile] = useState(false);
  const [fileName, setFileName] = useState<string | null>(
    initialFileName || null
  );

  useEffect(() => {
    setFileName(initialFileName || null);
  }, [initialFileName]);

  useEffect(() => {
    const uploadFile = async () => {
      if (!files[0]) return;

      const file = files[0]?.file;
      if (!(file instanceof File)) {
        toast.error("Invalid file type.");
        if (files[0]) removeFile(files[0].id);
        return;
      }
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (!ext || !ALLOWED_EXTENSIONS.includes(`.${ext}`)) {
        toast.error("Only .zip and .rar files are allowed!");
        removeFile(files[0].id);
        return;
      }
      if (file.size > MAX_SIZE) {
        toast.error("File too large! Max 100MB.");
        removeFile(files[0].id);
        return;
      }

      setFileUploading(true);
      setUploadProgress(0);
      try {
        const { url, key } = await getPresignedUploadUrl(
          file.name,
          file.type,
          file.size
        );

        // Use XMLHttpRequest to track progress
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("PUT", url, true);
          xhr.setRequestHeader("Content-Type", file.type);

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              setUploadProgress((event.loaded / event.total) * 100);
            }
          };

          xhr.onload = () => {
            if (xhr.status === 200) {
              resolve();
            } else {
              reject(new Error("Upload failed"));
            }
          };
          xhr.onerror = () => reject(new Error("Upload failed"));
          xhr.send(file);
        });

        setProductFile(file);
        setProductFileKey(key);
        setFileName(file.name);
        toast.success("File uploaded!");
      } catch (err: any) {
        toast.error(err.message || "Upload failed");
        if (files[0]) removeFile(files[0].id);
        setProductFile(null);
        setProductFileKey(null);
        setFileName(null);
      } finally {
        setFileUploading(false);
        setUploadProgress(0);
      }
    };

    if (files.length === 1 && !productFileKey) {
      uploadFile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  // Remove file from S3
  const handleRemove = async () => {
    setRemovingFile(true);
    if (productFileKey) {
      try {
        await deleteS3Object(productFileKey);
      } catch (err) {
        toast.error("Failed to delete file from S3");
      }
    }
    if (files[0]) removeFile(files[0].id);
    setProductFile(null);
    setProductFileKey(null);
    setFileName(null);
    setRemovingFile(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display">Product File</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          role="button"
          onClick={openFileDialog}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          className="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[input:focus]:ring-[3px]"
        >
          <input
            {...getInputProps()}
            className="sr-only"
            aria-label="Upload file"
            disabled={!!productFileKey}
          />

          <div className="flex flex-col items-center justify-center text-center">
            <div
              className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
              aria-hidden="true"
            >
              <Upload className="size-4 opacity-60" />
            </div>
            <p className="mb-1.5 text-sm font-medium">Upload file</p>
            <p className="text-muted-foreground text-xs">
              Drag & drop or click to browse (max. {formatBytes(MAX_SIZE)})
            </p>
          </div>
        </div>

        {errors.length > 0 && (
          <div
            className="text-destructive flex items-center gap-1 text-xs mt-2"
            role="alert"
          >
            <AlertCircleIcon className="size-3 shrink-0" />
            <span>{errors[0]}</span>
          </div>
        )}

        {productFileKey && (
          <div className="space-y-2 mt-2">
            <div className="flex items-center justify-between gap-2 rounded-xl border px-4 py-2">
              <div className="flex items-center gap-3 overflow-hidden">
                <PaperclipIcon
                  className="size-4 shrink-0 opacity-60"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium">
                    {fileName || "Product File"}
                  </p>
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="text-muted-foreground/80 hover:text-foreground -me-2 size-8 hover:bg-transparent"
                onClick={handleRemove}
                aria-label="Remove file"
                disabled={removingFile}
              >
                {removingFile ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <X className="size-4" aria-hidden="true" />
                )}
              </Button>
            </div>
          </div>
        )}

        {fileUploading && (
          <div className="mt-2">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-2 bg-primary transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Uploading file... {Math.round(uploadProgress)}%
            </p>
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-2">
          Allowed: .RAR & .ZIP // Max 100MB.
        </p>
      </CardContent>
    </Card>
  );
}

const ProductPreview = ({
  formData,
  tags,
  thumbnail,
  images,
  gameOptions,
  categoryOptions,
}: {
  formData: any;
  tags: string[];
  thumbnail: string | null;
  images: string[];
  gameOptions: SelectOption[];
  categoryOptions: SelectOption[];
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

type SelectOption = { value: string; label: string };

export function EditProductForm({
  onClose,
  productId,
  gameOptions,
  categoryOptions,
}: {
  onClose?: () => void;
  productId: string;
  gameOptions: SelectOption[];
  categoryOptions: SelectOption[];
}) {
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
  const [loading, setLoading] = useState(true);
  const additionalImagesInputRef = useRef<HTMLInputElement>(null);

  // Cropper state
  const [showCrop, setShowCrop] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCroppingThumbnail, setIsCroppingThumbnail] = useState(true);
  const [pendingAdditionalIndex, setPendingAdditionalIndex] = useState<
    number | null
  >(null);
  const [compressionProgress, setCompressionProgress] = useState<number>(0);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);

  // File upload state
  const [productFile, setProductFile] = useState<File | null>(null);
  const [productFileKey, setProductFileKey] = useState<string | null>(null);
  const [initialFileName, setInitialFileName] = useState<string | null>(null);
  const [removingImageIdx, setRemovingImageIdx] = useState<number | null>(null);
  const [removingThumbnail, setRemovingThumbnail] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      if (!productId) return;

      setLoading(true);
      try {
        const result = await getProductById(String(productId));

        if (result.success && result.data) {
          const product = result.data;
          setFormData({
            title: product.title,
            description: product.description,
            price: product.price,
            game: product.game || "",
            category: product.category || "",
            status: product.status,
            videoUrl: product.video_url || "",
          });
          setTags(product.tags || []);
          setThumbnail(product.thumbnail || null);
          setImages(product.images || []);
          setProductFileKey(product.file || null);

          // If you want to show a file name, you can extract it from the S3 key:
          // (Assuming product.file is something like "uploads/filename.zip")
          setInitialFileName(
            product.file ? product.file.split("/").pop()! : null
          );
        } else {
          toast.error("Failed to load product");
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
        (window as any)._originalCropFile = file;
      };
      reader.readAsDataURL(file);
    }
  };

  // Show cropper when user selects an additional image
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    if (images.length >= 5) {
      toast.error("You can upload up to 5 additional images only.");
      return;
    }
    const availableSlots = 5 - images.length;
    const filesToProcess = files.slice(0, availableSlots);

    if (filesToProcess.length > 0) {
      // Show cropper for the first image immediately
      const reader = new FileReader();
      reader.onload = (e) => {
        setIsCroppingThumbnail(false);
        setCropImageSrc(e.target?.result as string);
        setShowCrop(true);
        (window as any)._pendingCropFiles = filesToProcess;
        (window as any)._pendingCropIndex = 0;
        setPendingAdditionalIndex(images.length); // add at the end
      };
      reader.readAsDataURL(filesToProcess[0]);
    }
    // Reset input value so the same file can be selected again if needed
    if (additionalImagesInputRef.current) {
      additionalImagesInputRef.current.value = "";
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
      setShowCrop(false);
      setCropImageSrc(null);
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
    const croppedImageDataUrl = await getCroppedImg(
      fileToCropDataUrl,
      croppedAreaPixels
    ); // getCroppedImg returns a data URL string
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
      setShowCrop(false);
      setCropImageSrc(null);
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
      setShowCrop(false);
      setCropImageSrc(null);
      setIsCompressing(false);
      setCompressionProgress(0);
      return;
    }
    if (isCroppingThumbnail) {
      setThumbnail(cloudinaryUrl);
      (window as any)._originalCropFile = null;
    } else if (pendingAdditionalIndex !== null) {
      setImages((prev) => [...prev, cloudinaryUrl]);
      setPendingAdditionalIndex(null);
      // Move to next file if any
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
        (window as any)._pendingCropFiles = null;
        (window as any)._pendingCropIndex = 0;
      }
    }
    setShowCrop(false);
    setCropImageSrc(null);
    setIsCompressing(false);
    setCompressionProgress(0);
  };

  // Remove image from Cloudinary and state
  const handleRemoveImage = async (index: number) => {
    setRemovingImageIdx(index);
    const imageUrl = images[index];
    const publicId = getCloudinaryPublicId(imageUrl);
    if (publicId) {
      try {
        await deleteCloudinaryImageAction(publicId);
      } catch (err) {
        toast.error("Failed to delete image from Cloudinary");
      }
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
    setRemovingImageIdx(null);
  };

  // Remove thumbnail from Cloudinary and state
  const handleRemoveThumbnail = async () => {
    setRemovingThumbnail(true);
    if (thumbnail) {
      const publicId = getCloudinaryPublicId(thumbnail);
      if (publicId) {
        try {
          await deleteCloudinaryImageAction(publicId);
        } catch (err) {
          toast.error("Failed to delete thumbnail from Cloudinary");
        }
      }
      setThumbnail(null);
    }
    setRemovingThumbnail(false);
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
    if (!productFileKey) {
      toast.error("Please upload a product file");
      return;
    }

    setIsLoading(true);

    try {
      const productData: UpdateProductData = {
        id: String(productId),
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
        file: productFileKey,
      };

      const result = await updateProduct(productData);

      if (result.success) {
        toast.success(
          `Product ${
            status === "published" ? "published" : "saved as draft"
          } successfully!`
        );
        if (onClose) onClose();
      } else {
        toast.error(result.error || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = () => {
    window.open(`/product/${productId}`, "_blank");
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <Loader2 className="animate-spin w-4 h-4 " />
        <p className="text-muted-foreground mt-2">Loading product...</p>
      </div>
    );
  }
  return (
    <div className="w-full font-sans px-2 sm:px-4 md:px-6">
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

      <div className="flex flex-col gap-4 mb-6 ">
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
          {/* <Button variant="outline" onClick={handlePreview}>
      Preview
    </Button> */}
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
              "Update"
            )}
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
                        onClick={handleRemoveThumbnail}
                        disabled={removingThumbnail}
                      >
                        {removingThumbnail ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
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
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={async () => await handleRemoveImage(idx)}
                        disabled={removingImageIdx === idx}
                      >
                        {removingImageIdx === idx ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
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
                      ref={additionalImagesInputRef}
                      disabled={images.length >= 5}
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
              value={formData.videoUrl}
              onChange={(e) => handleInputChange("videoUrl", e.target.value)}
              type="url"
            />
            {formData.videoUrl && !isValidYouTubeUrl(formData.videoUrl) && (
              <p className="text-xs text-destructive">
                Please enter a valid YouTube video URL.
              </p>
            )}
          </div>
          {/* Product File Upload */}
          <FileUploadCard
            productFileKey={productFileKey}
            setProductFileKey={setProductFileKey}
            productFile={productFile}
            setProductFile={setProductFile}
            initialFileName={initialFileName}
          />
        </div>
        {/* Live Preview Section */}
        <div className="hidden lg:block">
          <ProductPreview
            formData={formData}
            tags={tags}
            thumbnail={thumbnail}
            images={images}
            gameOptions={gameOptions}
            categoryOptions={categoryOptions}
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
          gameOptions={gameOptions}
          categoryOptions={categoryOptions}
        />
      </div>
      <div className="py-4 space-x-3">
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
          {isLoading ? <Loader2 className="animate-spin w-4 h-4 " /> : "Update"}
        </Button>
      </div>
    </div>
  );
}
