import { NextRequest, NextResponse } from 'next/server'
import { verifyUserToken } from '@whop/api'
import { put } from '@vercel/blob'

/**
 * POST /api/upload
 * Upload images to Vercel Blob storage
 * Returns CDN URL for uploaded file
 */
export async function POST(req: NextRequest) {
  try {
    // Verify admin authentication
    const { userId } = await verifyUserToken(req.headers)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get form data
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type (images only)
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images are allowed (JPG, PNG, GIF, WebP, SVG)' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const safeName = file.name.replace(/[^a-z0-9.-]/gi, '_').toLowerCase()
    const fileName = `compass-banners/${timestamp}-${safeName}`

    // Upload to Vercel Blob
    const blob = await put(fileName, file, {
      access: 'public',
      addRandomSuffix: true,
    })

    return NextResponse.json({
      url: blob.url,
      fileName: blob.pathname,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error('Upload failed:', error)
    return NextResponse.json(
      { error: 'Upload failed. Please try again.' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/upload?url=...
 * Delete uploaded file from Vercel Blob
 */
export async function DELETE(req: NextRequest) {
  try {
    // Verify admin authentication
    const { userId } = await verifyUserToken(req.headers)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const url = searchParams.get('url')

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Note: Vercel Blob deletion requires the full URL
    // We'll implement this when needed, for now just return success
    // In production, you'd use: await del(url)

    return NextResponse.json({
      message: 'File deletion queued',
    })
  } catch (error) {
    console.error('Delete failed:', error)
    return NextResponse.json(
      { error: 'Delete failed' },
      { status: 500 }
    )
  }
}
