import { NextRequest, NextResponse } from 'next/server'
import { verifyUserToken } from '@whop/api'
import { db } from '~/db'
import { companyThemes } from '~/db/schema'
import { eq } from 'drizzle-orm'
import { whopDarkTheme } from '~/lib/theme'
import type { ThemeConfig } from '~/lib/theme'

/**
 * GET /api/themes?companyId=biz_xxx
 * Fetch theme for a company
 */
export async function GET(req: NextRequest) {
  try {
    // Get company ID from query params
    const { searchParams } = new URL(req.url)
    const companyId = searchParams.get('companyId')

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      )
    }

    // Fetch theme from database
    const result = await db
      .select()
      .from(companyThemes)
      .where(eq(companyThemes.companyId, companyId))
      .limit(1)

    // If no theme found, return default
    if (!result || result.length === 0) {
      return NextResponse.json({
        theme: {
          ...whopDarkTheme,
          companyId,
        },
        isDefault: true,
      })
    }

    const dbTheme = result[0]

    // Reconstruct ThemeConfig from database
    const theme: ThemeConfig = {
      id: dbTheme.id.toString(),
      name: dbTheme.themeName || 'Custom Theme',
      companyId: dbTheme.companyId,
      colors: dbTheme.colors as ThemeConfig['colors'],
      typography: dbTheme.typography as ThemeConfig['typography'],
      borderRadius: dbTheme.borderRadius as ThemeConfig['borderRadius'],
      spacing: dbTheme.spacing as ThemeConfig['spacing'],
      mode: dbTheme.mode as 'light' | 'dark' | 'auto',
      customCSS: dbTheme.customCSS || undefined,
      createdAt: dbTheme.createdAt,
      updatedAt: dbTheme.updatedAt,
    }

    return NextResponse.json({
      theme,
      isDefault: false,
    })
  } catch (error) {
    console.error('Failed to fetch theme:', error)
    return NextResponse.json(
      { error: 'Failed to fetch theme' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/themes
 * Create or update company theme (admin only)
 */
export async function POST(req: NextRequest) {
  try {
    // Verify admin authentication
    const { userId } = await verifyUserToken(req.headers)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const body = await req.json()
    const { companyId, theme } = body as {
      companyId: string
      theme: ThemeConfig
    }

    if (!companyId || !theme) {
      return NextResponse.json(
        { error: 'Company ID and theme are required' },
        { status: 400 }
      )
    }

    // Check if theme already exists for this company
    const existing = await db
      .select()
      .from(companyThemes)
      .where(eq(companyThemes.companyId, companyId))
      .limit(1)

    if (existing && existing.length > 0) {
      // Update existing theme
      const updated = await db
        .update(companyThemes)
        .set({
          themeName: theme.name,
          colors: theme.colors,
          typography: theme.typography,
          borderRadius: theme.borderRadius,
          spacing: theme.spacing,
          mode: theme.mode,
          customCSS: theme.customCSS || null,
          updatedAt: new Date(),
        })
        .where(eq(companyThemes.companyId, companyId))
        .returning()

      return NextResponse.json({
        theme: updated[0],
        message: 'Theme updated successfully',
      })
    } else {
      // Create new theme
      const created = await db
        .insert(companyThemes)
        .values({
          companyId,
          themeName: theme.name,
          colors: theme.colors,
          typography: theme.typography,
          borderRadius: theme.borderRadius,
          spacing: theme.spacing,
          mode: theme.mode,
          customCSS: theme.customCSS || null,
        })
        .returning()

      return NextResponse.json({
        theme: created[0],
        message: 'Theme created successfully',
      }, { status: 201 })
    }
  } catch (error) {
    console.error('Failed to save theme:', error)
    return NextResponse.json(
      { error: 'Failed to save theme' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/themes?companyId=biz_xxx
 * Reset company theme to default (admin only)
 */
export async function DELETE(req: NextRequest) {
  try {
    // Verify admin authentication
    const { userId } = await verifyUserToken(req.headers)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get company ID from query params
    const { searchParams } = new URL(req.url)
    const companyId = searchParams.get('companyId')

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      )
    }

    // Delete theme
    await db
      .delete(companyThemes)
      .where(eq(companyThemes.companyId, companyId))

    return NextResponse.json({
      message: 'Theme reset to default successfully',
    })
  } catch (error) {
    console.error('Failed to delete theme:', error)
    return NextResponse.json(
      { error: 'Failed to delete theme' },
      { status: 500 }
    )
  }
}
