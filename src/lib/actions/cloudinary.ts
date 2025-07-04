"use server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function deleteFromCloudinary(publicId: string) {
  if (!publicId) throw new Error("No Cloudinary public ID provided");
  try {
    await cloudinary.uploader.destroy(publicId);
    return { success: true };
  } catch (err) {
    console.error("Failed to delete Cloudinary image:", err);
    return { success: false, error: "Failed to delete from Cloudinary" };
  }
}

// Helper to extract publicId from a Cloudinary URL
