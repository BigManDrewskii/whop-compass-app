'use client'

import { VideoEmbed } from './VideoEmbed'

interface UnifiedCardProps {
  banner?: {
    type: 'image' | 'video' | null
    url: string | null
  }
  title: string
  content: string
}

export function UnifiedCard({ banner, title, content }: UnifiedCardProps) {

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
              <VideoEmbed url={banner.url} title={title} />
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
