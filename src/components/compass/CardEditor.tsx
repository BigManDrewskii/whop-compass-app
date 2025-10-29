'use client'

import { useState, useEffect } from 'react'
import { X, Image as ImageIcon, Video, Type } from 'lucide-react'

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
	const [title, setTitle] = useState('')
	const [content, setContent] = useState('')
	const [mediaUrl, setMediaUrl] = useState('')
	const [isSaving, setIsSaving] = useState(false)

	// Update form when card changes
	useEffect(() => {
		if (card) {
			setTitle(card.title || '')
			setContent(card.content || '')
			setMediaUrl(card.mediaUrl || '')
		}
	}, [card])

	const handleSave = async () => {
		if (!card) return

		setIsSaving(true)
		try {
			const updates: Partial<Card> = {
				title: title.trim() || null,
			}

			// For text cards, save content
			if (card.type === 'text') {
				updates.content = content.trim() || null
			}

			// For image/video cards, save mediaUrl
			if (card.type === 'image' || card.type === 'video') {
				// If mediaUrl is provided, it's either an uploaded URL or embed URL
				updates.mediaUrl = mediaUrl.trim() || null

				// For video cards, check if it's a YouTube/Vimeo embed
				if (card.type === 'video' && mediaUrl.trim()) {
					// If it looks like a watch URL, store it in content (we'll convert to embed in rendering)
					if (mediaUrl.includes('youtube.com/watch') || mediaUrl.includes('youtu.be') || mediaUrl.includes('vimeo.com')) {
						updates.content = mediaUrl.trim()
						updates.mediaUrl = null
					}
				}
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
							{card.type === 'text' && (
								<div className="w-10 h-10 rounded-full bg-[#fa4616]/20 border border-[#fa4616] flex items-center justify-center">
									<Type className="w-5 h-5 text-[#fa4616]" />
								</div>
							)}
							{card.type === 'image' && (
								<div className="w-10 h-10 rounded-full bg-[#fa4616]/30 border border-[#fa4616] flex items-center justify-center">
									<ImageIcon className="w-5 h-5 text-[#fa4616]" />
								</div>
							)}
							{card.type === 'video' && (
								<div className="w-10 h-10 rounded-full bg-[#fa4616]/40 border border-[#fa4616] flex items-center justify-center">
									<Video className="w-5 h-5 text-[#fa4616]" />
								</div>
							)}
							<div>
								<h2 className="text-lg font-semibold text-white">
									Edit {card.type.charAt(0).toUpperCase() + card.type.slice(1)} Card
								</h2>
								<p className="text-sm text-gray-400">
									Update the content for this card
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
						{/* Title Field (All Types) */}
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

						{/* Content Field (Text Cards) */}
						{card.type === 'text' && (
							<div>
								<label className="block text-sm font-medium text-gray-300 mb-1">
									Content
								</label>
								<textarea
									value={content}
									onChange={(e) => setContent(e.target.value)}
									placeholder="Enter your content here..."
									rows={8}
									className="w-full px-3 py-2 bg-[#141212] border border-[#7f7f7f]/30 rounded-md text-[#fafafa] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#fa4616] focus:border-[#fa4616] resize-none transition-colors"
								/>
								<p className="mt-1 text-xs text-gray-500">
									This text will be displayed to users in the onboarding carousel
								</p>
							</div>
						)}

						{/* Media URL Field (Image Cards) */}
						{card.type === 'image' && (
							<div>
								<label className="block text-sm font-medium text-gray-300 mb-1">
									Image URL
								</label>
								<input
									type="url"
									value={mediaUrl}
									onChange={(e) => setMediaUrl(e.target.value)}
									placeholder="https://example.com/image.jpg"
									className="w-full px-3 py-2 bg-[#141212] border border-[#7f7f7f]/30 rounded-md text-[#fafafa] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#fa4616] focus:border-[#fa4616] transition-colors"
								/>
								<p className="mt-1 text-xs text-gray-500">
									Enter a direct image URL (JPG, PNG, GIF, WebP)
								</p>

								{/* Image Preview */}
								{mediaUrl && (
									<div className="mt-3">
										<p className="text-xs font-medium text-gray-300 mb-2">Preview:</p>
										<img
											src={mediaUrl}
											alt="Preview"
											className="w-full h-48 object-cover rounded-md border border-[#7f7f7f]/30"
											onError={(e) => {
												e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%231f2937" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-family="sans-serif"%3EInvalid image URL%3C/text%3E%3C/svg%3E'
											}}
										/>
									</div>
								)}
							</div>
						)}

						{/* Media URL Field (Video Cards) */}
						{card.type === 'video' && (
							<div>
								<label className="block text-sm font-medium text-gray-300 mb-1">
									Video URL
								</label>
								<input
									type="url"
									value={mediaUrl}
									onChange={(e) => setMediaUrl(e.target.value)}
									placeholder="YouTube, Vimeo, or direct video URL"
									className="w-full px-3 py-2 bg-[#141212] border border-[#7f7f7f]/30 rounded-md text-[#fafafa] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#fa4616] focus:border-[#fa4616] transition-colors"
								/>
								<p className="mt-1 text-xs text-gray-500">
									Supports YouTube, Vimeo, or direct video links (MP4, WebM)
								</p>
								<div className="mt-2 space-y-1">
									<p className="text-xs text-gray-500">Examples:</p>
									<ul className="text-xs text-gray-500 space-y-0.5 ml-3">
										<li>• https://youtube.com/watch?v=VIDEO_ID</li>
										<li>• https://youtu.be/VIDEO_ID</li>
										<li>• https://vimeo.com/VIDEO_ID</li>
										<li>• https://example.com/video.mp4</li>
									</ul>
								</div>
							</div>
						)}
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
