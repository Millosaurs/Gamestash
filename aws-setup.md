# AWS S3 PRODUCT FILE UPLOAD & SECURE DOWNLOAD IN NEXT.JS 15

## STEP 1: CREATE AN S3 BUCKET FOR PRODUCT FILES

1. Go to [https://s3.console.aws.amazon.com/s3/home](https://s3.console.aws.amazon.com/s3/home)
2. Click "Create bucket"
3. Enter a unique bucket name (e.g. my-product-files-123)
4. Choose your AWS region
5. Leave "Block all public access" checked (recommended for private files)
6. Click "Create bucket"

## STEP 2: SET BUCKET CORS POLICY FOR BROWSER UPLOADS

- Go to your bucket > Permissions > CORS configuration
- Paste this (replace the AllowedOrigins with your frontend URL):

```
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT", "POST", "GET"],
    "AllowedOrigins": ["https://your-frontend-domain.com"],
    "ExposeHeaders": []
  }
]
```

Explanation:
This allows your frontend to upload files directly to S3 using presigned URLs.

## STEP 3: CREATE AN AWS USER FOR S3 ACCESS

1. Go to [https://console.aws.amazon.com/iam/home#/users](https://console.aws.amazon.com/iam/home#/users)
2. Click "Add users"
3. Enter a username (e.g. s3-uploader)
4. Select "Programmatic access"
5. Click "Next" until "Permissions"
6. Attach policy: "AmazonS3FullAccess" (or a custom policy for your bucket)
7. Finish and download the Access Key ID and Secret Access Key

## STEP 4: INSTALL AWS SDK IN YOUR PROJECT

```
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

## STEP 5: CONFIGURE ENVIRONMENT VARIABLES

Add the following to your `.env.local`:

```
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=your-region
AWS_S3_BUCKET=your-bucket-name
```

## STEP 6: MODIFY YOUR DRIZZLE PRODUCTS TABLE

```ts
// src/db/schema.ts
file: text("file"),
```

## STEP 7: UPDATE PRODUCT TYPES AND ACTIONS

```ts
// src/lib/actions/products.ts

// Product type and interfaces

type Product = {
  // ...existing fields
  file: string | null;
};

export interface CreateProductData {
  // ...existing fields
  file?: string | null;
}

export interface UpdateProductData extends CreateProductData {
  id: string;
}

// Create and update logic

const newProduct = await db
  .insert(products)
  .values({
    // ...other fields
    file: data.file,
  })
  .returning();

const updatedProduct = await db
  .update(products)
  .set({
    // ...other fields
    file: data.file,
    updatedAt: new Date().toISOString(),
  })
  .where(eq(products.id, data.id))
  .returning();
```

## STEP 8: CREATE A SERVER ACTION FOR PRESIGNED UPLOAD URL

```ts
// src/app/actions/s3Presign.ts

"use server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const MAX_SIZE_BYTES = 100 * 1024 * 1024;
const ALLOWED_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "application/zip",
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
```

## STEP 9: FRONTEND FILE UPLOAD FLOW

```tsx
// src/app/products/create/page.tsx

"use client";
import { useState } from "react";
import { getPresignedUploadUrl } from "@/app/actions/s3Presign";
import { createProduct } from "@/lib/actions/products";

const MAX_SIZE_MB = 100;
const ALLOWED_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "application/zip",
];

export default function ProductCreatePage() {
  const [file, setFile] = useState<File | null>(null);
  const [fileKey, setFileKey] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;

    if (!ALLOWED_TYPES.includes(f.type)) return alert("Invalid file type!");
    if (f.size > MAX_SIZE_MB * 1024 * 1024) return alert("File too large!");

    setUploading(true);
    try {
      const { url, key } = await getPresignedUploadUrl(f.name, f.type, f.size);
      await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": f.type },
        body: f,
      });
      setFileKey(key);
      setFile(f);
      alert("File uploaded!");
    } catch (err: any) {
      alert(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fileKey) return alert("Please upload a file");

    await createProduct({ file: fileKey });
    // redirect or success logic
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        accept={ALLOWED_TYPES.join(",")}
        onChange={handleFileChange}
        disabled={uploading}
      />
      {uploading && <p>Uploading...</p>}
      <button type="submit" disabled={uploading}>
        Create Product
      </button>
    </form>
  );
}
```

## STEP 10: SECURE DOWNLOAD ENDPOINT FOR BUYERS

```ts
// src/app/api/products/[id]/download/route.ts

import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { db, products, productSales } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getSession } from "@/auth";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const session = await getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const product = await db
    .select()
    .from(products)
    .where(eq(products.id, params.id))
    .limit(1);
  if (!product.length)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const hasPurchased = await db
    .select()
    .from(productSales)
    .where(
      and(
        eq(productSales.productId, params.id),
        eq(productSales.buyerId, session.user.id),
        eq(productSales.status, "completed")
      )
    )
    .limit(1);

  if (!hasPurchased.length)
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const fileKey = product[0].file;
  if (!fileKey) return NextResponse.json({ error: "No file" }, { status: 404 });

  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: fileKey,
  });
  const url = await getSignedUrl(s3, command, { expiresIn: 60 });

  return NextResponse.redirect(url);
}
```

## STEP 11: FRONTEND DOWNLOAD BUTTON FOR BUYERS

```tsx
<a href={`/api/products/${product.id}/download`} target="_blank" rel="noopener">
  Download Product
</a>
```

This setup ensures a secure, scalable file delivery system using AWS S3 and presigned URLs in a Next.js 15 project.
