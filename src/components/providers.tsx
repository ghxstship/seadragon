
"use client"

import { useEffect } from "react"

import { SessionProvider, useSession } from 'next-auth/react'
import { ThemeProvider as LegacyThemeProvider } from "@/components/theme-provider"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { BehaviorProvider } from "@/contexts/BehaviorContext"
import { BrandProvider } from "@/contexts/BrandContext"
import { PWAProvider } from "@/components/pwa-provider"
import { CookieConsent } from "@/components/ui/cookie-consent"
import { CommandPalette } from "@/components/ui/command-palette"

function BehaviorWrapper({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()

  const behaviorProps = {
    userRole: session?.user?.role || 'user',
    ...(session?.user?.id ? { userId: session.user.id } : {}),
  }
  
  return (
    <BehaviorProvider {...behaviorProps}>
      {children}
    </BehaviorProvider>
  )
}

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const root = document.documentElement
    root.setAttribute("data-brand", "atlvs")
    root.setAttribute("data-brand-mode", "branded")
  }, [])

  return (
    <SessionProvider>
      <BrandProvider>
        <ThemeProvider defaultTheme="auto">
          <LegacyThemeProvider>
            <BehaviorWrapper>
              <PWAProvider>
                {children}
                <CommandPalette />
                <CookieConsent/>
              </PWAProvider>
            </BehaviorWrapper>
          </LegacyThemeProvider>
        </ThemeProvider>
      </BrandProvider>
    </SessionProvider>
  )
}
