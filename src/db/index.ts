import { createClient } from '@supabase/supabase-js'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { eq, and, asc, desc, max } from 'drizzle-orm'
import * as schema from './schema'

// Drizzle client for type-safe queries and migrations
const connectionString = process.env.DATABASE_URL!
const client = postgres(connectionString)
export const db = drizzle(client, { schema })

// Supabase client for Auth, Storage, Realtime
export const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

// ============================================================
// ONBOARDING CARDS - Database Helper Functions
// ============================================================

// Types
export type InsertCard = typeof schema.onboardingCards.$inferInsert
export type SelectCard = typeof schema.onboardingCards.$inferSelect

/**
 * Get all cards for a company, ordered by position
 */
export async function getCards(companyId: string): Promise<SelectCard[]> {
	return db
		.select()
		.from(schema.onboardingCards)
		.where(eq(schema.onboardingCards.companyId, companyId))
		.orderBy(asc(schema.onboardingCards.order))
}

/**
 * Get a single card by ID (with company verification)
 */
export async function getCardById(
	id: number,
	companyId: string,
): Promise<SelectCard | undefined> {
	const results = await db
		.select()
		.from(schema.onboardingCards)
		.where(
			and(
				eq(schema.onboardingCards.id, id),
				eq(schema.onboardingCards.companyId, companyId),
			),
		)
		.limit(1)

	return results[0]
}

/**
 * Create a new card (automatically assigns next order position)
 */
export async function createCard(
	data: Omit<InsertCard, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<SelectCard> {
	// Find the max order for this company
	const maxOrderResult = await db
		.select({ maxOrder: max(schema.onboardingCards.order) })
		.from(schema.onboardingCards)
		.where(eq(schema.onboardingCards.companyId, data.companyId))

	const nextOrder = (maxOrderResult[0]?.maxOrder ?? -1) + 1

	const [newCard] = await db
		.insert(schema.onboardingCards)
		.values({
			...data,
			order: nextOrder,
		})
		.returning()

	return newCard
}

/**
 * Update an existing card (with company verification)
 */
export async function updateCard(
	id: number,
	companyId: string,
	data: Partial<Omit<InsertCard, 'id' | 'companyId' | 'createdAt'>>,
): Promise<SelectCard | undefined> {
	const [updatedCard] = await db
		.update(schema.onboardingCards)
		.set({
			...data,
			updatedAt: new Date(),
		})
		.where(
			and(
				eq(schema.onboardingCards.id, id),
				eq(schema.onboardingCards.companyId, companyId),
			),
		)
		.returning()

	return updatedCard
}

/**
 * Delete a card (with company verification)
 */
export async function deleteCard(
	id: number,
	companyId: string,
): Promise<boolean> {
	const result = await db
		.delete(schema.onboardingCards)
		.where(
			and(
				eq(schema.onboardingCards.id, id),
				eq(schema.onboardingCards.companyId, companyId),
			),
		)
		.returning()

	return result.length > 0
}

/**
 * Reorder cards by updating their order field
 * @param companyId - The company ID to filter by
 * @param cardIds - Array of card IDs in the desired order
 */
export async function reorderCards(
	companyId: string,
	cardIds: number[],
): Promise<void> {
	// Update each card's order field
	for (let i = 0; i < cardIds.length; i++) {
		await db
			.update(schema.onboardingCards)
			.set({
				order: i,
				updatedAt: new Date(),
			})
			.where(
				and(
					eq(schema.onboardingCards.id, cardIds[i]),
					eq(schema.onboardingCards.companyId, companyId),
				),
			)
	}
}
