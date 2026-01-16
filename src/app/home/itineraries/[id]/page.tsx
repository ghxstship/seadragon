
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"

interface ItineraryPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ItineraryPageProps): Promise<Metadata> {
  return {
    title: `Trip Itinerary | ATLVS + GVTEWAY`,
    description: 'View and manage your detailed trip itinerary with all bookings and activities.',
  }
}

export default async function HomeItinerariesIdPage({ params }: ItineraryPageProps) {
  const { id } = await params
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button className="text-accent-secondary hover:text-blue-800 mb-4">
            ← Back to Itineraries
          </Button>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Tokyo Adventure Trip</h1>
          <p className="text-neutral-600">March 15-25, 2024 • Solo Traveler</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-neutral-900">Trip Overview</h2>
            <div className="flex space-x-2">
              <Button className="bg-accent-secondary text-primary-foreground px-4 py-2 rounded text-sm hover:bg-accent-tertiary">
                Edit Trip
              </Button>
              <Button className="bg-semantic-success text-primary-foreground px-4 py-2 rounded text-sm hover:bg-green-700">
                Share Trip
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Trip Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Duration</span>
                  <span className="font-medium">10 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Destinations</span>
                  <span className="font-medium">Tokyo, Kyoto</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Travel Style</span>
                  <span className="font-medium">Cultural & Adventure</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Budget</span>
                  <span className="font-medium">$3,500</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Booking Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Flights</span>
                  <span className="text-semantic-success font-medium"> Booked</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Hotels</span>
                  <span className="text-semantic-success font-medium"> Booked</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Activities</span>
                  <span className="text-semantic-warning font-medium">3 Pending</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Transportation</span>
                  <span className="text-neutral-500 font-medium">Not booked</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-neutral-900 mb-2">Trip Notes</h3>
            <p className="text-sm text-neutral-600">
              Focus on experiencing authentic Japanese culture while exploring both urban and traditional aspects of Japan.
              Prioritize food experiences and cultural activities over typical tourist attractions.
            </p>
          </div>
        </div>

        <div className="space-y-6 mb-8">
          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-accent-secondary rounded-full flex items-center justify-center text-primary-foreground mr-3">
                <span className="text-sm font-bold">1</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">March 15: Arrival in Tokyo</h3>
                <p className="text-neutral-600">Flight arrival and hotel check-in</p>
              </div>
            </div>

            <div className="ml-11 space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-accent-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">️</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-neutral-900">Flight from JFK to NRT</h4>
                  <p className="text-sm text-neutral-600 mb-2">Japan Airlines • Flight JL 789</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span>10:30 AM departure</span>
                    <span>2:45 PM arrival (+1 day)</span>
                    <span className="text-semantic-success"> Confirmed</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-semantic-success/10 rounded-lg flex items-center justify-center">
                  <span className="text-2xl"></span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-neutral-900">Park Hyatt Tokyo</h4>
                  <p className="text-sm text-neutral-600 mb-2">Luxury hotel in Shinjuku</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span>Check-in 3:00 PM</span>
                    <span>Deluxe King Room</span>
                    <span className="text-semantic-success"> Confirmed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-semantic-success rounded-full flex items-center justify-center text-primary-foreground mr-3">
                <span className="text-sm font-bold">2</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">March 16-17: Tokyo Exploration</h3>
                <p className="text-neutral-600">City exploration and cultural experiences</p>
              </div>
            </div>

            <div className="ml-11 space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-accent-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-2xl"></span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-neutral-900">Tsukiji Outer Market Food Tour</h4>
                  <p className="text-sm text-neutral-600 mb-2">Fresh seafood and street food experience</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span>March 16 • 11:00 AM</span>
                    <span>2 hours</span>
                    <span className="text-semantic-warning">○ Pending</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-semantic-warning/10 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">️</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-neutral-900">Meiji Shrine Visit</h4>
                  <p className="text-sm text-neutral-600 mb-2">Peaceful shrine in Yoyogi Park</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span>March 17 • 9:00 AM</span>
                    <span>Self-guided</span>
                    <span className="text-neutral-500">○ Not booked</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-accent-primary rounded-full flex items-center justify-center text-primary-foreground mr-3">
                <span className="text-sm font-bold">3</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">March 18: Travel to Kyoto</h3>
                <p className="text-neutral-600">Bullet train to Kyoto and tea ceremony</p>
              </div>
            </div>

            <div className="ml-11 space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-semantic-error/10 rounded-lg flex items-center justify-center">
                  <span className="text-2xl"></span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-neutral-900">Shinkansen to Kyoto</h4>
                  <p className="text-sm text-neutral-600 mb-2">High-speed bullet train</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span>March 18 • 8:00 AM</span>
                    <span>2.5 hours</span>
                    <span className="text-neutral-500">○ Not booked</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-accent-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-2xl"></span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-neutral-900">Traditional Tea Ceremony</h4>
                  <p className="text-sm text-neutral-600 mb-2">Authentic matcha experience at En</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span>March 18 • 2:00 PM</span>
                    <span>2 hours</span>
                    <span className="text-semantic-success"> Confirmed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-semantic-warning rounded-full flex items-center justify-center text-primary-foreground mr-3">
                <span className="text-sm font-bold">4</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">March 19-24: Kyoto Stay</h3>
                <p className="text-neutral-600">Temples, gardens, and cultural experiences</p>
              </div>
            </div>

            <div className="ml-11 space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-semantic-success/10 rounded-lg flex items-center justify-center">
                  <span className="text-2xl"></span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-neutral-900">Hotel Granvia Kyoto</h4>
                  <p className="text-sm text-neutral-600 mb-2">Connected to Kyoto Station</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span>March 18-24</span>
                    <span>Standard Room</span>
                    <span className="text-semantic-success"> Confirmed</span>
                  </div>
                </div>
              </div>

              <div className="text-sm text-neutral-600 ml-16">
                Additional activities to be scheduled: Zen meditation, Fushimi Inari hike, Nishiki Market food tour
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-semantic-error rounded-full flex items-center justify-center text-primary-foreground mr-3">
                <span className="text-sm font-bold">5</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">March 25: Return to Tokyo</h3>
                <p className="text-neutral-600">Final day and departure</p>
              </div>
            </div>

            <div className="ml-11 space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-semantic-error/10 rounded-lg flex items-center justify-center">
                  <span className="text-2xl"></span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-neutral-900">Shinkansen to Tokyo</h4>
                  <p className="text-sm text-neutral-600 mb-2">Return to Tokyo for departure</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span>March 25 • 9:00 AM</span>
                    <span>2.5 hours</span>
                    <span className="text-neutral-500">○ Not booked</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-accent-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">️</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-neutral-900">Flight NRT to JFK</h4>
                  <p className="text-sm text-neutral-600 mb-2">Japan Airlines • Flight JL 788</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span>6:30 PM departure</span>
                    <span>4:15 PM arrival (same day)</span>
                    <span className="text-semantic-success"> Confirmed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Trip Budget Summary</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Expenses by Category</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Flights</span>
                  <span className="text-sm font-medium">$900</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Hotels</span>
                  <span className="text-sm font-medium">$1,800</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Activities</span>
                  <span className="text-sm font-medium">$450</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Food & Transport</span>
                  <span className="text-sm font-medium">$350</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Budget vs Actual</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Total Budget</span>
                  <span className="text-sm font-medium">$3,500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Spent So Far</span>
                  <span className="text-sm font-medium text-semantic-success">$2,850</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Remaining</span>
                  <span className="text-sm font-medium text-accent-secondary">$650</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-sm font-medium text-neutral-900">Projected Total</span>
                  <span className="text-sm font-medium text-semantic-warning">$3,200</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
