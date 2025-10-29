'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { OnboardingCarousel } from '~/components/compass/OnboardingCarousel'

interface Card {
	id: number
	type: 'text' | 'image' | 'video'
	title: string | null
	content: string | null
	mediaUrl: string | null
	mediaMimeType: string | null
}

export default function OnboardingPage() {
	const params = useParams()
	const experienceId = params.experienceId as string

	// Fetch cards
	const { data: cardsData, isLoading, error } = useQuery({
		queryKey: ['onboarding-cards'],
		queryFn: async () => {
			const res = await fetch('/api/cards')
			if (!res.ok) throw new Error('Failed to fetch cards')
			return res.json() as Promise<{ cards: Card[] }>
		},
	})

	// Loading state
	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-[#141212]">
				<div className="text-center">
					<Loader2 className="w-12 h-12 animate-spin text-[#fa4616] mx-auto mb-4" />
					<p className="text-gray-400">Loading onboarding...</p>
				</div>
			</div>
		)
	}

	// Error state
	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-[#141212]">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-white mb-2">
						Something went wrong
					</h1>
					<p className="text-gray-400 mb-6">
						Failed to load onboarding content. Please try again later.
					</p>
					<Link
						href={`/experiences/${experienceId}`}
						className="inline-block px-6 py-3 bg-[#fa4616] text-white font-medium rounded-lg hover:bg-[#e03d12] transition-colors"
					>
						Back to Dashboard
					</Link>
				</div>
			</div>
		)
	}

	// Empty state - no cards created yet
	if (!cardsData?.cards || cardsData.cards.length === 0) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-[#141212] px-4">
				<div className="text-center max-w-md">
					<h1 className="text-3xl font-bold text-white mb-4">
						Welcome!
					</h1>
					<p className="text-gray-400 mb-8">
						The community admins haven't set up an onboarding experience yet.
						Check back soon!
					</p>
					<Link
						href={`/experiences/${experienceId}`}
						className="inline-block px-6 py-3 bg-[#fa4616] text-white font-medium rounded-lg hover:bg-[#e03d12] transition-colors"
					>
						Go to Dashboard
					</Link>
				</div>
			</div>
		)
	}

	// Render carousel with cards
	return (
		<div className="min-h-screen bg-[#141212]">
			<OnboardingCarousel cards={cardsData.cards} />
		</div>
	)
}
