'use client'

import { useState, useEffect } from 'react'
import { X, Layout } from 'lucide-react'
import { ImageDropzone } from '~/components/upload/ImageDropzone'

interface Card {
	id: number
	type: 'text' | 'image' | 'video'
	title: string | null
	content: string | null
	mediaUrl: string | null
	mediaMimeType: string | null
}

interface CardEditorProps {
	card: Card | null
	isOpen: boolean
	onClose: () => void
	onSave: (updates: Partial<Card>) => Promise<void>
}

export function CardEditor({ card, isOpen, onClose, onSave }: CardEditorProps) {
	const [bannerUrl, setBannerUrl] = useState('')
	const [title, setTitle] = useState('')
	const [content, setContent] = useState('')
	const [isSaving, setIsSaving] = useState(false)

	// Update form when card changes
	useEffect(() => {
		if (card) {
			setTitle(card.title || '')
			// Content is the text body (always from content field)
			setContent(card.content || '')
			// Banner is in mediaUrl (for both images and videos)
			setBannerUrl(card.mediaUrl || '')
		}
	}, [card])

	// Detect if URL is an image or video
	const detectMediaType = (url: string): 'image' | 'video' | 'text' => {
		if (!url || !url.trim()) return 'text'

		const lowerUrl = url.toLowerCase()

		// Check for image extensions
		if (lowerUrl.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
			return 'image'
		}

		// Check for video extensions or video platforms
		if (
			lowerUrl.match(/\.(mp4|webm|ogg|mov)$/) ||
			lowerUrl.includes('youtube.com') ||
			lowerUrl.includes('youtu.be') ||
			lowerUrl.includes('vimeo.com') ||
			lowerUrl.includes('loom.com')
		) {
			return 'video'
		}

		// Default to text if can't determine
		return 'text'
	}

	const handleSave = async () => {
		if (!card) return

		setIsSaving(true)
		try {
			const updates: Partial<Card> = {
				title: title.trim() || null,
				content: content.trim() || null,
			}

			// Auto-detect type based on banner URL
			const detectedType = detectMediaType(bannerUrl)
			updates.type = detectedType

			// Store banner URL - ALL videos and images go to mediaUrl
			// This keeps video URLs separate from text content
			if (detectedType === 'video' || detectedType === 'image') {
				updates.mediaUrl = bannerUrl.trim() || null
			} else {
				// Text cards - no banner
				updates.mediaUrl = null
			}

			await onSave(updates)
			onClose()
		} catch (error) {
			console.error('Failed to save card:', error)
			alert('Failed to save card. Please try again.')
		} finally {
			setIsSaving(false)
		}
	}

	if (!isOpen || !card) return null

	return (
		<>
			{/* Backdrop */}
			<div
				className="fixed inset-0 bg-black bg-opacity-75 z-40"
				onClick={onClose}
			/>

			{/* Modal */}
			<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
				<div className="bg-[#262626] border border-[#7f7f7f]/20 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
					{/* Header */}
					<div className="flex items-center justify-between px-6 py-4 border-b border-[#7f7f7f]/20">
						<div className="flex items-center space-x-3">
							<div className="w-10 h-10 rounded-full bg-[#fa4616]/20 border border-[#fa4616] flex items-center justify-center">
								<Layout className="w-5 h-5 text-[#fa4616]" />
							</div>
							<div>
								<h2 className="text-lg font-semibold text-white">Edit Card</h2>
								<p className="text-sm text-gray-400">
									Update banner, title, and content
								</p>
							</div>
						</div>
						<button
							onClick={onClose}
							className="text-gray-400 hover:text-gray-300 transition-colors"
						>
							<X className="w-6 h-6" />
						</button>
					</div>

					{/* Content */}
					<div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
						{/* Banner Section (Optional) */}
						<div>
							<label className="block text-sm font-medium text-gray-300 mb-3">
								Banner (Optional)
							</label>

							{/* Image Upload or URL Input */}
							{!bannerUrl || detectMediaType(bannerUrl) === 'image' ? (
								<div className="space-y-3">
									{/* Image Dropzone */}
									<ImageDropzone
										currentUrl={bannerUrl && detectMediaType(bannerUrl) === 'image' ? bannerUrl : undefined}
										onUploadComplete={(url) => setBannerUrl(url)}
										onRemove={() => setBannerUrl('')}
									/>

									{/* Or URL Input */}
									<div className="relative">
										<div className="absolute inset-0 flex items-center">
											<div className="w-full border-t border-[#7f7f7f]/30"></div>
										</div>
										<div className="relative flex justify-center text-xs">
											<span className="px-2 bg-[#262626] text-gray-500">or paste URL</span>
										</div>
									</div>

									<input
										type="url"
										value={bannerUrl}
										onChange={(e) => setBannerUrl(e.target.value)}
										placeholder="Paste image or video URL..."
										className="w-full px-3 py-2 bg-[#141212] border border-[#7f7f7f]/30 rounded-md text-[#fafafa] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#fa4616] focus:border-[#fa4616] transition-colors text-sm"
									/>
								</div>
							) : (
								<div className="space-y-3">
									{/* Video URL Input */}
									<div className="flex gap-2">
										<input
											type="url"
											value={bannerUrl}
											onChange={(e) => setBannerUrl(e.target.value)}
											placeholder="Video URL (YouTube, Vimeo, or direct link)"
											className="flex-1 px-3 py-2 bg-[#141212] border border-[#7f7f7f]/30 rounded-md text-[#fafafa] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#fa4616] focus:border-[#fa4616] transition-colors"
										/>
										<button
											type="button"
											onClick={() => setBannerUrl('')}
											className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
										>
											<X className="w-4 h-4" />
										</button>
									</div>

									{/* Video Hints */}
									<div className="bg-[#fa4616]/10 border border-[#fa4616]/30 rounded-lg p-3">
										<p className="text-xs font-medium text-[#fa4616] mb-2">✓ Video URL detected</p>
										<div className="text-xs text-gray-400 space-y-1">
											<p>• YouTube: youtube.com/watch?v=...</p>
											<p>• Vimeo: vimeo.com/...</p>
											<p>• Loom: loom.com/share/...</p>
											<p>• Direct: .mp4, .webm, .ogg files</p>
										</div>
									</div>
								</div>
							)}

							<p className="mt-2 text-xs text-gray-500">
								Upload an image or paste a video URL • Leave empty for text-only card
							</p>
						</div>

						{/* Title Field (Always Present) */}
						<div>
							<label className="block text-sm font-medium text-gray-300 mb-1">
								Title
							</label>
							<input
								type="text"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								placeholder="Enter card title..."
								className="w-full px-3 py-2 bg-[#141212] border border-[#7f7f7f]/30 rounded-md text-[#fafafa] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#fa4616] focus:border-[#fa4616] transition-colors"
							/>
						</div>

						{/* Content Field (Always Present) */}
						<div>
							<label className="block text-sm font-medium text-gray-300 mb-1">
								Content
							</label>
							<textarea
								value={content}
								onChange={(e) => setContent(e.target.value)}
								placeholder="Enter card content..."
								rows={8}
								className="w-full px-3 py-2 bg-[#141212] border border-[#7f7f7f]/30 rounded-md text-[#fafafa] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#fa4616] focus:border-[#fa4616] resize-none transition-colors"
							/>
							<p className="mt-1 text-xs text-gray-500">
								This text will be displayed below the title in the card
							</p>
						</div>
					</div>

					{/* Footer */}
					<div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-[#7f7f7f]/20 bg-[#141212]">
						<button
							onClick={onClose}
							disabled={isSaving}
							className="px-4 py-2 text-sm font-medium text-gray-300 bg-[#262626] border border-[#7f7f7f]/30 rounded-md hover:bg-[#333333] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fa4616] disabled:opacity-50 transition-colors"
						>
							Cancel
						</button>
						<button
							onClick={handleSave}
							disabled={isSaving}
							className="px-4 py-2 text-sm font-medium text-white bg-[#fa4616] rounded-md hover:bg-[#e03d12] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fa4616] disabled:opacity-50 transition-colors"
						>
							{isSaving ? 'Saving...' : 'Save Changes'}
						</button>
					</div>
				</div>
			</div>
		</>
	)
}
