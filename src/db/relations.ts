import { relations } from "drizzle-orm/relations";
import { user, session, account, productSales, products, dailyAnalytics, productViews, productApprovals, adminSessions, adminCredentials, productLikes } from "./schema";

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	sessions: many(session),
	accounts: many(account),
	productSales_buyerId: many(productSales, {
		relationName: "productSales_buyerId_user_id"
	}),
	productSales_sellerId: many(productSales, {
		relationName: "productSales_sellerId_user_id"
	}),
	productViews: many(productViews),
	productApprovals: many(productApprovals),
	adminSessions: many(adminSessions),
	products: many(products),
	adminCredentials: many(adminCredentials),
	productLikes: many(productLikes),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const productSalesRelations = relations(productSales, ({one}) => ({
	user_buyerId: one(user, {
		fields: [productSales.buyerId],
		references: [user.id],
		relationName: "productSales_buyerId_user_id"
	}),
	product: one(products, {
		fields: [productSales.productId],
		references: [products.id]
	}),
	user_sellerId: one(user, {
		fields: [productSales.sellerId],
		references: [user.id],
		relationName: "productSales_sellerId_user_id"
	}),
}));

export const productsRelations = relations(products, ({one, many}) => ({
	productSales: many(productSales),
	dailyAnalytics: many(dailyAnalytics),
	productViews: many(productViews),
	productApprovals: many(productApprovals),
	user: one(user, {
		fields: [products.userId],
		references: [user.id]
	}),
	productLikes: many(productLikes),
}));

export const dailyAnalyticsRelations = relations(dailyAnalytics, ({one}) => ({
	product: one(products, {
		fields: [dailyAnalytics.productId],
		references: [products.id]
	}),
}));

export const productViewsRelations = relations(productViews, ({one}) => ({
	product: one(products, {
		fields: [productViews.productId],
		references: [products.id]
	}),
	user: one(user, {
		fields: [productViews.userId],
		references: [user.id]
	}),
}));

export const productApprovalsRelations = relations(productApprovals, ({one}) => ({
	user: one(user, {
		fields: [productApprovals.adminId],
		references: [user.id]
	}),
	product: one(products, {
		fields: [productApprovals.productId],
		references: [products.id]
	}),
}));

export const adminSessionsRelations = relations(adminSessions, ({one}) => ({
	user: one(user, {
		fields: [adminSessions.adminId],
		references: [user.id]
	}),
}));

export const adminCredentialsRelations = relations(adminCredentials, ({one}) => ({
	user: one(user, {
		fields: [adminCredentials.userId],
		references: [user.id]
	}),
}));

export const productLikesRelations = relations(productLikes, ({one}) => ({
	product: one(products, {
		fields: [productLikes.productId],
		references: [products.id]
	}),
	user: one(user, {
		fields: [productLikes.userId],
		references: [user.id]
	}),
}));