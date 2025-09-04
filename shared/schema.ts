import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletAddress: text("wallet_address").notNull().unique(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const tokens = pgTable("tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  address: text("address").notNull().unique(),
  name: text("name").notNull(),
  symbol: text("symbol").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  creatorId: varchar("creator_id").references(() => users.id).notNull(),
  totalSupply: decimal("total_supply", { precision: 78, scale: 0 }).notNull(),
  virtualOkb: decimal("virtual_okb", { precision: 78, scale: 18 }).notNull(),
  virtualTokens: decimal("virtual_tokens", { precision: 78, scale: 18 }).notNull(),
  isGraduated: boolean("is_graduated").default(false),
  graduatedAt: timestamp("graduated_at"),
  currentPrice: decimal("current_price", { precision: 78, scale: 18 }),
  marketCap: decimal("market_cap", { precision: 78, scale: 18 }),
  volume24h: decimal("volume_24h", { precision: 78, scale: 18 }).default('0'),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const trades = pgTable("trades", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tokenId: varchar("token_id").references(() => tokens.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  type: text("type", { enum: ["buy", "sell"] }).notNull(),
  okbAmount: decimal("okb_amount", { precision: 78, scale: 18 }).notNull(),
  tokenAmount: decimal("token_amount", { precision: 78, scale: 18 }).notNull(),
  price: decimal("price", { precision: 78, scale: 18 }).notNull(),
  txHash: text("tx_hash").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const holdings = pgTable("holdings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  tokenId: varchar("token_id").references(() => tokens.id).notNull(),
  balance: decimal("balance", { precision: 78, scale: 18 }).notNull(),
  avgBuyPrice: decimal("avg_buy_price", { precision: 78, scale: 18 }),
  totalInvested: decimal("total_invested", { precision: 78, scale: 18 }).default('0'),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const platformStats = pgTable("platform_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  totalTokens: integer("total_tokens").default(0),
  totalVolume: decimal("total_volume", { precision: 78, scale: 18 }).default('0'),
  totalUsers: integer("total_users").default(0),
  graduatedTokens: integer("graduated_tokens").default(0),
  dailyStats: jsonb("daily_stats"),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  walletAddress: true,
});

export const insertTokenSchema = createInsertSchema(tokens).pick({
  name: true,
  symbol: true,
  description: true,
  imageUrl: true,
}).extend({
  name: z.string().min(1, "Token name is required").max(50, "Token name too long"),
  symbol: z.string().min(1, "Symbol is required").max(10, "Symbol too long").regex(/^[A-Z0-9]+$/, "Symbol must be uppercase alphanumeric"),
  description: z.string().max(500, "Description too long").optional(),
  imageUrl: z.string().url("Invalid image URL").optional(),
});

export const insertTradeSchema = createInsertSchema(trades).pick({
  tokenId: true,
  type: true,
  okbAmount: true,
  tokenAmount: true,
  price: true,
  txHash: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Token = typeof tokens.$inferSelect;
export type InsertToken = z.infer<typeof insertTokenSchema>;
export type Trade = typeof trades.$inferSelect;
export type InsertTrade = z.infer<typeof insertTradeSchema>;
export type Holding = typeof holdings.$inferSelect;
export type PlatformStats = typeof platformStats.$inferSelect;
