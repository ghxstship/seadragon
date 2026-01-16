
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"

interface AlbumPageProps {
  params: Promise<{ album: string }>
}

export async function generateMetadata({ params }: AlbumPageProps): Promise<Metadata> {
  const { album } = await params
  return {
    title: `${album.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())} Photo Album | ATLVS + GVTEWAY`,
    description: `Browse our ${album.replace(/-/g, ' ')} photo collection showcasing stunning travel photography.`,
  }
}

export default async function AlbumPage({ params }: AlbumPageProps) {
  const { album } = await params
  const albumName = album.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <nav className="text-sm text-neutral-600 mb-4">
            <a href="/gallery" className="hover:text-accent-secondary">Gallery</a>
            <span className="mx-2">/</span>
            <a href="/gallery/photos" className="hover:text-accent-secondary">Photos</a>
            <span className="mx-2">/</span>
            <span className="text-neutral-900">{albumName}</span>
          </nav>
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">{albumName}</h1>
          <p className="text-lg text-neutral-600 mb-4">
            A curated collection of stunning photographs capturing the essence of {albumName.toLowerCase()}.
          </p>
          <div className="flex items-center space-x-6 text-sm text-neutral-600">
            <span> 24 photos</span>
            <span>•</span>
            <span> {albumName}</span>
            <span>•</span>
            <span> March 2024</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Sample photos in the album */}
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="aspect-square bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-primary-foreground text-3xl">️</span>
                </div>
                <div className="absolute inset-0 bg-neutral-900 bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                  <span className="text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity text-2xl"></span>
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-sm font-medium text-neutral-900 group-hover:text-accent-secondary transition-colors">
                  Photo {i + 1}
                </h3>
                <p className="text-xs text-neutral-600">Captured at {albumName.toLowerCase()}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">About This Album</h2>
          <p className="text-neutral-700 mb-4">
            This collection showcases the breathtaking beauty and cultural richness of {albumName.toLowerCase()}.
            From stunning landscapes to vibrant local culture, these photographs capture the essence of what makes
            this destination truly special.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-neutral-900 mb-2">Highlights Include:</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Dramatic landscapes and natural wonders</li>
                <li>• Local culture and traditional scenes</li>
                <li>• Architectural marvels and modern attractions</li>
                <li>• Food and culinary experiences</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-2">Best Time to Visit:</h3>
              <p className="text-sm text-neutral-600">
                The photos in this album were captured during the ideal season,
                showcasing {albumName.toLowerCase()} at its most beautiful.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Similar Albums</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { name: "Tropical Paradise", location: "Caribbean" },
              { name: "Mountain Adventure", location: "Rockies" },
              { name: "Urban Exploration", location: "New York" },
              { name: "Desert Wonders", location: "Arizona" }
            ].map((album, index) => (
              <div key={index} className="bg-background rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="aspect-square bg-neutral-200 rounded mb-3"></div>
                <h3 className="font-medium text-neutral-900 mb-1">{album.name}</h3>
                <p className="text-sm text-neutral-600">{album.location}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Download Options</h2>
          <p className="text-blue-800 mb-4">
            High-resolution versions of these photos are available for personal use.
            Professional licensing available for commercial projects.
          </p>
          <div className="flex gap-4">
            <Button className="bg-accent-secondary text-primary-foreground px-6 py-3 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Download Album (Free)
            </Button>
            <Button className="bg-background text-accent-secondary border border-blue-600 px-6 py-3 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
              Commercial License
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
