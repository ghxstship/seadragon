
"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    if (isOnline) {
      // If user comes back online, redirect to home
      const timer = setTimeout(() => {
        window.location.href = '/'
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isOnline])

  const handleRetry = () => {
    window.location.reload()
  }

  const handleGoHome = () => {
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="text-6xl mb-6"></div>

          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            {isOnline ? "You're Back Online!" : "You're Offline"}
          </h1>

          <p className="text-slate-600 mb-6">
            {isOnline
              ? "Great! You're back online. Redirecting you shortly..."
              : "Don't worry! You can still browse cached content and we'll sync your data when you're back online."
            }
          </p>

          <div className="space-y-3">
            {!isOnline && (
              <>
                <Button onClick={handleRetry} className="w-full">
                  Try Again
                </Button>
                <Button variant="outline" onClick={handleGoHome} className="w-full">
                  Browse Cached Content
                </Button>
              </>
            )}

            {isOnline && (
              <Button onClick={handleGoHome} className="w-full">
                Continue to App
              </Button>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="text-xs text-slate-500 space-y-1">
              <p><strong>Offline Features Available:</strong></p>
              <ul className="text-left list-disc list-inside space-y-1 mt-2">
                <li>Browse previously viewed pages</li>
                <li>View cached profiles and experiences</li>
                <li>Access saved searches</li>
                <li>Read cached reviews</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
