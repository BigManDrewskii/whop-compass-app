'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useWhop } from '~/components/whop-context'
import { Palette, RotateCcw, Save, Eye, Download, Upload } from 'lucide-react'
import { whopDarkTheme, whopLightTheme, minimalTheme, professionalTheme, type ThemeConfig } from '~/lib/theme'

export default function ThemeEditorPage() {
  const { access, experience } = useWhop()
  const queryClient = useQueryClient()
  const companyId = experience.company.id

  const [editedTheme, setEditedTheme] = useState<ThemeConfig>(whopDarkTheme)
  const [showPreview, setShowPreview] = useState(false)

  // Fetch current theme
  const { data: themeData, isLoading } = useQuery({
    queryKey: ['theme', companyId],
    queryFn: async () => {
      const res = await fetch(`/api/themes?companyId=${companyId}`)
      if (!res.ok) throw new Error('Failed to fetch theme')
      return res.json() as Promise<{ theme: ThemeConfig; isDefault: boolean }>
    },
    enabled: !!companyId,
  })

  // Save theme mutation
  const saveMutation = useMutation({
    mutationFn: async (theme: ThemeConfig) => {
      const res = await fetch('/api/themes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId, theme }),
      })
      if (!res.ok) throw new Error('Failed to save theme')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['theme', companyId] })
      alert('Theme saved successfully!')
    },
    onError: () => {
      alert('Failed to save theme. Please try again.')
    },
  })

  // Reset theme mutation
  const resetMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/themes?companyId=${companyId}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to reset theme')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['theme', companyId] })
      setEditedTheme(whopDarkTheme)
      alert('Theme reset to Whop default successfully!')
    },
  })

  // Update edited theme when data loads
  if (themeData && !editedTheme.companyId) {
    setEditedTheme(themeData.theme)
  }

  // Check admin access
  if (access.accessLevel !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#141212]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400">You need admin access to edit themes.</p>
        </div>
      </div>
    )
  }

  const handleColorChange = (colorKey: keyof ThemeConfig['colors'], value: string) => {
    setEditedTheme((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorKey]: value,
      },
    }))
  }

  const handlePresetSelect = (preset: ThemeConfig) => {
    setEditedTheme({ ...preset, companyId })
  }

  const handleSave = () => {
    saveMutation.mutate(editedTheme)
  }

  const handleReset = () => {
    if (confirm('Reset to Whop default theme? This will discard all customizations.')) {
      resetMutation.mutate()
    }
  }

  const handleExport = () => {
    const json = JSON.stringify(editedTheme, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `compass-theme-${companyId}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const imported = JSON.parse(text) as ThemeConfig
      setEditedTheme({ ...imported, companyId })
      alert('Theme imported successfully!')
    } catch (error) {
      alert('Invalid theme file. Please upload a valid JSON theme.')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#141212] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#fa4616] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading theme editor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#141212] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Palette className="w-8 h-8 text-[#fa4616]" />
                Theme Editor
              </h1>
              <p className="mt-2 text-gray-400">
                Customize your community's visual identity
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="inline-flex items-center px-4 py-2 bg-[#262626] border border-[#7f7f7f]/20 hover:border-[#fa4616]/50 text-white font-medium rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4 mr-2" />
                {showPreview ? 'Hide' : 'Show'} Preview
              </button>
              <button
                onClick={handleReset}
                disabled={resetMutation.isPending}
                className="inline-flex items-center px-4 py-2 bg-[#262626] border border-[#7f7f7f]/20 hover:border-[#fa4616]/50 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </button>
              <button
                onClick={handleSave}
                disabled={saveMutation.isPending}
                className="inline-flex items-center px-4 py-2 bg-[#fa4616] hover:bg-[#e03d12] text-white font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {saveMutation.isPending ? 'Saving...' : 'Save Theme'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Preset Selector */}
          <div className="lg:col-span-1">
            <div className="bg-[#262626] border border-[#7f7f7f]/20 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Theme Presets</h2>
              <div className="space-y-2">
                {[
                  { name: 'Whop Dark', theme: whopDarkTheme },
                  { name: 'Whop Light', theme: whopLightTheme },
                  { name: 'Minimal', theme: minimalTheme },
                  { name: 'Professional', theme: professionalTheme },
                ].map((preset) => (
                  <button
                    key={preset.theme.id}
                    onClick={() => handlePresetSelect(preset.theme)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      editedTheme.id === preset.theme.id
                        ? 'bg-[#fa4616] text-white'
                        : 'bg-[#141212] text-gray-300 hover:bg-[#333333]'
                    }`}
                  >
                    <div className="font-medium">{preset.name}</div>
                    <div className="text-sm opacity-75 mt-1">
                      <span
                        className="inline-block w-4 h-4 rounded-full mr-1"
                        style={{ backgroundColor: preset.theme.colors.primary }}
                      />
                      {preset.theme.mode === 'dark' ? 'Dark mode' : 'Light mode'}
                    </div>
                  </button>
                ))}
              </div>

              {/* Import/Export */}
              <div className="mt-6 pt-6 border-t border-[#7f7f7f]/20">
                <h3 className="text-sm font-semibold text-white mb-3">Import/Export</h3>
                <div className="space-y-2">
                  <button
                    onClick={handleExport}
                    className="w-full inline-flex items-center justify-center px-4 py-2 bg-[#141212] border border-[#7f7f7f]/30 text-white text-sm rounded-lg hover:bg-[#333333] transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Theme JSON
                  </button>
                  <label className="w-full inline-flex items-center justify-center px-4 py-2 bg-[#141212] border border-[#7f7f7f]/30 text-white text-sm rounded-lg hover:bg-[#333333] transition-colors cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    Import Theme JSON
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImport}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Color Editor */}
          <div className="lg:col-span-2">
            <div className="bg-[#262626] border border-[#7f7f7f]/20 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Colors</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Brand Colors */}
                <ColorInput
                  label="Primary"
                  value={editedTheme.colors.primary}
                  onChange={(v) => handleColorChange('primary', v)}
                />
                <ColorInput
                  label="Primary Hover"
                  value={editedTheme.colors.primaryHover}
                  onChange={(v) => handleColorChange('primaryHover', v)}
                />
                <ColorInput
                  label="Secondary"
                  value={editedTheme.colors.secondary}
                  onChange={(v) => handleColorChange('secondary', v)}
                />
                <ColorInput
                  label="Accent"
                  value={editedTheme.colors.accent}
                  onChange={(v) => handleColorChange('accent', v)}
                />

                {/* Backgrounds */}
                <div className="col-span-full pt-4 border-t border-[#7f7f7f]/20">
                  <h3 className="text-sm font-semibold text-white mb-3">Backgrounds</h3>
                </div>
                <ColorInput
                  label="Background"
                  value={editedTheme.colors.background}
                  onChange={(v) => handleColorChange('background', v)}
                />
                <ColorInput
                  label="Surface"
                  value={editedTheme.colors.surface}
                  onChange={(v) => handleColorChange('surface', v)}
                />
                <ColorInput
                  label="Elevated"
                  value={editedTheme.colors.elevated}
                  onChange={(v) => handleColorChange('elevated', v)}
                />

                {/* Text Colors */}
                <div className="col-span-full pt-4 border-t border-[#7f7f7f]/20">
                  <h3 className="text-sm font-semibold text-white mb-3">Text</h3>
                </div>
                <ColorInput
                  label="Foreground"
                  value={editedTheme.colors.foreground}
                  onChange={(v) => handleColorChange('foreground', v)}
                />
                <ColorInput
                  label="Muted"
                  value={editedTheme.colors.muted}
                  onChange={(v) => handleColorChange('muted', v)}
                />

                {/* Borders */}
                <div className="col-span-full pt-4 border-t border-[#7f7f7f]/20">
                  <h3 className="text-sm font-semibold text-white mb-3">Borders</h3>
                </div>
                <ColorInput
                  label="Border"
                  value={editedTheme.colors.border}
                  onChange={(v) => handleColorChange('border', v)}
                />
                <ColorInput
                  label="Border Focus"
                  value={editedTheme.colors.borderFocus}
                  onChange={(v) => handleColorChange('borderFocus', v)}
                />
              </div>
            </div>

            {/* Preview Panel */}
            {showPreview && (
              <div className="mt-6 bg-[#262626] border border-[#7f7f7f]/20 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Live Preview</h2>
                <div
                  className="p-8 rounded-lg"
                  style={{
                    backgroundColor: editedTheme.colors.background,
                    color: editedTheme.colors.foreground,
                  }}
                >
                  {/* Preview Card */}
                  <div
                    className="p-6 rounded-xl mb-4"
                    style={{
                      backgroundColor: editedTheme.colors.surface,
                      borderColor: editedTheme.colors.border + '33',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                    }}
                  >
                    <h3
                      className="text-2xl font-bold mb-2"
                      style={{ color: editedTheme.colors.foreground }}
                    >
                      Preview Card
                    </h3>
                    <p style={{ color: editedTheme.colors.muted }}>
                      This is how your content will look with the current theme settings.
                    </p>
                  </div>

                  {/* Preview Buttons */}
                  <div className="flex gap-3">
                    <button
                      className="px-4 py-2 rounded-lg font-medium transition-colors"
                      style={{
                        backgroundColor: editedTheme.colors.primary,
                        color: '#ffffff',
                      }}
                    >
                      Primary Button
                    </button>
                    <button
                      className="px-4 py-2 rounded-lg font-medium transition-colors"
                      style={{
                        backgroundColor: editedTheme.colors.surface,
                        borderColor: editedTheme.colors.border + '33',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        color: editedTheme.colors.foreground,
                      }}
                    >
                      Secondary Button
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Color Input Component
interface ColorInputProps {
  label: string
  value: string
  onChange: (value: string) => void
}

function ColorInput({ label, value, onChange }: ColorInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <div className="flex gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-10 rounded-lg border border-[#7f7f7f]/30 cursor-pointer bg-[#141212]"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="flex-1 px-3 py-2 bg-[#141212] border border-[#7f7f7f]/30 rounded-lg text-[#fafafa] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#fa4616] focus:border-[#fa4616] font-mono text-sm"
        />
      </div>
    </div>
  )
}
