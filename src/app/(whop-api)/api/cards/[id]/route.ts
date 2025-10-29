import { NextRequest, NextResponse } from 'next/server'
import { updateCard, deleteCard } from '~/db'
import { env } from '~/env'

/**
 * PATCH /api/cards/[id] - Update a card
 */
export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const companyId = env.NEXT_PUBLIC_WHOP_COMPANY_ID

		if (!companyId) {
			return NextResponse.json({ error: 'Company not configured' }, { status: 500 })
		}

		const { id } = await params
		const cardId = parseInt(id)

		if (isNaN(cardId)) {
			return NextResponse.json({ error: 'Invalid card ID' }, { status: 400 })
		}

		// Parse request body
		const body = await req.json()
		const { title, content, mediaUrl, mediaMimeType } = body

		// Update card
		const updatedCard = await updateCard(cardId, companyId, {
			title: title !== undefined ? title : undefined,
			content: content !== undefined ? content : undefined,
			mediaUrl: mediaUrl !== undefined ? mediaUrl : undefined,
			mediaMimeType: mediaMimeType !== undefined ? mediaMimeType : undefined,
		})

		if (!updatedCard) {
			return NextResponse.json({ error: 'Card not found' }, { status: 404 })
		}

		return NextResponse.json({ card: updatedCard })
	} catch (error) {
		console.error('Failed to update card:', error)
		return NextResponse.json({ error: 'Failed to update card' }, { status: 500 })
	}
}

/**
 * DELETE /api/cards/[id] - Delete a card
 */
export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const companyId = env.NEXT_PUBLIC_WHOP_COMPANY_ID

		if (!companyId) {
			return NextResponse.json({ error: 'Company not configured' }, { status: 500 })
		}

		const { id } = await params
		const cardId = parseInt(id)

		if (isNaN(cardId)) {
			return NextResponse.json({ error: 'Invalid card ID' }, { status: 400 })
		}

		// Delete card
		const success = await deleteCard(cardId, companyId)

		if (!success) {
			return NextResponse.json({ error: 'Card not found' }, { status: 404 })
		}

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error('Failed to delete card:', error)
		return NextResponse.json({ error: 'Failed to delete card' }, { status: 500 })
	}
}
