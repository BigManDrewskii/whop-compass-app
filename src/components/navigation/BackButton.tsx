'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { useEffect } from 'react'

interface BackButtonProps {
  label?: string
  fallbackHref?: string
  className?: string
}

/**
 * BackButton Component
 * Smart back navigation using browser history with fallback
 *
 * Features:
 * - Uses browser history (window.history.back)
 * - Keyboard shortcut (Esc key)
 * - Fallback URL if no history
 * - Respects browser behavior
 */
export function BackButton({
  label = 'Back',
  fallbackHref,
  className = ''
}: BackButtonProps) {
  const router = useRouter()

  const handleBack = () => {
    // Check if there's history to go back to
    if (window.history.length > 1) {
      router.back()
    } else if (fallbackHref) {
      // Fallback to specific route
      router.push(fallbackHref)
    } else {
      // Default fallback to root
      router.push('/')
    }
  }

  // Keyboard shortcut (Esc key)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleBack()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  return (
    <button
      onClick={handleBack}
      className={`inline-flex items-center px-4 py-2 text-sm font-medium text-gray-400 hover:text-[#fafafa] transition-colors ${className}`}
      title="Go back (or press Esc)"
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      {label}
    </button>
  )
}
