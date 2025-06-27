// Cloudinary upload helper for client-side usage
// Usage: await uploadToCloudinary(file, 'your_upload_preset')
export async function uploadToCloudinary(file: File, uploadPreset: string) {
  const url =
    "https://api.cloudinary.com/v1_1/" +
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME +
    "/image/upload";
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Cloudinary upload failed");
  return res.json(); // contains .secure_url
}
