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

  // Debug: Log video URL
  console.log('[VideoEmbed] Rendering video:', { url, title, isLoading, hasError })

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

  // Debug: Log converted URL
  console.log('[VideoEmbed] Converted URL:', { original: url, embed: embedUrl, isDirect })

  // Conditional rendering instead of overlays
  if (isLoading) {
    return (
      <div className="w-full aspect-video bg-[#262626] rounded-lg flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto bg-[#fa4616]/20 rounded-full flex items-center justify-center">
            <Play className="w-8 h-8 text-[#fa4616] animate-pulse" />
          </div>
          <p className="text-sm text-gray-400">Loading video...</p>
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="w-full aspect-video bg-[#262626] rounded-lg p-8 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Video Failed to Load</h3>
          <p className="text-sm text-gray-400 mb-4">
            Could not load video. Check URL or try another platform.
          </p>
          <button
            onClick={handleRetry}
            className="inline-flex items-center px-4 py-2 bg-[#fa4616] hover:bg-[#e03d12] text-white rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Direct video file
  if (isDirect) {
    return (
      <video
        key={`video-${retryCount}`}
        src={url}
        controls
        className="w-full aspect-video rounded-lg object-cover"
        preload="metadata"
        onLoadedData={handleLoad}
        onError={handleError}
      >
        Your browser does not support the video tag.
      </video>
    )
  }

  // Embedded video (YouTube/Vimeo/Loom)
  return (
    <iframe
      key={`iframe-${retryCount}`}
      src={embedUrl}
      title={title}
      className="w-full aspect-video rounded-lg border-0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      onLoad={handleLoad}
      onError={handleError}
    />
  )
}
