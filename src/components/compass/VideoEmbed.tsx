'use client'

import { useState } from 'react'
import { Play, AlertCircle } from 'lucide-react'
import ReactPlayer from 'react-player'

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

  return (
    <div className="w-full aspect-video bg-[#141212] rounded-lg overflow-hidden relative">
      {/* Loading State */}
      {!ready && !error && (
        <div className="absolute inset-0 bg-[#262626] flex items-center justify-center z-10">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto bg-[#fa4616]/20 rounded-full flex items-center justify-center">
              <Play className="w-8 h-8 text-[#fa4616] animate-pulse" />
            </div>
            <p className="text-sm text-gray-400">Loading video...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 bg-[#262626] flex items-center justify-center p-4 z-10">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <p className="text-sm text-gray-400">Video failed to load</p>
            <p className="text-xs text-gray-500 mt-2">URL: {url}</p>
          </div>
        </div>
      )}

      {/* ReactPlayer */}
      <ReactPlayer
        url={url}
        width="100%"
        height="100%"
        controls
        playing={false}
        onReady={() => {
          console.log('[VideoEmbed] Video ready')
          setReady(true)
        }}
        onError={(e) => {
          console.error('[VideoEmbed] Video error:', e)
          setError(true)
        }}
      />
    </div>
  )
}
