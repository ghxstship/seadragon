
'use client'

import { useState, useEffect, use } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Header } from "@/lib/design-system"
import { logger } from "@/lib/logger"

interface GalleryImage {
  id: string
  url: string
  title: string
  description: string
  category: string
  photographer?: string
  date?: string
}

interface GalleryVideo {
  id: string
  url: string
  thumbnail: string
  title: string
  description: string
  duration: string
  category: string
  date?: string
}

interface DestinationGalleryPageProps {
  params: Promise<{ slug: string }>
}

export default function Gallery({ params }: DestinationGalleryPageProps) {
  const { slug } = use(params)
  const destinationName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  const [images, setImages] = useState<GalleryImage[]>([])
  const [videos, setVideos] = useState<GalleryVideo[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const loadGallery = async () => {
      try {
        const res = await fetch(`/api/v1/destinations/${slug}/gallery`)
        if (res.ok) {
          const data = await res.json()
          if (!cancelled) {
            setImages(Array.isArray(data.images) ? data.images : [])
            setVideos(Array.isArray(data.videos) ? data.videos : [])
            setIsLoading(false)
          }
        } else {
          if (!cancelled) {
            setImages([])
            setVideos([])
            setIsLoading(false)
          }
        }
      } catch (error) {
        logger.error('Error loading gallery:', error)
        if (!cancelled) {
          setImages([])
          setVideos([])
          setIsLoading(false)
        }
      }
    }

    loadGallery()

    return () => { cancelled = true }
  }, [slug])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Breadcrumb */}
      <nav className="bg-muted/50 px-4 py-3">
        <div className="container mx-auto">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/destinations" className="hover:text-foreground">Destinations</Link>
            <span>/</span>
            <Link href={`/destinations/${slug}`} className="hover:text-foreground">{destinationName}</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Gallery</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
            {destinationName} Gallery
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Explore stunning photos and videos of {destinationName}.
          </p>
        </div>
      </section>

      {/* Gallery Placeholder */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <Card>
            <CardHeader>
              <CardTitle>{destinationName} Photo Gallery</CardTitle>
              <CardDescription>Photo and video gallery for this destination</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Gallery images and videos will be displayed here.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2026 G H X S T S H I P Industries LLC. ATLVS + GVTEWAY Super App.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
