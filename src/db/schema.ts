import { pgTable, text, timestamp, uuid, serial, integer, index, jsonb } from 'drizzle-orm/pg-core'

// Users table - for authentication and role management
export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	email: text('email'),
	name: text('name'),
	role: text('role', { enum: ['user', 'admin'] }).default('user').notNull(),
	companyId: text('companyId'), // Whop company/community ID
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Onboarding cards table - stores all card data for companies
export const onboardingCards = pgTable('onboarding_cards', {
	id: serial('id').primaryKey(),
	companyId: text('companyId').notNull(),
	order: integer('order').notNull().default(0),
	type: text('type', { enum: ['text', 'image', 'video'] }).notNull(),
	title: text('title'),
	content: text('content'), // For text cards or video embed URLs
	mediaUrl: text('mediaUrl'), // For uploaded images/videos
	mediaMimeType: text('mediaMimeType'), // e.g., 'image/png', 'video/mp4'
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
	createdBy: integer('created_by').references(() => users.id),
}, (table) => ({
	// Index for fast queries by company + order
	companyOrderIdx: index('idx_company_order').on(table.companyId, table.order),
	// Note: NO unique constraint on (companyId, order) to avoid reordering conflicts
}))

// Tasks table - keeping original template table for reference
export const tasks = pgTable('tasks', {
	id: uuid('id').defaultRandom().primaryKey(),
	title: text('title').notNull(),
	description: text('description'),
	completed: text('completed').notNull().default('false'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Company Themes table - stores theme customization per company
export const companyThemes = pgTable('company_themes', {
	id: serial('id').primaryKey(),
	companyId: text('companyId').notNull().unique(), // One theme per company
	themeName: text('themeName').default('Custom Theme'),
	colors: jsonb('colors').notNull(), // ThemeColors object
	typography: jsonb('typography').notNull(), // ThemeTypography object
	borderRadius: jsonb('borderRadius').notNull(), // ThemeBorderRadius object
	spacing: jsonb('spacing').notNull(), // ThemeSpacing object
	mode: text('mode', { enum: ['light', 'dark', 'auto'] }).default('dark').notNull(),
	customCSS: text('customCSS'), // Optional custom CSS overrides
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
	// Index for fast company lookups
	companyIdx: index('idx_company_theme').on(table.companyId),
}))
