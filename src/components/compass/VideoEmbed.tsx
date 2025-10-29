'use client'

import { useState } from 'react'
import { Play, AlertCircle } from 'lucide-react'

interface VideoEmbedProps {
  url: string
}

/**
 * VideoEmbed Component
 * Simple native video player for direct video files
 *
 * Supports: .mp4, .webm, .ogg, .mov files
 * Works in Whop iframe (no nested iframe issues)
 */
export function VideoEmbed({ url }: VideoEmbedProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  return (
    <div className="w-full aspect-video bg-[#141212] rounded-lg overflow-hidden relative">
      {/* Loading State */}
      {loading && !error && (
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
          </div>
        </div>
      )}

      {/* Native Video Player */}
      <video
        src={url}
        controls
        className="w-full h-full object-cover"
        preload="metadata"
        onLoadedData={() => setLoading(false)}
        onError={() => {
          setLoading(false)
          setError(true)
        }}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  )
}
