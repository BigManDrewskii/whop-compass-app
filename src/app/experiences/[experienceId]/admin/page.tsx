'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useWhop } from '~/components/whop-context'
import { Plus, Loader2, Pencil, GripVertical } from 'lucide-react'
import { useState } from 'react'
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd'
import { CardEditor } from '~/components/compass/CardEditor'

interface Card {
	id: number
	companyId: string
	order: number
	type: 'text' | 'image' | 'video'
	title: string | null
	content: string | null
	mediaUrl: string | null
	mediaMimeType: string | null
	createdAt: Date
	updatedAt: Date
	createdBy: number | null
}

export default function AdminDashboard() {
	const { access } = useWhop()
	const queryClient = useQueryClient()
	const [isCreating, setIsCreating] = useState(false)
	const [editingCard, setEditingCard] = useState<Card | null>(null)

	// Fetch cards
	const { data: cardsData, isLoading } = useQuery({
		queryKey: ['cards'],
		queryFn: async () => {
			const res = await fetch('/api/cards')
			if (!res.ok) throw new Error('Failed to fetch cards')
			return res.json() as Promise<{ cards: Card[] }>
		},
	})

	// Reorder mutation
	const reorderMutation = useMutation({
		mutationFn: async (cardIds: number[]) => {
			const res = await fetch('/api/cards/reorder', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ cardIds }),
			})
			if (!res.ok) throw new Error('Failed to reorder cards')
			return res.json()
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['cards'] })
		},
	})

	// Delete mutation
	const deleteMutation = useMutation({
		mutationFn: async (id: number) => {
			const res = await fetch(`/api/cards/${id}`, { method: 'DELETE' })
			if (!res.ok) throw new Error('Failed to delete card')
			return res.json()
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['cards'] })
		},
	})

	// Create card mutation
	const createMutation = useMutation({
		mutationFn: async (type: 'text' | 'image' | 'video') => {
			const res = await fetch('/api/cards', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					type,
					title: `New ${type} card`,
					content: type === 'text' ? 'Enter your content here...' : null,
				}),
			})
			if (!res.ok) throw new Error('Failed to create card')
			return res.json()
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['cards'] })
			setIsCreating(false)
		},
	})

	// Update card mutation
	const updateMutation = useMutation({
		mutationFn: async ({ id, updates }: { id: number; updates: Partial<Card> }) => {
			const res = await fetch(`/api/cards/${id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(updates),
			})
			if (!res.ok) throw new Error('Failed to update card')
			return res.json()
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['cards'] })
		},
	})

	const handleSaveCard = async (updates: Partial<Card>) => {
		if (!editingCard) return
		await updateMutation.mutateAsync({ id: editingCard.id, updates })
	}

	const handleDragEnd = (result: DropResult) => {
		if (!result.destination || !cardsData?.cards) return

		const items = Array.from(cardsData.cards)
		const [reorderedItem] = items.splice(result.source.index, 1)
		items.splice(result.destination.index, 0, reorderedItem)

		// Optimistic update
		queryClient.setQueryData(['cards'], { cards: items })

		// Persist to backend
		reorderMutation.mutate(items.map((item) => item.id))
	}

	// Check if user is admin
	if (access.accessLevel !== 'admin') {
		return (
			<div className="min-h-screen flex items-center justify-center bg-[#141212]">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
					<p className="text-gray-400">You need admin access to manage onboarding cards.</p>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-[#141212] py-8 px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-white">Compass - Onboarding Cards</h1>
					<p className="mt-2 text-gray-400">
						Create and manage your community's onboarding experience
					</p>
				</div>

				{/* Add Card Button */}
				<div className="mb-6">
					{!isCreating ? (
						<button
							onClick={() => setIsCreating(true)}
							className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#fa4616] hover:bg-[#e03d12] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fa4616] transition-colors"
						>
							<Plus className="h-4 w-4 mr-2" />
							Add Card
						</button>
					) : (
						<div className="bg-[#262626] rounded-lg shadow p-4 border border-[#7f7f7f]/20">
							<p className="text-sm font-medium text-gray-300 mb-3">Select card type:</p>
							<div className="flex gap-2">
								<button
									onClick={() => createMutation.mutate('text')}
									disabled={createMutation.isPending}
									className="px-4 py-2 bg-[#fa4616] hover:bg-[#e03d12] rounded-md text-sm font-medium text-white disabled:opacity-50 transition-colors"
								>
									Text
								</button>
								<button
									onClick={() => createMutation.mutate('image')}
									disabled={createMutation.isPending}
									className="px-4 py-2 bg-[#fa4616] hover:bg-[#e03d12] rounded-md text-sm font-medium text-white disabled:opacity-50 transition-colors"
								>
									Image
								</button>
								<button
									onClick={() => createMutation.mutate('video')}
									disabled={createMutation.isPending}
									className="px-4 py-2 bg-[#fa4616] hover:bg-[#e03d12] rounded-md text-sm font-medium text-white disabled:opacity-50 transition-colors"
								>
									Video
								</button>
								<button
									onClick={() => setIsCreating(false)}
									disabled={createMutation.isPending}
									className="px-4 py-2 bg-[#141212] border border-[#7f7f7f]/30 hover:bg-[#262626] rounded-md text-sm font-medium text-gray-300 disabled:opacity-50 transition-colors"
								>
									Cancel
								</button>
							</div>
						</div>
					)}
				</div>

				{/* Loading State */}
				{isLoading && (
					<div className="flex items-center justify-center py-12">
						<Loader2 className="h-8 w-8 animate-spin text-gray-500" />
					</div>
				)}

				{/* Empty State */}
				{!isLoading && cardsData?.cards.length === 0 && (
					<div className="text-center py-12 bg-[#262626] rounded-lg shadow border border-[#7f7f7f]/20">
						<h3 className="text-lg font-medium text-white mb-2">No cards yet</h3>
						<p className="text-gray-400">Get started by creating your first onboarding card</p>
					</div>
				)}

				{/* Cards List with Drag & Drop */}
				{!isLoading && cardsData && cardsData.cards.length > 0 && (
					<DragDropContext onDragEnd={handleDragEnd}>
						<Droppable droppableId="cards">
							{(provided) => (
								<div
									{...provided.droppableProps}
									ref={provided.innerRef}
									className="space-y-3"
								>
									{cardsData.cards.map((card, index) => (
										<Draggable key={card.id} draggableId={String(card.id)} index={index}>
											{(provided, snapshot) => (
												<div
													ref={provided.innerRef}
													{...provided.draggableProps}
													className={`bg-[#262626] rounded-lg shadow p-4 border border-[#7f7f7f]/20 transition-all ${
														snapshot.isDragging ? 'shadow-lg ring-2 ring-[#fa4616]' : 'hover:border-[#fa4616]/30'
													}`}
												>
													<div className="flex items-center justify-between">
														<div className="flex items-center space-x-4 flex-1">
															{/* Drag Handle */}
															<div
																{...provided.dragHandleProps}
																className="cursor-grab active:cursor-grabbing text-[#7f7f7f] hover:text-[#fa4616] transition-colors"
															>
																<GripVertical className="w-5 h-5" />
															</div>

															{/* Type Badge */}
															<span className="px-2 py-1 text-xs font-medium rounded-md bg-[#262626] text-[#fafafa] border border-[#7f7f7f]/30 inline-flex items-center gap-1">
																{card.type}
															</span>

															{/* Title */}
															<span className="font-medium text-white">
																{card.title || 'Untitled'}
															</span>
														</div>

														{/* Actions */}
														<div className="flex items-center space-x-2">
															<button
																onClick={() => setEditingCard(card)}
																className="px-3 py-1 text-sm font-medium text-[#fa4616] hover:text-[#e03d12] flex items-center space-x-1 transition-colors"
															>
																<Pencil className="w-3 h-3" />
																<span>Edit</span>
															</button>
															<button
																onClick={() => deleteMutation.mutate(card.id)}
																disabled={deleteMutation.isPending}
																className="px-3 py-1 text-sm font-medium text-red-400 hover:text-red-300 disabled:opacity-50 transition-colors"
															>
																Delete
															</button>
														</div>
													</div>
												</div>
											)}
										</Draggable>
									))}
									{provided.placeholder}
								</div>
							)}
						</Droppable>
					</DragDropContext>
				)}

				{/* Card Editor Modal */}
				<CardEditor
					card={editingCard}
					isOpen={!!editingCard}
					onClose={() => setEditingCard(null)}
					onSave={handleSaveCard}
				/>
			</div>
		</div>
	)
}
