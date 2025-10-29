import { NextRequest, NextResponse } from 'next/server'
import { env } from '~/env'
import { getCards, createCard, type InsertCard } from '~/db'
import { whop } from '~/lib/whop'

/**
 * GET /api/cards - List all cards for the company
 * Uses companyId from environment (set during app installation)
 */
export async function GET(req: NextRequest) {
	try {
		const companyId = env.NEXT_PUBLIC_WHOP_COMPANY_ID

		if (!companyId) {
			return NextResponse.json({ error: 'Company not configured' }, { status: 500 })
		}

		const cards = await getCards(companyId)

		return NextResponse.json({ cards })
	} catch (error) {
		console.error('Failed to fetch cards:', error)
		return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 })
	}
}

/**
 * POST /api/cards - Create a new card (admin only)
 * Admin check happens on the frontend via Whop context
 */
export async function POST(req: NextRequest) {
	try {
		const companyId = env.NEXT_PUBLIC_WHOP_COMPANY_ID

		if (!companyId) {
			return NextResponse.json({ error: 'Company not configured' }, { status: 500 })
		}

		// Parse request body
		const body = await req.json()
		const { type, title, content, mediaUrl, mediaMimeType } = body

		// Validate type
		if (!type || !['text', 'image', 'video'].includes(type)) {
			return NextResponse.json({ error: 'Invalid card type' }, { status: 400 })
		}

		// Create card
		const cardData: Omit<InsertCard, 'id' | 'createdAt' | 'updatedAt'> = {
			companyId,
			type: type as 'text' | 'image' | 'video',
			title: title || null,
			content: content || null,
			mediaUrl: mediaUrl || null,
			mediaMimeType: mediaMimeType || null,
			order: 0, // Will be auto-calculated by createCard
			createdBy: null, // Simplified for now
		}

		const newCard = await createCard(cardData)

		return NextResponse.json({ card: newCard }, { status: 201 })
	} catch (error) {
		console.error('Failed to create card:', error)
		return NextResponse.json({ error: 'Failed to create card' }, { status: 500 })
	}
}
