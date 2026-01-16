
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: 'Travel Inspiration | ATLVS + GVTEWAY',
  description: 'Get inspired for your next trip with stories, photos, and ideas from travelers around the world.',
}

export default function InspirationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Travel Inspiration</h1>
          <p className="text-lg text-neutral-600">Stories, photos, and ideas to spark your wanderlust</p>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-8 text-primary-foreground mb-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Discover Your Next Adventure</h2>
            <p className="text-xl mb-6">Real stories from real travelers, curated to inspire your journey</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="aspect-video bg-gradient-to-br from-orange-400 to-red-500 relative">
              <div className="absolute inset-0 flex items-center justify-center text-4xl">️</div>
              <div className="absolute top-2 left-2 bg-semantic-warning text-primary-foreground px-2 py-1 rounded text-xs">
                Featured Story
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Finding Solace in the Sahara</h3>
              <p className="text-neutral-600 mb-3">A transformative journey through Morocco&apos;s vast desert landscapes</p>
              <div className="flex items-center justify-between text-sm text-neutral-500">
                <span>By Maria Rodriguez</span>
                <span>8 min read</span>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="aspect-video bg-gradient-to-br from-blue-400 to-cyan-500 relative">
              <div className="absolute inset-0 flex items-center justify-center text-4xl">️</div>
              <div className="absolute top-2 left-2 bg-accent-primary text-primary-foreground px-2 py-1 rounded text-xs">
                Photo Essay
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Patagonia: Land of Ice and Fire</h3>
              <p className="text-neutral-600 mb-3">Stunning photography from Chile and Argentina&apos;s southern frontier</p>
              <div className="flex items-center justify-between text-sm text-neutral-500">
                <span>By David Chen</span>
                <span>12 photos</span>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="aspect-video bg-gradient-to-br from-green-400 to-emerald-500 relative">
              <div className="absolute inset-0 flex items-center justify-center text-4xl"></div>
              <div className="absolute top-2 left-2 bg-semantic-success text-primary-foreground px-2 py-1 rounded text-xs">
                Food Story
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Street Food Adventures in Bangkok</h3>
              <p className="text-neutral-600 mb-3">A culinary journey through Thailand&apos;s vibrant food scene</p>
              <div className="flex items-center justify-between text-sm text-neutral-500">
                <span>By Sarah Johnson</span>
                <span>6 min read</span>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="aspect-video bg-gradient-to-br from-purple-400 to-violet-500 relative">
              <div className="absolute inset-0 flex items-center justify-center text-4xl"></div>
              <div className="absolute top-2 left-2 bg-accent-primary text-primary-foreground px-2 py-1 rounded text-xs">
                Cultural Journey
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Living with Maasai Warriors</h3>
              <p className="text-neutral-600 mb-3">Immersive experiences in Kenya&apos;s Maasai communities</p>
              <div className="flex items-center justify-between text-sm text-neutral-500">
                <span>By Ahmed Hassan</span>
                <span>10 min read</span>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="aspect-video bg-gradient-to-br from-red-400 to-pink-500 relative">
              <div className="absolute inset-0 flex items-center justify-center text-4xl">️</div>
              <div className="absolute top-2 left-2 bg-semantic-error text-primary-foreground px-2 py-1 rounded text-xs">
                Adventure
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Solo Trek to Everest Base Camp</h3>
              <p className="text-neutral-600 mb-3">A life-changing solo journey through the Himalayas</p>
              <div className="flex items-center justify-between text-sm text-neutral-500">
                <span>By Emma Thompson</span>
                <span>15 min read</span>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="aspect-video bg-gradient-to-br from-teal-400 to-cyan-500 relative">
              <div className="absolute inset-0 flex items-center justify-center text-4xl">️</div>
              <div className="absolute top-2 left-2 bg-teal-500 text-primary-foreground px-2 py-1 rounded text-xs">
                Hidden Gems
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Untouched Islands of the Seychelles</h3>
              <p className="text-neutral-600 mb-3">Exploring pristine beaches and marine life off the beaten path</p>
              <div className="flex items-center justify-between text-sm text-neutral-500">
                <span>By Lisa Wong</span>
                <span>7 min read</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Inspiration Categories</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-4 border border-neutral-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer">
              <span className="text-3xl mb-2 block"></span>
              <h3 className="font-medium text-neutral-900 mb-1">Travel Stories</h3>
              <p className="text-sm text-neutral-600">Personal narratives and experiences</p>
            </div>
            <div className="text-center p-4 border border-neutral-200 rounded-lg hover:border-green-300 transition-colors cursor-pointer">
              <span className="text-3xl mb-2 block"></span>
              <h3 className="font-medium text-neutral-900 mb-1">Photography</h3>
              <p className="text-sm text-neutral-600">Visual inspiration and photo essays</p>
            </div>
            <div className="text-center p-4 border border-neutral-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer">
              <span className="text-3xl mb-2 block"></span>
              <h3 className="font-medium text-neutral-900 mb-1">Culture & Art</h3>
              <p className="text-sm text-neutral-600">Cultural experiences and artistic journeys</p>
            </div>
            <div className="text-center p-4 border border-neutral-200 rounded-lg hover:border-orange-300 transition-colors cursor-pointer">
              <span className="text-3xl mb-2 block"></span>
              <h3 className="font-medium text-neutral-900 mb-1">Sustainable Travel</h3>
              <p className="text-sm text-neutral-600">Responsible tourism and eco-friendly adventures</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Trending Topics</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-neutral-100 transition-colors cursor-pointer">
                <span className="text-neutral-900">#DigitalNomadLife</span>
                <span className="text-neutral-500">2.3K posts</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-neutral-100 transition-colors cursor-pointer">
                <span className="text-neutral-900">#HiddenGems</span>
                <span className="text-neutral-500">1.8K posts</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-neutral-100 transition-colors cursor-pointer">
                <span className="text-neutral-900">#CulturalImmersion</span>
                <span className="text-neutral-500">3.1K posts</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-neutral-100 transition-colors cursor-pointer">
                <span className="text-neutral-900">#AdventureAwaits</span>
                <span className="text-neutral-500">2.7K posts</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-neutral-100 transition-colors cursor-pointer">
                <span className="text-neutral-900">#SoloTravel</span>
                <span className="text-neutral-500">1.9K posts</span>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Seasonal Inspiration</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-semantic-success pl-4">
                <h3 className="font-medium text-neutral-900 mb-1">Spring Awakening</h3>
                <p className="text-sm text-neutral-600">Cherry blossoms in Japan, tulips in Netherlands, spring festivals worldwide</p>
              </div>
              <div className="border-l-4 border-accent-primary pl-4">
                <h3 className="font-medium text-neutral-900 mb-1">Summer Adventures</h3>
                <p className="text-sm text-neutral-600">Beach getaways, hiking in the Alps, northern lights in Iceland</p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-medium text-neutral-900 mb-1">Autumn Colors</h3>
                <p className="text-sm text-neutral-600">Fall foliage in New England, harvest festivals, Oktoberfest celebrations</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-medium text-neutral-900 mb-1">Winter Wonderland</h3>
                <p className="text-sm text-neutral-600">Ski resorts in the Rockies, Christmas markets in Europe, tropical escapes</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Travel Quotes to Inspire</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <blockquote className="text-neutral-700 italic text-lg border-l-4 border-accent-primary pl-4">
              "Travel is the only thing you buy that makes you richer."
              <footer className="mt-2 text-sm text-neutral-600">— Anonymous</footer>
            </blockquote>
            <blockquote className="text-neutral-700 italic text-lg border-l-4 border-semantic-success pl-4">
              "The world is a book and those who do not travel read only one page."
              <footer className="mt-2 text-sm text-neutral-600">— Saint Augustine</footer>
            </blockquote>
            <blockquote className="text-neutral-700 italic text-lg border-l-4 border-purple-500 pl-4">
              "Adventure is worthwhile in itself."
              <footer className="mt-2 text-sm text-neutral-600">— Amelia Earhart</footer>
            </blockquote>
            <blockquote className="text-neutral-700 italic text-lg border-l-4 border-orange-500 pl-4">
              "Travel makes one modest. You see what a tiny place you occupy in the world."
              <footer className="mt-2 text-sm text-neutral-600">— Gustave Flaubert</footer>
            </blockquote>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Community Spotlight</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-neutral-300 rounded-full mx-auto mb-3"></div>
              <h3 className="font-medium text-neutral-900 mb-1">@wanderlust_sarah</h3>
              <p className="text-sm text-neutral-600 mb-2">Adventure photographer sharing stories from remote destinations</p>
              <span className="text-xs text-accent-secondary">12K followers</span>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-neutral-300 rounded-full mx-auto mb-3"></div>
              <h3 className="font-medium text-neutral-900 mb-1">@culinary_nomad</h3>
              <p className="text-sm text-neutral-600 mb-2">Food writer exploring global cuisines and street food scenes</p>
              <span className="text-xs text-accent-secondary">8K followers</span>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-neutral-300 rounded-full mx-auto mb-3"></div>
              <h3 className="font-medium text-neutral-900 mb-1">@sustainable_traveler</h3>
              <p className="text-sm text-neutral-600 mb-2">Environmental advocate promoting responsible tourism</p>
              <span className="text-xs text-accent-secondary">15K followers</span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Share Your Travel Story</h2>
          <p className="text-neutral-600 mb-6">Inspire fellow travelers by sharing your adventures and discoveries</p>
          <div className="flex justify-center gap-4">
            <Button className="bg-accent-secondary text-primary-foreground px-6 py-3 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Submit Your Story
            </Button>
            <a href="/gallery" className="bg-background text-accent-secondary border border-blue-600 px-6 py-3 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
              Share Photos
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
