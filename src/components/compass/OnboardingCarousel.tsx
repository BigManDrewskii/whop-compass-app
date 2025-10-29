'use client'

import { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Keyboard, A11y } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import { UnifiedCard } from './UnifiedCard'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

interface Card {
	id: number
	type: 'text' | 'image' | 'video'
	title: string | null
	content: string | null
	mediaUrl: string | null
	mediaMimeType: string | null
}

interface OnboardingCarouselProps {
	cards: Card[]
}

export function OnboardingCarousel({ cards }: OnboardingCarouselProps) {
	const router = useRouter()
	const params = useParams()
	const experienceId = params.experienceId as string
	const [swiper, setSwiper] = useState<SwiperType | null>(null)
	const [activeIndex, setActiveIndex] = useState(0)
	const [isLastSlide, setIsLastSlide] = useState(false)

	useEffect(() => {
		if (swiper) {
			setIsLastSlide(swiper.isEnd)
		}
	}, [swiper, activeIndex])

	const handleSkip = () => {
		// Navigate back to experience dashboard
		router.push(`/experiences/${experienceId}`)
	}

	const handleGetStarted = () => {
		// Navigate back to experience dashboard
		router.push(`/experiences/${experienceId}`)
	}

	// Map card data to UnifiedCard props
	const getCardProps = (card: Card) => {
		const title = card.title || 'Untitled'
		const content = card.content || ''

		// Determine banner based on card type
		let banner = undefined

		if (card.type === 'image' && card.mediaUrl) {
			banner = {
				type: 'image' as const,
				url: card.mediaUrl,
			}
		} else if (card.type === 'video') {
			// Video URL is in mediaUrl (all videos: YouTube, Vimeo, Loom, direct)
			const videoUrl = card.mediaUrl || card.content
			if (videoUrl) {
				banner = {
					type: 'video' as const,
					url: videoUrl,
				}
			}
		}

		return { banner, title, content }
	}

	return (
		<div className="relative w-full h-screen">
			{/* Skip Button */}
			<button
				onClick={handleSkip}
				className="absolute top-6 right-6 z-50 px-4 py-2 text-sm font-medium text-[#7f7f7f] hover:text-[#fafafa] transition-colors flex items-center space-x-1"
			>
				<span>Skip</span>
				<X className="w-4 h-4" />
			</button>

			{/* Progress Indicator */}
			<div className="absolute top-6 left-6 z-50 px-4 py-2 bg-[#262626]/80 backdrop-blur-sm rounded-full text-sm font-medium border border-[#fa4616]/30">
				<span className="text-[#fafafa]">
					<span className="text-[#fa4616]">{activeIndex + 1}</span> of {cards.length}
				</span>
			</div>

			{/* Swiper Carousel */}
			<Swiper
				modules={[Navigation, Pagination, Keyboard, A11y]}
				spaceBetween={0}
				slidesPerView={1}
				navigation={{
					prevEl: '.swiper-button-prev-custom',
					nextEl: '.swiper-button-next-custom',
				}}
				pagination={{
					clickable: true,
					el: '.swiper-pagination-custom',
				}}
				keyboard={{
					enabled: true,
				}}
				onSwiper={setSwiper}
				onSlideChange={(swiper) => {
					setActiveIndex(swiper.activeIndex)
					setIsLastSlide(swiper.isEnd)
				}}
				className="w-full h-full"
			>
				{cards.map((card) => {
					const cardProps = getCardProps(card)
					return (
						<SwiperSlide key={card.id}>
							<UnifiedCard {...cardProps} />
						</SwiperSlide>
					)
				})}
			</Swiper>

			{/* Custom Navigation Buttons */}
			<button
				className="swiper-button-prev-custom absolute left-6 top-1/2 -translate-y-1/2 z-40 w-12 h-12 flex items-center justify-center bg-[#262626]/80 hover:bg-[#fa4616] backdrop-blur-sm rounded-full text-white border border-[#7f7f7f]/20 hover:border-[#fa4616] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
				disabled={activeIndex === 0}
			>
				<ChevronLeft className="w-6 h-6" />
			</button>

			<button
				className="swiper-button-next-custom absolute right-6 top-1/2 -translate-y-1/2 z-40 w-12 h-12 flex items-center justify-center bg-[#262626]/80 hover:bg-[#fa4616] backdrop-blur-sm rounded-full text-white border border-[#7f7f7f]/20 hover:border-[#fa4616] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
				disabled={isLastSlide}
			>
				<ChevronRight className="w-6 h-6" />
			</button>

			{/* Custom Pagination */}
			<div className="swiper-pagination-custom absolute bottom-32 left-0 right-0 flex justify-center z-40" />

			{/* Get Started Button (Last Slide) */}
			{isLastSlide && (
				<div className="absolute bottom-12 left-0 right-0 flex justify-center z-40">
					<button
						onClick={handleGetStarted}
						className="px-8 py-3 bg-[#fa4616] hover:bg-[#e03d12] text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
					>
						Get Started
					</button>
				</div>
			)}
		</div>
	)
}
