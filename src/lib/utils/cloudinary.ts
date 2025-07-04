// src/lib/utils/cloudinary.ts
export function getCloudinaryPublicId(url: string): string | null {
  try {
    const parts = url.split("/");
    const versionIndex = parts.findIndex((p) => p.startsWith("v"));
    if (versionIndex === -1) return null;
    const fileWithExt = parts.slice(versionIndex + 1).join("/");
    const file = fileWithExt.replace(/\.[^/.]+$/, "");
    return file;
  } catch {
    return null;
  }
}
