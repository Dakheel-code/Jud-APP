import { pgTable, uuid, varchar, timestamp, text, decimal, date, jsonb, boolean, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const stores = pgTable('stores', {
  id: uuid('id').primaryKey().defaultRandom(),
  storeName: varchar('store_name', { length: 255 }).notNull(),
  storeUrl: varchar('store_url', { length: 500 }),
  storeLogoUrl: varchar('store_logo_url', { length: 500 }),
  brandColor: varchar('brand_color', { length: 7 }).default('#f0710a'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  storeId: uuid('store_id').references(() => stores.id).notNull(),
  role: varchar('role', { length: 50 }).default('user').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const snapConnections = pgTable('snap_connections', {
  id: uuid('id').primaryKey().defaultRandom(),
  storeId: uuid('store_id').references(() => stores.id).notNull(),
  adAccountId: varchar('ad_account_id', { length: 255 }).notNull(),
  accessToken: text('access_token').notNull(),
  refreshToken: text('refresh_token').notNull(),
  tokenExpiresAt: timestamp('token_expires_at').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  lastSyncAt: timestamp('last_sync_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const snapInsightsDaily = pgTable('snap_insights_daily', {
  id: uuid('id').primaryKey().defaultRandom(),
  date: date('date').notNull(),
  storeId: uuid('store_id').references(() => stores.id).notNull(),
  adAccountId: varchar('ad_account_id', { length: 255 }).notNull(),
  spend: decimal('spend', { precision: 12, scale: 2 }).notNull(),
  impressions: integer('impressions').notNull(),
  swipes: integer('swipes').notNull(),
  purchases: integer('purchases').notNull(),
  purchaseValue: decimal('purchase_value', { precision: 12, scale: 2 }).notNull(),
  ctr: decimal('ctr', { precision: 5, scale: 2 }),
  cpc: decimal('cpc', { precision: 10, scale: 4 }),
  cvr: decimal('cvr', { precision: 5, scale: 2 }),
  aov: decimal('aov', { precision: 10, scale: 2 }),
  cpa: decimal('cpa', { precision: 10, scale: 2 }),
  roas: decimal('roas', { precision: 10, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const reports = pgTable('reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  reportId: varchar('report_id', { length: 50 }).notNull().unique(),
  storeId: uuid('store_id').references(() => stores.id).notNull(),
  createdByUserId: uuid('created_by_user_id').references(() => users.id).notNull(),
  dateFrom: date('date_from').notNull(),
  dateTo: date('date_to').notNull(),
  snapshotJson: jsonb('snapshot_json').notNull(),
  pdfUrl: varchar('pdf_url', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const storesRelations = relations(stores, ({ many }) => ({
  users: many(users),
  snapConnections: many(snapConnections),
  insights: many(snapInsightsDaily),
  reports: many(reports),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  store: one(stores, {
    fields: [users.storeId],
    references: [stores.id],
  }),
  reports: many(reports),
}));

export const snapConnectionsRelations = relations(snapConnections, ({ one }) => ({
  store: one(stores, {
    fields: [snapConnections.storeId],
    references: [stores.id],
  }),
}));

export const snapInsightsDailyRelations = relations(snapInsightsDaily, ({ one }) => ({
  store: one(stores, {
    fields: [snapInsightsDaily.storeId],
    references: [stores.id],
  }),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  store: one(stores, {
    fields: [reports.storeId],
    references: [stores.id],
  }),
  createdBy: one(users, {
    fields: [reports.createdByUserId],
    references: [users.id],
  }),
}));
