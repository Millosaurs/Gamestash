"use server";
import { deleteFromCloudinary } from "@/lib/actions/cloudinary";

export async function deleteCloudinaryImageAction(publicId: string) {
  return await deleteFromCloudinary(publicId);
}
