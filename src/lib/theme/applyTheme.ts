import type { ThemeConfig, ThemeMode } from './types'

/**
 * Apply theme configuration to DOM
 * Sets CSS variables on :root element
 */
export function applyThemeToDOM(theme: ThemeConfig, mode: ThemeMode): void {
  const root = document.documentElement

  // Apply color variables
  root.style.setProperty('--whop-orange', theme.colors.primary)
  root.style.setProperty('--whop-orange-hover', theme.colors.primaryHover)
  root.style.setProperty('--whop-dark', theme.colors.background)
  root.style.setProperty('--whop-charcoal', theme.colors.surface)
  root.style.setProperty('--whop-gray', theme.colors.border)
  root.style.setProperty('--whop-white', theme.colors.foreground)

  // Apply semantic tokens
  root.style.setProperty('--background', theme.colors.background)
  root.style.setProperty('--foreground', theme.colors.foreground)
  root.style.setProperty('--accent', theme.colors.accent)
  root.style.setProperty('--muted', theme.colors.muted)
  root.style.setProperty('--border', theme.colors.border)

  // Apply surface colors
  root.style.setProperty('--surface', theme.colors.surface)
  root.style.setProperty('--elevated', theme.colors.elevated)

  // Apply state colors
  root.style.setProperty('--success', theme.colors.success)
  root.style.setProperty('--warning', theme.colors.warning)
  root.style.setProperty('--error', theme.colors.error)
  root.style.setProperty('--info', theme.colors.info)

  // Apply border radius
  root.style.setProperty('--radius-sm', theme.borderRadius.sm)
  root.style.setProperty('--radius-md', theme.borderRadius.md)
  root.style.setProperty('--radius-lg', theme.borderRadius.lg)
  root.style.setProperty('--radius-xl', theme.borderRadius.xl)
  root.style.setProperty('--radius-2xl', theme.borderRadius['2xl'])
  root.style.setProperty('--radius-full', theme.borderRadius.full)

  // Apply spacing scale
  root.style.setProperty('--spacing-scale', theme.spacing.scale.toString())

  // Apply data attribute for CSS selectors
  root.setAttribute('data-theme', theme.id)
  root.setAttribute('data-mode', mode)

  // Apply custom CSS if provided
  if (theme.customCSS) {
    let styleEl = document.getElementById('compass-custom-theme-css')

    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.id = 'compass-custom-theme-css'
      document.head.appendChild(styleEl)
    }

    styleEl.textContent = theme.customCSS
  }
}

/**
 * Generate CSS variable string from theme
 * Useful for SSR or static generation
 */
export function generateThemeCSS(theme: ThemeConfig): string {
  return `
    :root {
      /* Whop Brand Colors */
      --whop-orange: ${theme.colors.primary};
      --whop-orange-hover: ${theme.colors.primaryHover};
      --whop-dark: ${theme.colors.background};
      --whop-charcoal: ${theme.colors.surface};
      --whop-gray: ${theme.colors.border};
      --whop-white: ${theme.colors.foreground};

      /* Semantic tokens */
      --background: ${theme.colors.background};
      --foreground: ${theme.colors.foreground};
      --accent: ${theme.colors.accent};
      --muted: ${theme.colors.muted};
      --border: ${theme.colors.border};
      --surface: ${theme.colors.surface};
      --elevated: ${theme.colors.elevated};

      /* State colors */
      --success: ${theme.colors.success};
      --warning: ${theme.colors.warning};
      --error: ${theme.colors.error};
      --info: ${theme.colors.info};

      /* Border radius */
      --radius-sm: ${theme.borderRadius.sm};
      --radius-md: ${theme.borderRadius.md};
      --radius-lg: ${theme.borderRadius.lg};
      --radius-xl: ${theme.borderRadius.xl};
      --radius-2xl: ${theme.borderRadius['2xl']};
      --radius-full: ${theme.borderRadius.full};

      /* Spacing */
      --spacing-scale: ${theme.spacing.scale};
    }

    ${theme.customCSS || ''}
  `.trim()
}
