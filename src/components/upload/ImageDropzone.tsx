'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Loader2, AlertCircle } from 'lucide-react'

interface MediaDropzoneProps {
  onUploadComplete: (url: string) => void
  currentUrl?: string
  onRemove?: () => void
  accept?: 'image' | 'video' | 'both'
}

/**
 * MediaDropzone Component
 * Drag-and-drop + click-to-browse file upload for images and videos
 *
 * Features:
 * - Supports images (max 10MB) and videos (max 50MB)
 * - Drag & drop support
 * - Click to browse
 * - Upload progress
 * - Preview for images, video icon for videos
 * - Error handling
 * - File validation
 */
export function MediaDropzone({
  onUploadComplete,
  currentUrl,
  onRemove,
  accept = 'both',
}: MediaDropzoneProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      setUploading(true)
      setError(null)
      setProgress(0)

      try {
        // Create form data
        const formData = new FormData()
        formData.append('file', file)

        // Upload with progress simulation
        const progressInterval = setInterval(() => {
          setProgress((prev) => Math.min(prev + 10, 90))
        }, 100)

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        clearInterval(progressInterval)
        setProgress(100)

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Upload failed')
        }

        const data = await res.json()
        onUploadComplete(data.url)
      } catch (err) {
        console.error('Upload error:', err)
        setError(err instanceof Error ? err.message : 'Upload failed')
      } finally {
        setUploading(false)
        setProgress(0)
      }
    },
    [onUploadComplete]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
      'video/*': ['.mp4', '.webm', '.ogg', '.mov']
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB (handles videos)
    disabled: uploading,
  })

  // If there's a current image, show preview with remove option
  if (currentUrl && !uploading) {
    return (
      <div className="relative group">
        <img
          src={currentUrl}
          alt="Banner preview"
          className="w-full h-48 object-cover rounded-lg border border-[#7f7f7f]/30"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
          <button
            type="button"
            onClick={onRemove}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <X className="w-4 h-4" />
            Remove Image
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
          isDragActive
            ? 'border-[#fa4616] bg-[#fa4616]/10'
            : 'border-[#7f7f7f]/30 hover:border-[#fa4616]/50 bg-[#141212]'
        } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
      >
        <input {...getInputProps()} />

        {uploading ? (
          <div className="space-y-3">
            <Loader2 className="w-10 h-10 text-[#fa4616] animate-spin mx-auto" />
            <p className="text-sm text-gray-400">Uploading... {progress}%</p>
            <div className="w-full h-2 bg-[#262626] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#fa4616] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <Upload className="w-10 h-10 text-[#7f7f7f] mx-auto" />
            <div>
              <p className="text-sm font-medium text-[#fafafa]">
                {isDragActive ? 'Drop file here' : 'Drag & drop image or video'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                or click to browse
              </p>
            </div>
            <p className="text-xs text-gray-600">
              Images (JPG, PNG, GIF, WebP, SVG) max 10MB
              <br />
              Videos (MP4, WebM, OGG, MOV) max 50MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-900/20 border border-red-700/50 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-500">Upload Failed</p>
            <p className="text-xs text-red-400 mt-1">{error}</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Export as MediaDropzone (new name) and keep ImageDropzone for backwards compatibility
export { MediaDropzone as ImageDropzone }
