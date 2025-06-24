import {
  pgTable,
  unique,
  text,
  boolean,
  timestamp,
  foreignKey,
  integer,
  serial,
  uuid,
  decimal,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const user = pgTable(
  "user",
  {
    id: text().primaryKey().notNull(),
    name: text().notNull(),
    email: text().notNull(),
    emailVerified: boolean().notNull(),
    image: text(),
    createdAt: timestamp({ mode: "string" }).notNull(),
    updatedAt: timestamp({ mode: "string" }).notNull(),
    totalProducts: integer().notNull().default(0),
    totalSales: integer().notNull().default(0),
    totalRevenue: integer().notNull().default(0),
    totalViews: integer().notNull().default(0),
    username: text().unique(), // @username for developers
    displayName: text(), // Display name (defaults to name if not set)
    bio: text(),
    location: text(),
    website: text(),

    // Social links
    twitterUrl: text(),
    instagramUrl: text(),
    youtubeUrl: text(),
    twitchUrl: text(),

    // Developer status
    verified: boolean().default(false),
    featured: boolean().default(false),
    isDeveloper: boolean().default(false),

    // Specialties
    specialties: text().array(), // ["RGB", "Gaming", "Minimal"]

    // Add missing stats
    totalLikes: integer().notNull().default(0),
    rating: decimal("rating", { precision: 2, scale: 1 }).default("0.0"),

    // Settings
    profileVisibility: text().default("public"),
    emailNotifications: boolean().default(true),
    pushNotifications: boolean().default(false),
    marketingEmails: boolean().default(false),
  },
  (table) => [unique("user_email_key").on(table.email)]
);

export const session = pgTable(
  "session",
  {
    id: text().primaryKey().notNull(),
    expiresAt: timestamp({ mode: "string" }).notNull(),
    token: text().notNull(),
    createdAt: timestamp({ mode: "string" }).notNull(),
    updatedAt: timestamp({ mode: "string" }).notNull(),
    ipAddress: text(),
    userAgent: text(),
    userId: text().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "session_userId_fkey",
    }),
    unique("session_token_key").on(table.token),
  ]
);

export const account = pgTable(
  "account",
  {
    id: text().primaryKey().notNull(),
    accountId: text().notNull(),
    providerId: text().notNull(),
    userId: text().notNull(),
    accessToken: text(),
    refreshToken: text(),
    idToken: text(),
    accessTokenExpiresAt: timestamp({ mode: "string" }),
    refreshTokenExpiresAt: timestamp({ mode: "string" }),
    scope: text(),
    password: text(),
    createdAt: timestamp({ mode: "string" }).notNull(),
    updatedAt: timestamp({ mode: "string" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "account_userId_fkey",
    }),
  ]
);

export const verification = pgTable("verification", {
  id: text().primaryKey().notNull(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp({ mode: "string" }).notNull(),
  createdAt: timestamp({ mode: "string" }),
  updatedAt: timestamp({ mode: "string" }),
});

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .references(() => user.id)
    .notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  thumbnail: text("thumbnail"),
  images: text("images").array(), // Array of image URLs
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  game: text("game"), // minecraft, roblox, etc.
  category: text("category"), // rgb, minimal, etc.
  status: text("status").notNull().default("draft"), // 'draft' | 'published'
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  sales: integer("sales").default(0),
  tags: text("tags").array(), // PostgreSQL array
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }), // For discounts
  featured: boolean("featured").default(false),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("0.0"),
  revenue: integer("revenue").default(0),
  videoUrl: text("video_url"), // Optional video URL for product showcase
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// For view tracking
export const productViews = pgTable(
  "product_views",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .references(() => products.id)
      .notNull(),
    userId: text("user_id").references(() => user.id), // null for anonymous views
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    referrer: text("referrer"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("product_views_product_id_idx").on(table.productId),
    index("product_views_created_at_idx").on(table.createdAt),
  ]
);

// For likes tracking
export const productLikes = pgTable(
  "product_likes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .references(() => products.id)
      .notNull(),
    userId: text("user_id")
      .references(() => user.id)
      .notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    unique("product_likes_unique").on(table.productId, table.userId),
    index("product_likes_product_id_idx").on(table.productId),
  ]
);

export const productSales = pgTable(
  "product_sales",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .references(() => products.id)
      .notNull(),
    buyerId: text("buyer_id")
      .references(() => user.id)
      .notNull(),
    sellerId: text("seller_id")
      .references(() => user.id)
      .notNull(),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    status: text("status").notNull().default("completed"), // 'pending', 'completed', 'refunded'
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("product_sales_product_id_idx").on(table.productId),
    index("product_sales_seller_id_idx").on(table.sellerId),
    index("product_sales_created_at_idx").on(table.createdAt),
  ]
);

// Daily analytics aggregation
export const dailyAnalytics = pgTable(
  "daily_analytics",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    date: timestamp("date").notNull(),
    productId: uuid("product_id")
      .references(() => products.id)
      .notNull(),
    views: integer("views").default(0),
    likes: integer("likes").default(0),
    sales: integer("sales").default(0),
    revenue: decimal("revenue", { precision: 10, scale: 2 }).default("0.00"),
  },
  (table) => [
    unique("daily_analytics_unique").on(table.date, table.productId),
    index("daily_analytics_product_id_idx").on(table.productId),
    index("daily_analytics_date_idx").on(table.date),
  ]
);
