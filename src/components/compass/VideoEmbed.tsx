'use client'

import { useState } from 'react'
import { Play, AlertCircle, RotateCcw } from 'lucide-react'

interface VideoEmbedProps {
  url: string
  title?: string
}

/**
 * VideoEmbed Component
 * Bulletproof video embedding with loading states and error handling
 *
 * Features:
 * - Loading skeleton while iframe loads
 * - Error boundary with retry
 * - Supports YouTube, Vimeo, direct videos
 * - Proper CORS attributes
 * - Responsive 16:9 aspect ratio
 * - Fallback UI for failed embeds
 */
export function VideoEmbed({ url, title = 'Video' }: VideoEmbedProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  const convertToEmbedUrl = (videoUrl: string): string => {
    // YouTube watch URLs
    const youtubeWatch = videoUrl.match(/youtube\.com\/watch\?v=([^&]+)/)
    if (youtubeWatch) {
      return `https://www.youtube.com/embed/${youtubeWatch[1]}`
    }

    // YouTube short URLs
    const youtubeShort = videoUrl.match(/youtu\.be\/([^?]+)/)
    if (youtubeShort) {
      return `https://www.youtube.com/embed/${youtubeShort[1]}`
    }

    // Vimeo URLs
    const vimeo = videoUrl.match(/vimeo\.com\/(\d+)/)
    if (vimeo) {
      return `https://player.vimeo.com/video/${vimeo[1]}`
    }

    // Loom share URLs (convert to embed)
    const loomShare = videoUrl.match(/loom\.com\/share\/([a-zA-Z0-9]+)/)
    if (loomShare) {
      return `https://www.loom.com/embed/${loomShare[1]}`
    }

    // Loom embed URLs (already in correct format)
    if (videoUrl.includes('loom.com/embed/')) {
      return videoUrl
    }

    // Already an embed URL or direct video
    return videoUrl
  }

  const isDirectVideo = (videoUrl: string): boolean => {
    return (
      videoUrl.endsWith('.mp4') ||
      videoUrl.endsWith('.webm') ||
      videoUrl.endsWith('.ogg') ||
      videoUrl.endsWith('.mov')
    )
  }

  const handleLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  const handleRetry = () => {
    setIsLoading(true)
    setHasError(false)
    setRetryCount(retryCount + 1)
  }

  const embedUrl = convertToEmbedUrl(url)
  const isDirect = isDirectVideo(url)

  return (
    <div className="relative w-full">
      {/* Loading Skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-[#262626] rounded-lg flex items-center justify-center z-10">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto bg-[#fa4616]/20 rounded-full flex items-center justify-center">
              <Play className="w-8 h-8 text-[#fa4616] animate-pulse" />
            </div>
            <p className="text-sm text-gray-400">Loading video...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="bg-[#262626] rounded-lg p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Video Failed to Load</h3>
          <p className="text-sm text-gray-400 mb-4">
            The video could not be loaded. This might be due to:
          </p>
          <ul className="text-xs text-gray-500 text-left max-w-sm mx-auto mb-6 space-y-1">
            <li>• Invalid video URL</li>
            <li>• Network connection issues</li>
            <li>• Video platform restrictions</li>
            <li>• CORS or privacy settings</li>
          </ul>
          <button
            onClick={handleRetry}
            className="inline-flex items-center px-4 py-2 bg-[#fa4616] hover:bg-[#e03d12] text-white rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      )}

      {/* Direct Video File */}
      {!hasError && isDirect && (
        <video
          key={`video-${retryCount}`}
          src={url}
          controls
          className="w-full rounded-lg shadow-2xl"
          preload="metadata"
          onLoadedData={handleLoad}
          onError={handleError}
        >
          Your browser does not support the video tag.
        </video>
      )}

      {/* Embedded Video (YouTube/Vimeo) */}
      {!hasError && !isDirect && (
        <div className="relative" style={{ paddingBottom: '56.25%' }}>
          <iframe
            key={`iframe-${retryCount}`}
            src={embedUrl}
            title={title}
            className="absolute top-0 left-0 w-full h-full rounded-lg shadow-2xl"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            onLoad={handleLoad}
            onError={handleError}
            sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
          />
        </div>
      )}
    </div>
  )
}
