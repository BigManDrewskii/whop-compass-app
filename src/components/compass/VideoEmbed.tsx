'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Play, AlertCircle } from 'lucide-react'

// Dynamic import to avoid SSR hydration issues
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false })

interface VideoEmbedProps {
  url: string
  title?: string
}

/**
 * VideoEmbed Component
 * Uses react-player for reliable video embedding
 *
 * Supports: YouTube, Vimeo, Loom, Facebook, Twitch, SoundCloud,
 * Wistia, Mixcloud, DailyMotion, file URLs (mp4, webm, ogg)
 */
export function VideoEmbed({ url, title = 'Video' }: VideoEmbedProps) {
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(false)

  console.log('[VideoEmbed] Rendering with react-player:', url)

  // TEST: Basic iframe to see if ANY iframe works
  return (
    <div className="w-full aspect-video bg-[#141212] rounded-lg overflow-hidden">
      <iframe
        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
        className="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      {/* Debug display */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-xs p-2">
        Test: Basic YouTube iframe | URL: {url}
      </div>
    </div>
  )
}
