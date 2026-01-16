
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: 'Past Trips | ATLVS + GVTEWAY',
  description: 'Review your completed travel itineraries and trip memories.',
}

export default function HomeItinerariesPastPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Past Trips</h1>
          <p className="text-neutral-600">Relive your travel memories</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="relative">
              <div className="aspect-video bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
                <span className="text-4xl">🇫🇷</span>
              </div>
              <div className="absolute top-2 left-2 bg-neutral-800 text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                Completed
              </div>
              <div className="absolute top-2 right-2 bg-semantic-warning/10 text-yellow-800 px-2 py-1 rounded text-xs">
                5.0 
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-neutral-900 mb-2">Paris Romance</h3>
              <p className="text-neutral-600 text-sm mb-3">Paris, France • Dec 10-17, 2023</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">12 photos</span>
                <span className="text-accent-secondary font-medium">View Trip →</span>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="relative">
              <div className="aspect-video bg-gradient-to-r from-blue-400 to-teal-500 flex items-center justify-center">
                <span className="text-4xl">🇬🇷</span>
              </div>
              <div className="absolute top-2 left-2 bg-neutral-800 text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                Completed
              </div>
              <div className="absolute top-2 right-2 bg-semantic-warning/10 text-yellow-800 px-2 py-1 rounded text-xs">
                4.8 
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-neutral-900 mb-2">Greek Islands Hop</h3>
              <p className="text-neutral-600 text-sm mb-3">Santorini & Mykonos • Oct 5-12, 2023</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">28 photos</span>
                <span className="text-accent-secondary font-medium">View Trip →</span>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="relative">
              <div className="aspect-video bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
                <span className="text-4xl">🇳🇿</span>
              </div>
              <div className="absolute top-2 left-2 bg-neutral-800 text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                Completed
              </div>
              <div className="absolute top-2 right-2 bg-semantic-warning/10 text-yellow-800 px-2 py-1 rounded text-xs">
                5.0 
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-neutral-900 mb-2">New Zealand Adventure</h3>
              <p className="text-neutral-600 text-sm mb-3">Queenstown & Franz Josef • Aug 15-25, 2023</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">45 photos</span>
                <span className="text-accent-secondary font-medium">View Trip →</span>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="relative">
              <div className="aspect-video bg-gradient-to-r from-orange-400 to-amber-500 flex items-center justify-center">
                <span className="text-4xl">🇲🇽</span>
              </div>
              <div className="absolute top-2 left-2 bg-neutral-800 text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                Completed
              </div>
              <div className="absolute top-2 right-2 bg-semantic-warning/10 text-yellow-800 px-2 py-1 rounded text-xs">
                4.9 
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-neutral-900 mb-2">Mexico City Cultural Tour</h3>
              <p className="text-neutral-600 text-sm mb-3">Mexico City • Jun 20-27, 2023</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">32 photos</span>
                <span className="text-accent-secondary font-medium">View Trip →</span>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="relative">
              <div className="aspect-video bg-gradient-to-r from-red-400 to-pink-500 flex items-center justify-center">
                <span className="text-4xl">🇮🇸</span>
              </div>
              <div className="absolute top-2 left-2 bg-neutral-800 text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                Completed
              </div>
              <div className="absolute top-2 right-2 bg-semantic-warning/10 text-yellow-800 px-2 py-1 rounded text-xs">
                4.7 
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-neutral-900 mb-2">Iceland Northern Lights</h3>
              <p className="text-neutral-600 text-sm mb-3">Reykjavik & Golden Circle • Apr 10-17, 2023</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">38 photos</span>
                <span className="text-accent-secondary font-medium">View Trip →</span>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="relative">
              <div className="aspect-video bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center">
                <span className="text-4xl">🇨🇦</span>
              </div>
              <div className="absolute top-2 left-2 bg-neutral-800 text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                Completed
              </div>
              <div className="absolute top-2 right-2 bg-semantic-warning/10 text-yellow-800 px-2 py-1 rounded text-xs">
                4.6 
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-neutral-900 mb-2">Vancouver Island Explorer</h3>
              <p className="text-neutral-600 text-sm mb-3">Victoria & Tofino • Feb 14-21, 2023</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">26 photos</span>
                <span className="text-accent-secondary font-medium">View Trip →</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Trip Memories</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Travel Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Countries visited</span>
                  <span className="text-sm font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Total trips</span>
                  <span className="text-sm font-medium">18</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Photos taken</span>
                  <span className="text-sm font-medium">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Average rating</span>
                  <span className="text-sm font-medium">4.8 </span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Favorite Destinations</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">🇯🇵 Japan</span>
                  <span className="text-sm font-medium">3 trips</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">🇫🇷 France</span>
                  <span className="text-sm font-medium">2 trips</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">🇮🇹 Italy</span>
                  <span className="text-sm font-medium">2 trips</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">🇬🇷 Greece</span>
                  <span className="text-sm font-medium">2 trips</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Create New Memories</h2>
          <p className="text-blue-800 mb-4">
            Ready for your next adventure? Start planning a new trip to add to your collection of travel stories.
          </p>
          <Button className="bg-accent-secondary text-primary-foreground px-6 py-3 rounded-lg hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
            Plan New Trip
          </Button>
        </div>
      </div>
    </div>
  )
}
