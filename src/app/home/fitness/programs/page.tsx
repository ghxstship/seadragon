
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: 'Fitness Programs | ATLVS + GVTEWAY',
  description: 'Explore fitness programs and challenges designed for travelers and adventurers.',
}

export default function HomeFitnessProgramsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Fitness Programs</h1>
          <p className="text-neutral-600">Stay fit and healthy while traveling with our curated fitness programs</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="relative">
              <div className="aspect-video bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                <span className="text-4xl">‍️</span>
              </div>
              <div className="absolute top-2 left-2 bg-semantic-success text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                Beginner
              </div>
              <div className="absolute top-2 right-2 bg-semantic-warning/10 text-yellow-800 px-2 py-1 rounded text-xs">
                4.8 
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-neutral-900 mb-2">TravelFit Essentials</h3>
              <p className="text-neutral-600 text-sm mb-3">30-day program for maintaining fitness while traveling</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">4 weeks • 5 days/week</span>
                <span className="text-accent-secondary font-medium">Start Program →</span>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="relative">
              <div className="aspect-video bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center">
                <span className="text-4xl">‍️</span>
              </div>
              <div className="absolute top-2 left-2 bg-accent-secondary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                All Levels
              </div>
              <div className="absolute top-2 right-2 bg-semantic-warning/10 text-yellow-800 px-2 py-1 rounded text-xs">
                4.9 
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-neutral-900 mb-2">Mindful Movement</h3>
              <p className="text-neutral-600 text-sm mb-3">Yoga and meditation for travelers seeking balance</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Flexible • Daily</span>
                <span className="text-accent-secondary font-medium">Start Program →</span>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="relative">
              <div className="aspect-video bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
                <span className="text-4xl">️</span>
              </div>
              <div className="absolute top-2 left-2 bg-semantic-error text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                Advanced
              </div>
              <div className="absolute top-2 right-2 bg-semantic-warning/10 text-yellow-800 px-2 py-1 rounded text-xs">
                4.7 
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-neutral-900 mb-2">Adventure Athlete</h3>
              <p className="text-neutral-600 text-sm mb-3">High-intensity training for outdoor adventurers</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">6 weeks • 6 days/week</span>
                <span className="text-accent-secondary font-medium">Start Program →</span>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="relative">
              <div className="aspect-video bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
                <span className="text-4xl">‍️</span>
              </div>
              <div className="absolute top-2 left-2 bg-semantic-success text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                Beginner
              </div>
              <div className="absolute top-2 right-2 bg-semantic-warning/10 text-yellow-800 px-2 py-1 rounded text-xs">
                4.6 
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-neutral-900 mb-2">Hotel Room Workouts</h3>
              <p className="text-neutral-600 text-sm mb-3">No-equipment exercises perfect for hotel stays</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">20 min sessions</span>
                <span className="text-accent-secondary font-medium">Start Program →</span>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="relative">
              <div className="aspect-video bg-gradient-to-r from-green-400 to-teal-500 flex items-center justify-center">
                <span className="text-4xl">‍️</span>
              </div>
              <div className="absolute top-2 left-2 bg-accent-secondary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                All Levels
              </div>
              <div className="absolute top-2 right-2 bg-semantic-warning/10 text-yellow-800 px-2 py-1 rounded text-xs">
                4.8 
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-neutral-900 mb-2">Destination Walks</h3>
              <p className="text-neutral-600 text-sm mb-3">Explore cities through guided walking programs</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Location-based</span>
                <span className="text-accent-secondary font-medium">Start Program →</span>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="relative">
              <div className="aspect-video bg-gradient-to-r from-orange-400 to-yellow-500 flex items-center justify-center">
                <span className="text-4xl"></span>
              </div>
              <div className="absolute top-2 left-2 bg-accent-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                Intermediate
              </div>
              <div className="absolute top-2 right-2 bg-semantic-warning/10 text-yellow-800 px-2 py-1 rounded text-xs">
                4.9 
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-neutral-900 mb-2">Strength & Recovery</h3>
              <p className="text-neutral-600 text-sm mb-3">Build strength with recovery-focused training</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">8 weeks • 4 days/week</span>
                <span className="text-accent-secondary font-medium">Start Program →</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Program Categories</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Button className="p-4 border border-neutral-200 rounded-lg hover:border-blue-300 transition-colors text-left">
              <div className="text-lg mb-2">‍️</div>
              <h3 className="font-medium text-neutral-900 mb-1">Cardio</h3>
              <p className="text-sm text-neutral-600">Running, cycling, swimming</p>
            </Button>
            <Button className="p-4 border border-neutral-200 rounded-lg hover:border-green-300 transition-colors text-left">
              <div className="text-lg mb-2">‍️</div>
              <h3 className="font-medium text-neutral-900 mb-1">Mindfulness</h3>
              <p className="text-sm text-neutral-600">Yoga, meditation, breathing</p>
            </Button>
            <Button className="p-4 border border-neutral-200 rounded-lg hover:border-purple-300 transition-colors text-left">
              <div className="text-lg mb-2"></div>
              <h3 className="font-medium text-neutral-900 mb-1">Strength</h3>
              <p className="text-sm text-neutral-600">Weight training, bodyweight</p>
            </Button>
            <Button className="p-4 border border-neutral-200 rounded-lg hover:border-orange-300 transition-colors text-left">
              <div className="text-lg mb-2">️</div>
              <h3 className="font-medium text-neutral-900 mb-1">Adventure</h3>
              <p className="text-sm text-neutral-600">Outdoor activities, sports</p>
            </Button>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Why Join FAT Club?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-blue-900 mb-2">Travel-Ready Fitness</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Programs designed for travelers</li>
                <li>• No gym equipment required</li>
                <li>• Flexible scheduling</li>
                <li>• Location-based activities</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-blue-900 mb-2">Community Support</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Connect with fitness-minded travelers</li>
                <li>• Share progress and tips</li>
                <li>• Join group challenges</li>
                <li>• Expert guidance available</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Button className="bg-accent-secondary text-primary-foreground px-6 py-3 rounded-lg hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Join FAT Club
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
