import {
  pgTable,
  unique,
  text,
  boolean,
  timestamp,
  foreignKey,
  integer,
  serial,
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

export const product = pgTable("product", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  imageUrl: text("image_url"),
  description: text("description"),
  price: integer("price").notNull(),
  originalPrice: integer("original_price"),
  uploadedAt: timestamp("uploaded_at", { mode: "string" }).notNull(),
  rating: integer("rating"),
  featured: boolean("featured").notNull().default(false),
  userId: text("user_id").notNull(),
  username: text("username"),
  userAvatar: text("user_avatar"),
  likes: integer("likes").notNull().default(0),
  views: integer("views").notNull().default(0),
});

export const tag = pgTable("tag", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const productTag = pgTable(
  "product_tag",
  {
    productId: integer("product_id").notNull(),
    tagId: integer("tag_id").notNull(),
  },
  (table) => [
    foreignKey({ columns: [table.productId], foreignColumns: [product.id] }),
    foreignKey({ columns: [table.tagId], foreignColumns: [tag.id] }),
    unique("product_tag_unique").on(table.productId, table.tagId),
  ]
);
