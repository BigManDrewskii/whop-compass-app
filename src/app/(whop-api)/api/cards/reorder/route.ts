import { NextRequest, NextResponse } from 'next/server'
import { reorderCards } from '~/db'
import { env } from '~/env'

/**
 * POST /api/cards/reorder - Reorder cards
 */
export async function POST(req: NextRequest) {
	try {
		const companyId = env.NEXT_PUBLIC_WHOP_COMPANY_ID

		if (!companyId) {
			return NextResponse.json({ error: 'Company not configured' }, { status: 500 })
		}

		// Parse request body
		const body = await req.json()
		const { cardIds } = body

		// Validate cardIds
		if (!Array.isArray(cardIds) || cardIds.length === 0) {
			return NextResponse.json({ error: 'Invalid cardIds array' }, { status: 400 })
		}

		if (!cardIds.every((id) => typeof id === 'number')) {
			return NextResponse.json({ error: 'All cardIds must be numbers' }, { status: 400 })
		}

		// Reorder cards
		await reorderCards(companyId, cardIds)

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error('Failed to reorder cards:', error)
		return NextResponse.json({ error: 'Failed to reorder cards' }, { status: 500 })
	}
}
