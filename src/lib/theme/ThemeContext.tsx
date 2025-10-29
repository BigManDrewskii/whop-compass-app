'use client'

import { createContext, useContext } from 'react'
import type { ThemeConfig, ThemeMode, ThemeContextValue } from './types'
import { whopDarkTheme } from './presets'

/**
 * Theme Context
 * Provides theme configuration and controls throughout the app
 */
export const ThemeContext = createContext<ThemeContextValue>({
  theme: whopDarkTheme,
  mode: 'dark',
  setTheme: () => {
    console.warn('ThemeContext.setTheme called outside of ThemeProvider')
  },
  setMode: () => {
    console.warn('ThemeContext.setMode called outside of ThemeProvider')
  },
  resetTheme: () => {
    console.warn('ThemeContext.resetTheme called outside of ThemeProvider')
  },
  applyTheme: () => {
    console.warn('ThemeContext.applyTheme called outside of ThemeProvider')
  },
})

/**
 * useTheme Hook
 * Access theme configuration and controls
 *
 * @example
 * const { theme, setTheme, mode, setMode } = useTheme()
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}
