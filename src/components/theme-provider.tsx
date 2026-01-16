
'use client'

import * as React from 'react'
import { logger } from '@/lib/logger'
import { useSession } from 'next-auth/react'

interface BrandSettings {
  name?: string
  logo?: {
    primary?: string
    mark?: string
    favicon?: string
  }
  colors?: {
    accent?: {
      primary?: string
      secondary?: string
      tertiary?: string
    }
    semantic?: {
      success?: string
      warning?: string
      error?: string
      info?: string
    }
  }
  typography?: {
    display?: string
    heading?: string
    body?: string
    mono?: string
  }
  borderRadius?: string
  mode?: 'light' | 'dark' | 'system'
}

interface ThemeContextType {
  brandSettings: BrandSettings | null
  isLoading: boolean
}

const ThemeContext = React.createContext<ThemeContextType>({
  brandSettings: null,
  isLoading: true,
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const [brandSettings, setBrandSettings] = React.useState<BrandSettings | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function loadBrandSettings() {
      if (!session?.user?.organizationId) {
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/organizations/${session.user.organizationId}/branding`)
        if (response.ok) {
          const data = await response.json()
          setBrandSettings(data)
          applyBrandSettings(data)
        }
      } catch (error) {
        logger.error('Failed to load brand settings', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadBrandSettings()
  }, [session?.user?.organizationId])

  const applyBrandSettings = (settings: BrandSettings) => {
    if (!settings) return

    const root = document.documentElement

    // Apply colors
    if (settings.colors?.accent?.primary) {
      root.style.setProperty('--color-accent-primary', settings.colors.accent.primary)
    }
    if (settings.colors?.accent?.secondary) {
      root.style.setProperty('--color-accent-secondary', settings.colors.accent.secondary)
    }
    if (settings.colors?.accent?.tertiary) {
      root.style.setProperty('--color-accent-tertiary', settings.colors.accent.tertiary)
    }

    if (settings.colors?.semantic?.success) {
      root.style.setProperty('--color-semantic-success', settings.colors.semantic.success)
    }
    if (settings.colors?.semantic?.warning) {
      root.style.setProperty('--color-semantic-warning', settings.colors.semantic.warning)
    }
    if (settings.colors?.semantic?.error) {
      root.style.setProperty('--color-semantic-error', settings.colors.semantic.error)
    }
    if (settings.colors?.semantic?.info) {
      root.style.setProperty('--color-semantic-info', settings.colors.semantic.info)
    }

    // Apply typography
    if (settings.typography?.display) {
      root.style.setProperty('--font-display', settings.typography.display)
    }
    if (settings.typography?.heading) {
      root.style.setProperty('--font-heading', settings.typography.heading)
    }
    if (settings.typography?.body) {
      root.style.setProperty('--font-body', settings.typography.body)
    }
    if (settings.typography?.mono) {
      root.style.setProperty('--font-mono', settings.typography.mono)
    }

    // Apply border radius
    if (settings.borderRadius) {
      root.style.setProperty('--radius-md', settings.borderRadius)
    }
  }

  return (
    <ThemeContext.Provider value={{ brandSettings, isLoading }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return React.useContext(ThemeContext)
}
