import { pgTable, text, timestamp, uuid, serial, integer, index } from 'drizzle-orm/pg-core'

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
