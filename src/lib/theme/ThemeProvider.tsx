'use client'

import { useState, useEffect, type ReactNode } from 'react'
import { ThemeContext } from './ThemeContext'
import type { ThemeConfig, ThemeMode } from './types'
import { whopDarkTheme } from './presets'
import { applyThemeToDOM } from './applyTheme'

interface ThemeProviderProps {
  children: ReactNode
  initialTheme?: ThemeConfig
  initialMode?: ThemeMode
}

/**
 * ThemeProvider Component
 * Wraps the app to provide theme configuration and management
 *
 * @example
 * <ThemeProvider initialTheme={customTheme}>
 *   <App />
 * </ThemeProvider>
 */
export function ThemeProvider({
  children,
  initialTheme = whopDarkTheme,
  initialMode = 'dark',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeConfig>(initialTheme)
  const [mode, setModeState] = useState<ThemeMode>(initialMode)

  // Apply theme to DOM whenever theme or mode changes
  useEffect(() => {
    applyThemeToDOM(theme, mode)
  }, [theme, mode])

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedThemeId = localStorage.getItem('compass-theme-id')
    const savedMode = localStorage.getItem('compass-theme-mode') as ThemeMode | null

    if (savedMode) {
      setModeState(savedMode)
    }

    // If there's a saved theme ID, we'd load it from the database here
    // For now, just use the initial theme
  }, [])

  const setTheme = (newTheme: ThemeConfig) => {
    setThemeState(newTheme)
    localStorage.setItem('compass-theme-id', newTheme.id)
  }

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode)
    localStorage.setItem('compass-theme-mode', newMode)
  }

  const resetTheme = () => {
    setThemeState(whopDarkTheme)
    setModeState('dark')
    localStorage.removeItem('compass-theme-id')
    localStorage.removeItem('compass-theme-mode')
  }

  const applyTheme = (newTheme: ThemeConfig) => {
    setThemeState(newTheme)
    applyThemeToDOM(newTheme, mode)
  }

  const value = {
    theme,
    mode,
    setTheme,
    setMode,
    resetTheme,
    applyTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
