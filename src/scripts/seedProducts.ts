// scripts/seedProducts.ts
import { db } from "@/db"; // your drizzle db instance
import { product, tag, productTag } from "@/db/schema";
import { eq } from "drizzle-orm";

// Paste your mockProducts array here (from your original code)
const mockProducts = [
  {
    id: 1,
    title: "Ultimate Minecraft RGB Battlestation",
    imageUrl:
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=600&h=400&fit=crop&q=80",
    username: "NeonGamer",
    userAvatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=face",
    likes: 1247,
    views: 12450,
    tags: ["Minecraft", "RGB"],
    price: 1299,
    originalPrice: 1499,
    uploadedAt: "2 hours ago",
    rating: 4.8,
    featured: true,
    description:
      "A vibrant RGB setup designed for ultimate Minecraft gaming with high-end peripherals and immersive lighting.",
  },
  {
    id: 2,
    title: "Roblox Creator Studio Setup",
    imageUrl:
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=400&fit=crop&q=80",
    username: "CleanDesk",
    userAvatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face",
    likes: 892,
    views: 7430,
    tags: ["Roblox", "Minimal"],
    price: 999,
    uploadedAt: "5 hours ago",
    rating: 4.6,
    featured: false,
    description:
      "A clean and minimal desk setup optimized for Roblox game development and creator workflows.",
  },
  {
    id: 3,
    title: "Minecraft Modded Gaming Station",
    imageUrl:
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop&q=80",
    username: "CozyStreamer",
    userAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
    likes: 567,
    views: 5210,
    tags: ["Minecraft", "Cozy"],
    price: 799,
    uploadedAt: "1 day ago",
    rating: 4.4,
    featured: false,
    description:
      "A cozy gaming station tailored for modded Minecraft adventures with comfortable seating and ambient lighting.",
  },
  {
    id: 4,
    title: "Rust Survival Gaming Setup with Dual Monitors",
    imageUrl:
      "https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=600&h=400&fit=crop&q=80",
    username: "CreatorPro",
    userAvatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
    likes: 2034,
    views: 18470,
    tags: ["Rust", "Professional"],
    price: 1499,
    uploadedAt: "3 hours ago",
    rating: 4.9,
    featured: true,
    description:
      "Professional-grade Rust gaming setup featuring dual monitors for enhanced visibility and productivity.",
  },
  {
    id: 5,
    title: "Roblox Kid's RGB Gaming Setup",
    imageUrl:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop&q=80",
    username: "RetroKing",
    userAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face",
    likes: 1560,
    views: 9820,
    tags: ["Roblox", "Budget"],
    price: 499,
    uploadedAt: "6 hours ago",
    rating: 4.2,
    featured: false,
    description:
      "An affordable RGB gaming setup perfect for kids who love playing Roblox with style and comfort.",
  },
  {
    id: 6,
    title: "FiveM Roleplay Command Center",
    imageUrl:
      "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=600&h=400&fit=crop&q=80",
    username: "TechMaster",
    userAvatar:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=32&h=32&fit=crop&crop=face",
    likes: 3240,
    views: 26530,
    tags: ["FiveM", "High-end"],
    price: 1799,
    uploadedAt: "4 hours ago",
    rating: 4.7,
    featured: true,
    description:
      "High-end command center built for FiveM roleplay enthusiasts with premium gear and immersive experience.",
  },
  {
    id: 7,
    title: "Minimalist Rust Gaming Setup",
    imageUrl:
      "https://images.unsplash.com/photo-1541746972996-4e0b0f93e586?w=600&h=400&fit=crop&q=80",
    username: "WhiteSpace",
    userAvatar:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=32&h=32&fit=crop&crop=face",
    likes: 1890,
    views: 15200,
    tags: ["Rust", "Minimal"],
    price: 1199,
    uploadedAt: "1 day ago",
    rating: 4.5,
    featured: false,
    description:
      "A clean and minimalist gaming setup ideal for Rust players who prefer simplicity and performance.",
  },
  {
    id: 8,
    title: "Budget FiveM Racing Setup",
    imageUrl:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop&q=80",
    username: "BudgetGamer",
    userAvatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face",
    likes: 2340,
    views: 28900,
    tags: ["FiveM", "Budget"],
    price: 399,
    uploadedAt: "2 days ago",
    rating: 4.3,
    featured: false,
    description:
      "A budget-friendly racing setup built for FiveM players looking for performance without breaking the bank.",
  },
];

async function seed() {
  for (const prod of mockProducts) {
    // Insert product
    const [insertedProduct] = await db
      .insert(product)
      .values({
        title: prod.title,
        imageUrl: prod.imageUrl,
        description: prod.description,
        price: prod.price,
        originalPrice: prod.originalPrice,
        uploadedAt: new Date().toISOString(), // or parse prod.uploadedAt
        rating: Math.round(prod.rating * 10), // store as int if you want
        featured: prod.featured,
        userId: "demo-user-id", // replace with actual user id
        username: prod.username,
        userAvatar: prod.userAvatar,
        likes: prod.likes,
        views: prod.views,
      })
      .returning();

    // Insert tags and productTag
    for (const tagName of prod.tags) {
      let [tagRow] = await db.select().from(tag).where(eq(tag.name, tagName));
      if (!tagRow) {
        [tagRow] = await db.insert(tag).values({ name: tagName }).returning();
      }
      await db.insert(productTag).values({
        productId: insertedProduct.id,
        tagId: tagRow.id,
      });
    }
  }
}

seed().then(() => {
  console.log("Seeded products!");
  process.exit(0);
});
