import {
  pgTable,
  unique,
  text,
  boolean,
  timestamp,
  integer,
  numeric,
  foreignKey,
  index,
  uuid,
  serial,
  varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const user = pgTable(
  "user",
  {
    id: text().primaryKey().notNull(),
    name: text().notNull(),
    email: text().notNull(),
    image: text(),
    emailVerified: boolean().notNull(),
    createdAt: timestamp({ mode: "string" }).notNull(),
    updatedAt: timestamp({ mode: "string" }).notNull(),
    totalProducts: integer().default(0).notNull(),
    totalSales: integer().default(0).notNull(),
    totalRevenue: integer().default(0).notNull(),
    totalViews: integer().default(0).notNull(),
    username: text(),
    displayName: text(),
    bio: text(),
    location: text(),
    website: text(),
    twitterUrl: text(),
    instagramUrl: text(),
    youtubeUrl: text(),
    twitchUrl: text(),
    verified: boolean().default(false),
    featured: boolean().default(false),
    isDeveloper: boolean().default(false),
    specialties: text().array(),
    totalLikes: integer().default(0).notNull(),
    rating: numeric({ precision: 2, scale: 1 }).default("0.0"),
    profileVisibility: text().default("public"),
    emailNotifications: boolean().default(true),
    pushNotifications: boolean().default(false),
    marketingEmails: boolean().default(false),
    role: text().default("user").notNull(),
    banned: boolean().default(false).notNull(),
    stripeAccountId: text(),
    connectDate: timestamp({ mode: "string" }).defaultNow(),
  },
  (table) => [
    unique("user_email_key").on(table.email),
    unique("user_username_unique").on(table.username),
  ]
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

export const adminCredentials = pgTable(
  "admin_credentials",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    username: text().notNull(),
    passwordHash: text("password_hash").notNull(),
    userId: text("user_id").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "admin_credentials_user_id_user_id_fk",
    }),
    unique("admin_credentials_username_unique").on(table.username),
  ]
);

export const adminSessions = pgTable(
  "admin_sessions",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    adminId: text("admin_id").notNull(),
    token: text().notNull(),
    expiresAt: timestamp("expires_at", { mode: "string" }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.adminId],
      foreignColumns: [user.id],
      name: "admin_sessions_admin_id_user_id_fk",
    }),
    unique("admin_sessions_token_unique").on(table.token),
  ]
);

export const productSales = pgTable(
  "product_sales",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    productId: uuid("product_id").notNull(),
    buyerId: text("buyer_id").notNull(),
    sellerId: text("seller_id").notNull(),
    amount: numeric({ precision: 10, scale: 2 }).notNull(),
    status: text().default("completed").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    refunded: boolean().default(false).notNull(),
    consentGiven: boolean().default(false).notNull(),
    stripePaymentIntentId: text("stripe_payment_intent_id"),
  },
  (table) => [
    index("product_sales_created_at_idx").using(
      "btree",
      table.createdAt.asc().nullsLast().op("timestamp_ops")
    ),
    index("product_sales_product_id_idx").using(
      "btree",
      table.productId.asc().nullsLast().op("uuid_ops")
    ),
    index("product_sales_seller_id_idx").using(
      "btree",
      table.sellerId.asc().nullsLast().op("text_ops")
    ),
    foreignKey({
      columns: [table.buyerId],
      foreignColumns: [user.id],
      name: "product_sales_buyer_id_user_id_fk",
    }),
    foreignKey({
      columns: [table.productId],
      foreignColumns: [products.id],
      name: "product_sales_product_id_products_id_fk",
    }),
    foreignKey({
      columns: [table.sellerId],
      foreignColumns: [user.id],
      name: "product_sales_seller_id_user_id_fk",
    }),
  ]
);

export const dailyAnalytics = pgTable(
  "daily_analytics",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    date: timestamp({ mode: "string" }).notNull(),
    productId: uuid("product_id").notNull(),
    views: integer().default(0),
    likes: integer().default(0),
    sales: integer().default(0),
    revenue: numeric({ precision: 10, scale: 2 }).default("0.00"),
  },
  (table) => [
    index("daily_analytics_date_idx").using(
      "btree",
      table.date.asc().nullsLast().op("timestamp_ops")
    ),
    index("daily_analytics_product_id_idx").using(
      "btree",
      table.productId.asc().nullsLast().op("uuid_ops")
    ),
    foreignKey({
      columns: [table.productId],
      foreignColumns: [products.id],
      name: "daily_analytics_product_id_products_id_fk",
    }),
    unique("daily_analytics_unique").on(table.date, table.productId),
  ]
);

export const productViews = pgTable(
  "product_views",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    productId: uuid("product_id").notNull(),
    userId: text("user_id"),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    referrer: text(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  },
  (table) => [
    index("product_views_created_at_idx").using(
      "btree",
      table.createdAt.asc().nullsLast().op("timestamp_ops")
    ),
    index("product_views_product_id_idx").using(
      "btree",
      table.productId.asc().nullsLast().op("uuid_ops")
    ),
    foreignKey({
      columns: [table.productId],
      foreignColumns: [products.id],
      name: "product_views_product_id_products_id_fk",
    }),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "product_views_user_id_user_id_fk",
    }),
  ]
);

export const productApprovals = pgTable(
  "product_approvals",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    productId: uuid("product_id").notNull(),
    adminId: text("admin_id").notNull(),
    status: text().notNull(),
    comment: text(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.adminId],
      foreignColumns: [user.id],
      name: "product_approvals_admin_id_user_id_fk",
    }),
    foreignKey({
      columns: [table.productId],
      foreignColumns: [products.id],
      name: "product_approvals_product_id_products_id_fk",
    }),
  ]
);

export const products = pgTable(
  "products",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: text("user_id").notNull(),
    title: text().notNull(),
    thumbnail: text(),
    price: numeric({ precision: 10, scale: 2 }).notNull(),
    status: text().default("draft").notNull(),
    views: integer().default(0),
    likes: integer().default(0),
    sales: integer().default(0),
    tags: text().array(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
    description: text().notNull(),
    images: text().array(),
    game: text(),
    category: text(),
    featured: boolean().default(false),
    rating: numeric({ precision: 2, scale: 1 }).default("0.0"),
    revenue: integer().default(0),
    videoUrl: text("video_url"),
    originalPrice: numeric("original_price", { precision: 10, scale: 2 }),
    approved: boolean().default(false).notNull(),
    rejected: boolean().default(false).notNull(),
    adminComment: text("admin_comment"),
    file: text("file"),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "products_user_id_user_id_fk",
    }),
  ]
);

export const productLikes = pgTable(
  "product_likes",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: text("user_id").notNull(),
    productId: uuid("product_id").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  },
  (table) => [
    index("product_likes_product_id_idx").using(
      "btree",
      table.productId.asc().nullsLast().op("uuid_ops")
    ),
    foreignKey({
      columns: [table.productId],
      foreignColumns: [products.id],
      name: "product_likes_product_id_products_id_fk",
    }),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "product_likes_user_id_user_id_fk",
    }),
    unique("product_likes_unique").on(table.userId, table.productId),
  ]
);

export const tos = pgTable("tos", {
  id: uuid("id").primaryKey().defaultRandom(),
  content: text("content").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  value: varchar("value", { length: 64 }).notNull().unique(),
  label: varchar("label", { length: 128 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  value: varchar("value", { length: 64 }).notNull().unique(),
  label: varchar("label", { length: 128 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const specialties = pgTable("specialties", {
  id: serial("id").primaryKey(),
  value: varchar("value", { length: 64 }).notNull().unique(),
  label: varchar("label", { length: 128 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
