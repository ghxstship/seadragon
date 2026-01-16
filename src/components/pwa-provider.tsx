
'use client'

import { useEffect, useState } from 'react'
import { logger } from '@/lib/logger'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Declare PWA install prompt event interface
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

interface PWAProviderProps {
  children: React.ReactNode
}

export function PWAProvider({ children }: PWAProviderProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            logger.info('Service worker registered', { scope: registration.scope })
          })
          .catch((registrationError) => {
            logger.error('Service worker registration failed', registrationError)
          })
      })
    }

    // Handle install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowInstallPrompt(true)
    }

    // Handle successful installation
    const handleAppInstalled = () => {
      setDeferredPrompt(null)
      setShowInstallPrompt(false)
      logger.action('pwa_installed')
    }

    // Handle online/offline status
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // No need to check initial online status since we initialize with !navigator.onLine

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        logger.action('pwa_install_accepted')
      } else {
        logger.action('pwa_install_dismissed')
      }
      setDeferredPrompt(null)
      setShowInstallPrompt(false)
    }
  }

  const handleDismissInstall = () => {
    setShowInstallPrompt(false)
  }

  return (
    <>
      {children}

      {/* Offline Indicator */}
      {isOffline && (
        <div className="fixed bottom-4 left-4 z-50">
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-semantic-warning rounded-full animate-pulse"/>
                <span className="text-sm text-orange-800">You are offline</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* PWA Install Prompt */}
      {showInstallPrompt && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">Install App</CardTitle>
                  <CardDescription>
                    Add ATLVS + GVTEWAY to your home screen for the best experience
                  </CardDescription>
                </div>
                <Badge variant="secondary">PWA</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex space-x-2">
                <Button onClick={handleInstallClick} size="sm" className="flex-1">
                  Install
                </Button>
                <Button onClick={handleDismissInstall} variant="outline" size="sm">
                  Not Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Push Notification Permission Request */}
      <PushNotificationHandler/>
    </>
  )
}

// Push Notification Handler Component
function PushNotificationHandler() {
  const [showPushPrompt, setShowPushPrompt] = useState(false)

  useEffect(() => {
    // Check if notifications are supported and not already granted/denied
    if ('Notification' in window && Notification.permission === 'default') {
      // Show prompt after a delay
      const timer = setTimeout(() => {
        setShowPushPrompt(true)
      }, 5000) // Show after 5 seconds

      return () => clearTimeout(timer)
    }

    return undefined
  }, [])

  const handleEnableNotifications = async () => {
    try {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        // Register for push notifications
        await registerForPushNotifications()
        logger.action('push_notifications_enabled')
      }
    } catch (error) {
      logger.error('Error requesting notification permission', error)
    }
    setShowPushPrompt(false)
  }

  const handleDismissNotifications = () => {
    setShowPushPrompt(false)
  }

  if (!showPushPrompt) return null

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <Card className="border-0 bg-[#1f2736] text-white shadow-[0_16px_50px_rgba(0,0,0,0.35)]">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg font-black tracking-tight">Enable Notifications</CardTitle>
              <CardDescription className="text-sm text-[#c7d2e6]">
                Get notified about event updates, deadlines, and important announcements
              </CardDescription>
            </div>
            <button
              type="button"
              onClick={handleDismissNotifications}
              aria-label="Close notification prompt"
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#c7d2e6] transition hover:bg-[#2f3a4f]/60 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#c7d2e6]/50 focus:ring-offset-2 focus:ring-offset-[#1f2736]"
            >
              <span aria-hidden className="text-xl leading-none">×</span>
            </button>
          </div>
        </CardHeader>
        <CardContent className="pt-1">
          <div className="flex gap-2">
            <Button
              onClick={handleEnableNotifications}
              className="flex-1 rounded-md bg-[#d53b38] text-white hover:bg-[#c23331]"
              size="sm"
            >
              Enable
            </Button>
            <Button
              onClick={handleDismissNotifications}
              variant="outline"
              size="sm"
              className="rounded-md border-[#334155] bg-[#e2e8f0] text-[#475569] hover:bg-[#cbd5e1]"
            >
              Not Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

async function registerForPushNotifications() {
  try {
    const registration = await navigator.serviceWorker.ready
    const vapidKey = process.env['NEXT_PUBLIC_VAPID_PUBLIC_KEY']
    if (!vapidKey) {
      throw new Error('VAPID public key is not configured')
    }

    const applicationServerKey = urlBase64ToUint8Array(vapidKey)
    const response = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscription: await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey
        })
      })
    })

    if (!response.ok) {
      throw new Error('Failed to subscribe to push notifications')
    }
  } catch (error) {
    logger.error('Error registering for push notifications', error)
  }
}

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = typeof window !== 'undefined' ? window.atob(base64) : Buffer.from(base64, 'base64').toString('binary')
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray.buffer
}
