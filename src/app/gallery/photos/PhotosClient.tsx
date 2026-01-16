'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function PhotosClient() {
  const [category, setCategory] = useState('all-categories')
  const [destination, setDestination] = useState('all-destinations')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">Photo Gallery</h1>
          <p className="text-lg text-neutral-600">Discover the world through stunning travel photography</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search photos..."
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
            />
          </div>
          <div className="flex gap-2">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary w-[170px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-categories">All Categories</SelectItem>
                <SelectItem value="beaches">Beaches</SelectItem>
                <SelectItem value="mountains">Mountains</SelectItem>
                <SelectItem value="cities">Cities</SelectItem>
                <SelectItem value="nature">Nature</SelectItem>
                <SelectItem value="culture">Culture</SelectItem>
              </SelectContent>
            </Select>
            <Select value={destination} onValueChange={setDestination}>
              <SelectTrigger className="px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary w-[170px]">
                <SelectValue placeholder="All Destinations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-destinations">All Destinations</SelectItem>
                <SelectItem value="asia">Asia</SelectItem>
                <SelectItem value="europe">Europe</SelectItem>
                <SelectItem value="americas">Americas</SelectItem>
                <SelectItem value="africa">Africa</SelectItem>
                <SelectItem value="oceania">Oceania</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[
            { title: "Bali Paradise", description: "Sunset beaches and rice terraces", photos: 24, featured: true },
            { title: "Tokyo Nights", description: "Neon lights and urban energy", photos: 18, featured: false },
            { title: "Swiss Alps", description: "Mountain peaks and alpine lakes", photos: 32, featured: false },
            { title: "Santorini Sunsets", description: "Cliffside villages and Aegean Sea", photos: 16, featured: true },
            { title: "Machu Picchu", description: "Ancient ruins and Andean peaks", photos: 28, featured: false },
            { title: "Dubai Luxury", description: "Modern architecture and desert adventures", photos: 22, featured: false }
          ].map((album, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="relative mb-4">
                <div className="aspect-square bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-primary-foreground text-4xl"></span>
                  </div>
                </div>
                {album.featured && (
                  <div className="absolute top-2 left-2 bg-semantic-warning text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                    Featured
                  </div>
                )}
                <div className="absolute bottom-2 right-2 bg-neutral-900 bg-opacity-75 text-primary-foreground px-2 py-1 rounded text-xs">
                  {album.photos} photos
                </div>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-1 group-hover:text-accent-secondary transition-colors">
                {album.title}
              </h3>
              <p className="text-sm text-neutral-600">{album.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Popular Categories</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: "️", label: "Beaches", count: "247 albums" },
              { icon: "️", label: "Mountains", count: "189 albums" },
              { icon: "️", label: "Cities", count: "312 albums" },
              { icon: "", label: "Sunsets", count: "156 albums" }
            ].map((item) => (
              <div key={item.label} className="text-center p-4 border border-neutral-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer">
                <span className="text-3xl mb-2 block">{item.icon}</span>
                <h3 className="font-medium text-neutral-900 mb-1">{item.label}</h3>
                <p className="text-sm text-neutral-600">{item.count}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Recent Uploads</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="aspect-square bg-neutral-200 rounded-lg cursor-pointer hover:opacity-75 transition-opacity">
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-neutral-400 text-2xl"></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Become a Contributor</h2>
          <p className="text-blue-800 mb-4">
            Share your travel photography with our community. Get featured in our galleries and earn travel credits.
          </p>
          <div className="flex gap-4">
            <Button className="bg-accent-secondary text-primary-foreground px-6 py-3 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Upload Photos
            </Button>
            <Button className="bg-background text-accent-secondary border border-blue-600 px-6 py-3 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
              Photographer Guidelines
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
