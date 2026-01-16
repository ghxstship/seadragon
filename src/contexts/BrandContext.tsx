"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"

const brandAccents = {
  atlvs: "#e53935",
  compvss: "#ffc107",
  gvteway: "#1e88e5"
} as const

type BrandKey = keyof typeof brandAccents

type BrandMode = "branded" | "white-label"

interface BrandContextValue {
  brand: BrandKey
  brandMode: BrandMode
  setBrand: (brand: BrandKey) => void
  setBrandMode: (mode: BrandMode) => void
  setBrandAndMode: (brand: BrandKey, mode: BrandMode) => void
}

const BrandContext = createContext<BrandContextValue | undefined>(undefined)

export function BrandProvider({ children }: { children: React.ReactNode }) {
  const [brand, setBrand] = useState<BrandKey>("atlvs")
  const [brandMode, setBrandMode] = useState<BrandMode>("branded")

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute("data-brand", brand)
    root.setAttribute("data-brand-mode", brandMode)

    if (brandMode === "branded") {
      const accent = brandAccents[brand]
      if (accent) {
        root.style.setProperty("--color-accent-primary", accent)
      }
    }
  }, [brand, brandMode])

  const setBrandAndMode = (nextBrand: BrandKey, mode: BrandMode) => {
    setBrand(nextBrand)
    setBrandMode(mode)
  }

  const value = useMemo<BrandContextValue>(
    () => ({ brand, brandMode, setBrand, setBrandMode, setBrandAndMode }),
    [brand, brandMode]
  )

  return <BrandContext.Provider value={value}>{children}</BrandContext.Provider>
}

export function useBrand() {
  const ctx = useContext(BrandContext)
  if (!ctx) {
    throw new Error("useBrand must be used within a BrandProvider")
  }
  return ctx
}
