'use client'

interface UnifiedCardProps {
  banner?: {
    type: 'image' | 'video' | null
    url: string | null
  }
  title: string
  content: string
}

export function UnifiedCard({ banner, title, content }: UnifiedCardProps) {
  const convertToEmbedUrl = (url: string): string => {
    // YouTube watch URLs
    const youtubeWatch = url.match(/youtube\.com\/watch\?v=([^&]+)/)
    if (youtubeWatch) {
      return `https://www.youtube.com/embed/${youtubeWatch[1]}`
    }

    // YouTube short URLs
    const youtubeShort = url.match(/youtu\.be\/([^?]+)/)
    if (youtubeShort) {
      return `https://www.youtube.com/embed/${youtubeShort[1]}`
    }

    // Vimeo URLs
    const vimeo = url.match(/vimeo\.com\/(\d+)/)
    if (vimeo) {
      return `https://player.vimeo.com/video/${vimeo[1]}`
    }

    // Already an embed URL or direct video
    return url
  }

  const isDirectVideo = (url: string | null) => {
    if (!url) return false
    return url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg')
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-8">
      {/* Backdrop blur */}
      <div className="absolute inset-0 bg-[#141212]/90 backdrop-blur-sm" />

      {/* Card Container */}
      <div className="relative max-w-3xl w-full bg-[#262626] rounded-2xl overflow-hidden border border-[#7f7f7f]/20 shadow-2xl">

        {/* Banner Section */}
        {banner?.url && (
          <div className="w-full aspect-video bg-[#141212]">
            {banner.type === 'image' && (
              <img
                src={banner.url}
                alt={title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            )}

            {banner.type === 'video' && (
              <>
                {isDirectVideo(banner.url) ? (
                  // Direct video file
                  <video
                    src={banner.url}
                    controls
                    className="w-full h-full object-cover"
                    preload="metadata"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  // Embedded video (YouTube/Vimeo)
                  <iframe
                    src={convertToEmbedUrl(banner.url)}
                    title={title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </>
            )}
          </div>
        )}

        {/* Content Section */}
        <div className="p-8 sm:p-12">
          {/* Title */}
          <h2 className="text-3xl sm:text-4xl font-bold text-[#fafafa] mb-6">
            {title}
          </h2>

          {/* Text Body */}
          {content && (
            <div className="text-lg text-gray-300 leading-relaxed whitespace-pre-wrap">
              {content}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
