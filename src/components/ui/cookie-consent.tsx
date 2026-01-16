
'use client'

import { useState, useEffect } from 'react'
import { storage } from '@/lib/storage'
import { Button } from '@/components/ui/button'
import { UI_STRINGS } from '@/lib/constants/ui-strings'

// Type guard for gtag function
function hasGtag(window: unknown): window is Window & { gtag: (...args: unknown[]) => void } {
  return typeof window === 'object' && window !== null && 'gtag' in window && typeof (window as any).gtag === 'function'
}
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

interface CookiePreferences {
  essential: boolean
  analytics: boolean
  marketing: boolean
  functional: boolean
}

const defaultPreferences: CookiePreferences = {
  essential: true, // Always true, cannot be disabled
  analytics: false,
  marketing: false,
  functional: false
}

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences)

  useEffect(() => {
    const saved = storage.local.get<CookiePreferences>('cookie-preferences')
    if (saved) {
      setPreferences({ ...defaultPreferences, ...saved })
    } else {
      setShowBanner(true)
    }
  }, [])

  const savePreferences = (prefs: CookiePreferences) => {
    storage.local.set('cookie-preferences', prefs)
    setPreferences(prefs)
    setShowBanner(false)
    setShowSettings(false)

    // Apply preferences (implement cookie management here)
    applyCookiePreferences(prefs)
  }

  const acceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true,
      functional: true
    }
    savePreferences(allAccepted)
  }

  const rejectAll = () => {
    const allRejected = {
      essential: true, // Essential always true
      analytics: false,
      marketing: false,
      functional: false
    }
    savePreferences(allRejected)
  }

  const applyCookiePreferences = (prefs: CookiePreferences) => {
    // Disable/enable analytics cookies
    if (typeof window !== 'undefined' && hasGtag(window)) {
      if (prefs.analytics) {
        window.gtag('consent', 'update', {
          analytics_storage: 'granted'
        })
      } else {
        window.gtag('consent', 'update', {
          analytics_storage: 'denied'
        })
      }
    }

    // Disable/enable marketing cookies
    if (typeof window !== 'undefined' && hasGtag(window)) {
      if (prefs.marketing) {
        window.gtag('consent', 'update', {
          ad_storage: 'granted'
        })
      } else {
        window.gtag('consent', 'update', {
          ad_storage: 'denied'
        })
      }
    }

    // Handle functional cookies
    // Implement based on your functional cookie providers
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-[var(--border-default)] bg-[var(--surface-default)] shadow-[0_20px_60px_rgba(0,0,0,0.35)]" style={{ fontFamily: 'Share Tech, sans-serif' }}>
        <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 space-y-3">
            <h3 className="text-2xl text-[var(--text-primary)] capitalize" style={{ fontFamily: 'Anton, var(--font-sans)' }}>
              {UI_STRINGS.COOKIE_PREFERENCES}
            </h3>
            <p className="text-sm text-[var(--text-secondary)]" style={{ fontFamily: 'Share Tech, sans-serif' }}>
              {UI_STRINGS.COOKIE_DESCRIPTION}
            </p>
          </div>

          <div className="flex flex-wrap gap-2" style={{ fontFamily: 'Share Tech Mono, monospace' }}>
            <Button variant="outline" size="sm" className="h-10 rounded-full border-[var(--border-default)] bg-[var(--surface-default)] text-[var(--text-primary)] hover:border-[var(--color-accent-primary)]" onClick={rejectAll}>
              {UI_STRINGS.REJECT_ALL}
            </Button>
            <Dialog open={showSettings} onOpenChange={setShowSettings}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-10 rounded-full border-[var(--border-default)] bg-[var(--surface-default)] text-[var(--text-primary)] hover:border-[var(--color-accent-primary)]">
                  {UI_STRINGS.CUSTOMIZE}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md border-[var(--border-default)] bg-[var(--surface-default)] text-[var(--text-primary)]">
                <DialogHeader>
                  <DialogTitle className="text-lg" style={{ fontFamily: 'Bebas Neue, var(--font-sans)', letterSpacing: '0.04em' }}>
                    {UI_STRINGS.COOKIE_SETTINGS}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 text-sm" style={{ fontFamily: 'Share Tech, sans-serif' }}>
                  <div className="flex items-start gap-3 rounded-xl border border-[var(--border-default)] bg-[var(--surface-default)] p-3">
                    <Checkbox id="essential" checked={preferences.essential} disabled />
                    <div>
                      <Label htmlFor="essential" className="font-medium text-[var(--text-primary)]">{UI_STRINGS.ESSENTIAL_COOKIES}</Label>
                      <p className="text-xs text-[var(--text-secondary)]">{UI_STRINGS.ESSENTIAL_COOKIES_DESC}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl border border-[var(--border-default)] bg-[var(--surface-default)] p-3">
                    <Checkbox
                      id="analytics"
                      checked={preferences.analytics}
                      onCheckedChange={(checked) =>
                        setPreferences(prev => ({ ...prev, analytics: checked as boolean }))
                      }
                    />
                    <div>
                      <Label htmlFor="analytics" className="font-medium text-[var(--text-primary)]">{UI_STRINGS.ANALYTICS_COOKIES}</Label>
                      <p className="text-xs text-[var(--text-secondary)]">{UI_STRINGS.ANALYTICS_COOKIES_DESC}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl border border-[var(--border-default)] bg-[var(--surface-default)] p-3">
                    <Checkbox
                      id="marketing"
                      checked={preferences.marketing}
                      onCheckedChange={(checked) =>
                        setPreferences(prev => ({ ...prev, marketing: checked as boolean }))
                      }
                    />
                    <div>
                      <Label htmlFor="marketing" className="font-medium text-[var(--text-primary)]">{UI_STRINGS.MARKETING_COOKIES}</Label>
                      <p className="text-xs text-[var(--text-secondary)]">{UI_STRINGS.MARKETING_COOKIES_DESC}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl border border-[var(--border-default)] bg-[var(--surface-default)] p-3">
                    <Checkbox
                      id="functional"
                      checked={preferences.functional}
                      onCheckedChange={(checked) =>
                        setPreferences(prev => ({ ...prev, functional: checked as boolean }))
                      }
                    />
                    <div>
                      <Label htmlFor="functional" className="font-medium text-[var(--text-primary)]">{UI_STRINGS.FUNCTIONAL_COOKIES}</Label>
                      <p className="text-xs text-[var(--text-secondary)]">{UI_STRINGS.FUNCTIONAL_COOKIES_DESC}</p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2" style={{ fontFamily: 'Share Tech Mono, monospace' }}>
                    <Button variant="outline" className="h-9 rounded-full border-[var(--border-default)] bg-[var(--surface-default)] text-[var(--text-primary)] hover:border-[var(--color-accent-primary)]" onClick={() => setShowSettings(false)}>
                      {UI_STRINGS.CANCEL}
                    </Button>
                    <Button className="h-9 rounded-full bg-[var(--color-accent-primary)] px-4 text-sm font-semibold text-white shadow transition hover:brightness-95" onClick={() => savePreferences(preferences)}>
                      {UI_STRINGS.SAVE_PREFERENCES}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button size="sm" className="h-10 rounded-full bg-[var(--color-accent-primary)] px-4 text-sm font-semibold text-white shadow transition hover:brightness-95" onClick={acceptAll}>
              {UI_STRINGS.ACCEPT_ALL}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
