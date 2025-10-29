import { NextResponse } from 'next/server'
import { db } from '~/db'
import { onboardingCards } from '~/db/schema'
import { sql } from 'drizzle-orm'

export async function GET() {
	try {
		// Test database connection
		const result = await db.select({ count: sql`count(*)` }).from(onboardingCards)

		return NextResponse.json({
			status: 'ok',
			database: 'connected',
			cardsCount: result[0]?.count || 0,
			env: {
				hasCompanyId: !!process.env.NEXT_PUBLIC_WHOP_COMPANY_ID,
				hasAppId: !!process.env.NEXT_PUBLIC_WHOP_APP_ID,
				hasDatabaseUrl: !!process.env.DATABASE_URL,
			}
		})
	} catch (error) {
		return NextResponse.json({
			status: 'error',
			error: error instanceof Error ? error.message : 'Unknown error'
		}, { status: 500 })
	}
}
