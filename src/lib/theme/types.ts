/**
 * Theme System Types for Whop Compass App
 * Allows per-company theme customization while maintaining Whop brand standards
 */

export interface ThemeColors {
  // Brand Colors
  primary: string // Main brand color (default: Whop orange #fa4616)
  primaryHover: string // Hover state for primary
  secondary: string // Secondary brand color
  accent: string // Call-to-action color

  // Backgrounds
  background: string // Main page background (default: #141212)
  surface: string // Cards, modals (default: #262626)
  elevated: string // Hover states, elevated surfaces

  // Text
  foreground: string // Primary text (default: #fafafa)
  muted: string // Secondary text
  subtle: string // Tertiary text, placeholders

  // Borders
  border: string // Default border color (default: #7f7f7f)
  borderFocus: string // Focus state borders

  // States
  success: string
  warning: string
  error: string
  info: string
}

export interface ThemeTypography {
  fontFamily: {
    heading: string // Headlines, titles
    body: string // Body text, paragraphs
    mono: string // Code, technical
  }
  fontSize: {
    xs: string
    sm: string
    base: string
    lg: string
    xl: string
    '2xl': string
    '3xl': string
    '4xl': string
    '5xl': string
  }
  fontWeight: {
    light: number
    normal: number
    medium: number
    semibold: number
    bold: number
    extrabold: number
  }
  lineHeight: {
    tight: string
    normal: string
    relaxed: string
  }
}

export interface ThemeSpacing {
  scale: number // Multiplier for spacing (1 = default, 1.5 = generous, 0.75 = compact)
}

export interface ThemeBorderRadius {
  sm: string
  md: string
  lg: string
  xl: string
  '2xl': string
  full: string
}

export interface ThemeConfig {
  id: string
  name: string
  companyId: string

  colors: ThemeColors
  typography: ThemeTypography
  spacing: ThemeSpacing
  borderRadius: ThemeBorderRadius

  mode: 'light' | 'dark' | 'auto'
  customCSS?: string // Advanced: custom CSS overrides

  createdAt?: Date
  updatedAt?: Date
}

export type ThemeMode = 'light' | 'dark' | 'auto'

export interface ThemeContextValue {
  theme: ThemeConfig
  mode: ThemeMode
  setTheme: (theme: ThemeConfig) => void
  setMode: (mode: ThemeMode) => void
  resetTheme: () => void
  applyTheme: (theme: ThemeConfig) => void
}
