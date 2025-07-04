import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { db } from "@/db";
import { products, productSales } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Get the product ID from the URL
    const id = request.nextUrl.pathname.split("/").at(-2); // /api/products/[id]/download

    if (!id) {
      return NextResponse.json(
        { error: "Missing product ID" },
        { status: 400 }
      );
    }

    // Get session using Better Auth
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Fetch the product by ID
    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    if (!product.length) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Check if the user has purchased the product
    const hasPurchased = await db
      .select()
      .from(productSales)
      .where(
        and(
          eq(productSales.productId, id),
          eq(productSales.buyerId, session.user.id),
          eq(productSales.status, "completed")
        )
      )
      .limit(1);

    if (!hasPurchased.length) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Get the file key from the product
    const fileKey = product[0].file;
    if (!fileKey) {
      return NextResponse.json({ error: "No file" }, { status: 404 });
    }

    // Generate a presigned S3 download URL
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: fileKey,
    });
    const url = await getSignedUrl(s3, command, { expiresIn: 60 });

    // Redirect the user to the presigned URL
    return NextResponse.redirect(url);
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
