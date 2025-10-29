import type { ThemeConfig } from './types'

/**
 * Default Whop Dark Theme
 * Based on official Whop brand guidelines (brand.whop.com)
 */
export const whopDarkTheme: ThemeConfig = {
  id: 'whop-dark',
  name: 'Whop Dark',
  companyId: '', // Will be set per company

  colors: {
    // Whop Brand Colors
    primary: '#fa4616',
    primaryHover: '#e03d12',
    secondary: '#262626',
    accent: '#fa4616',

    // Backgrounds
    background: '#141212',
    surface: '#262626',
    elevated: '#333333',

    // Text
    foreground: '#fafafa',
    muted: '#7f7f7f',
    subtle: '#9ca3af',

    // Borders
    border: '#7f7f7f',
    borderFocus: '#fa4616',

    // States
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },

  typography: {
    fontFamily: {
      heading: 'var(--font-inter), system-ui, sans-serif',
      body: 'var(--font-inter), system-ui, sans-serif',
      mono: 'var(--font-geist-mono), ui-monospace, monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },

  spacing: {
    scale: 1, // Default spacing
  },

  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },

  mode: 'dark',
}

/**
 * Whop Light Theme
 * Light variant for accessibility
 */
export const whopLightTheme: ThemeConfig = {
  ...whopDarkTheme,
  id: 'whop-light',
  name: 'Whop Light',

  colors: {
    // Whop Brand Colors (same)
    primary: '#fa4616',
    primaryHover: '#e03d12',
    secondary: '#f0f0f0',
    accent: '#fa4616',

    // Backgrounds (inverted)
    background: '#fafafa',
    surface: '#ffffff',
    elevated: '#f8f8f8',

    // Text (inverted)
    foreground: '#141212',
    muted: '#7f7f7f',
    subtle: '#9ca3af',

    // Borders
    border: '#dfdfdf',
    borderFocus: '#fa4616',

    // States
    success: '#059669',
    warning: '#d97706',
    error: '#dc2626',
    info: '#2563eb',
  },

  mode: 'light',
}

/**
 * Minimal Theme
 * Clean, understated design
 */
export const minimalTheme: ThemeConfig = {
  ...whopDarkTheme,
  id: 'minimal',
  name: 'Minimal',

  colors: {
    primary: '#000000',
    primaryHover: '#1a1a1a',
    secondary: '#f5f5f5',
    accent: '#000000',

    background: '#ffffff',
    surface: '#fafafa',
    elevated: '#f5f5f5',

    foreground: '#000000',
    muted: '#737373',
    subtle: '#a3a3a3',

    border: '#e5e5e5',
    borderFocus: '#000000',

    success: '#22c55e',
    warning: '#eab308',
    error: '#ef4444',
    info: '#3b82f6',
  },

  mode: 'light',
}

/**
 * Professional Theme
 * Corporate, business-oriented
 */
export const professionalTheme: ThemeConfig = {
  ...whopDarkTheme,
  id: 'professional',
  name: 'Professional',

  colors: {
    primary: '#1e40af',
    primaryHover: '#1e3a8a',
    secondary: '#475569',
    accent: '#0ea5e9',

    background: '#0f172a',
    surface: '#1e293b',
    elevated: '#334155',

    foreground: '#f8fafc',
    muted: '#94a3b8',
    subtle: '#cbd5e1',

    border: '#475569',
    borderFocus: '#0ea5e9',

    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },

  mode: 'dark',
}

/**
 * All available theme presets
 */
export const themePresets: Record<string, ThemeConfig> = {
  'whop-dark': whopDarkTheme,
  'whop-light': whopLightTheme,
  minimal: minimalTheme,
  professional: professionalTheme,
}

/**
 * Get default theme (Whop Dark)
 */
export const getDefaultTheme = (): ThemeConfig => whopDarkTheme

/**
 * Get theme by ID with fallback to default
 */
export const getThemeById = (id: string): ThemeConfig => {
  return themePresets[id] || whopDarkTheme
}
