-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"image" text,
	"emailVerified" boolean NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"totalProducts" integer DEFAULT 0 NOT NULL,
	"totalSales" integer DEFAULT 0 NOT NULL,
	"totalRevenue" integer DEFAULT 0 NOT NULL,
	"totalViews" integer DEFAULT 0 NOT NULL,
	"username" text,
	"displayName" text,
	"bio" text,
	"location" text,
	"website" text,
	"twitterUrl" text,
	"instagramUrl" text,
	"youtubeUrl" text,
	"twitchUrl" text,
	"verified" boolean DEFAULT false,
	"featured" boolean DEFAULT false,
	"isDeveloper" boolean DEFAULT false,
	"specialties" text[],
	"totalLikes" integer DEFAULT 0 NOT NULL,
	"rating" numeric(2, 1) DEFAULT '0.0',
	"profileVisibility" text DEFAULT 'public',
	"emailNotifications" boolean DEFAULT true,
	"pushNotifications" boolean DEFAULT false,
	"marketingEmails" boolean DEFAULT false,
	"role" text DEFAULT 'user' NOT NULL,
	"banned" boolean DEFAULT false NOT NULL,
	"stripeAccountId" text,
	CONSTRAINT "user_email_key" UNIQUE("email"),
	CONSTRAINT "user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"token" text NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"ipAddress" text,
	"userAgent" text,
	"userId" text NOT NULL,
	CONSTRAINT "session_token_key" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"userId" text NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"idToken" text,
	"accessTokenExpiresAt" timestamp,
	"refreshTokenExpiresAt" timestamp,
	"scope" text,
	"password" text,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"createdAt" timestamp,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "product_sales" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"buyer_id" text NOT NULL,
	"seller_id" text NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"status" text DEFAULT 'completed' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"refunded" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "daily_analytics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" timestamp NOT NULL,
	"product_id" uuid NOT NULL,
	"views" integer DEFAULT 0,
	"likes" integer DEFAULT 0,
	"sales" integer DEFAULT 0,
	"revenue" numeric(10, 2) DEFAULT '0.00',
	CONSTRAINT "daily_analytics_unique" UNIQUE("date","product_id")
);
--> statement-breakpoint
CREATE TABLE "product_views" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"user_id" text,
	"ip_address" text,
	"user_agent" text,
	"referrer" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "product_approvals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"admin_id" text NOT NULL,
	"status" text NOT NULL,
	"comment" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "admin_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admin_id" text NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "admin_sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"thumbnail" text,
	"price" numeric(10, 2) NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"views" integer DEFAULT 0,
	"likes" integer DEFAULT 0,
	"sales" integer DEFAULT 0,
	"tags" text[],
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"description" text NOT NULL,
	"images" text[],
	"game" text,
	"category" text,
	"featured" boolean DEFAULT false,
	"rating" numeric(2, 1) DEFAULT '0.0',
	"revenue" integer DEFAULT 0,
	"video_url" text,
	"original_price" numeric(10, 2),
	"approved" boolean DEFAULT false NOT NULL,
	"rejected" boolean DEFAULT false NOT NULL,
	"admin_comment" text
);
--> statement-breakpoint
CREATE TABLE "admin_credentials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"password_hash" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "admin_credentials_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "product_likes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"product_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "product_likes_unique" UNIQUE("user_id","product_id")
);
--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_sales" ADD CONSTRAINT "product_sales_buyer_id_user_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_sales" ADD CONSTRAINT "product_sales_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_sales" ADD CONSTRAINT "product_sales_seller_id_user_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_analytics" ADD CONSTRAINT "daily_analytics_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_views" ADD CONSTRAINT "product_views_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_views" ADD CONSTRAINT "product_views_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_approvals" ADD CONSTRAINT "product_approvals_admin_id_user_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_approvals" ADD CONSTRAINT "product_approvals_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_sessions" ADD CONSTRAINT "admin_sessions_admin_id_user_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_credentials" ADD CONSTRAINT "admin_credentials_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_likes" ADD CONSTRAINT "product_likes_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_likes" ADD CONSTRAINT "product_likes_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "product_sales_created_at_idx" ON "product_sales" USING btree ("created_at" timestamp_ops);--> statement-breakpoint
CREATE INDEX "product_sales_product_id_idx" ON "product_sales" USING btree ("product_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "product_sales_seller_id_idx" ON "product_sales" USING btree ("seller_id" text_ops);--> statement-breakpoint
CREATE INDEX "daily_analytics_date_idx" ON "daily_analytics" USING btree ("date" timestamp_ops);--> statement-breakpoint
CREATE INDEX "daily_analytics_product_id_idx" ON "daily_analytics" USING btree ("product_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "product_views_created_at_idx" ON "product_views" USING btree ("created_at" timestamp_ops);--> statement-breakpoint
CREATE INDEX "product_views_product_id_idx" ON "product_views" USING btree ("product_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "product_likes_product_id_idx" ON "product_likes" USING btree ("product_id" uuid_ops);
*/