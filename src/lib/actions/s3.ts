// src/app/actions/s3Presign.ts

"use server";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const MAX_SIZE_BYTES = 100 * 1024 * 1024;
const ALLOWED_TYPES = [
  "application/zip",
  "application/x-zip-compressed",
  "multipart/x-zip",
  "application/octet-stream",
  "application/x-rar-compressed",
];

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function getPresignedUploadUrl(
  filename: string,
  filetype: string,
  filesize: number
): Promise<{ url: string; key: string }> {
  if (!ALLOWED_TYPES.includes(filetype))
    throw new Error("File type not allowed");
  if (filesize > MAX_SIZE_BYTES) throw new Error("File too large");

  const key = `products/${Date.now()}-${filename}`;
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: key,
    ContentType: filetype,
  });
  const url = await getSignedUrl(s3, command, { expiresIn: 60 });
  return { url, key };
}

export async function deleteS3Object(key: string) {
  if (!key) return;
  try {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: key,
      })
    );
  } catch (err) {
    console.error("Failed to delete S3 object:", err);
    throw err;
  }
}
