
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: 'Sample Itineraries | ATLVS + GVTEWAY',
  description: 'Explore pre-built travel itineraries and get inspired for your perfect trip.',
}

export default function ItinerariesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-neutral-900 mb-4">Sample Itineraries</h1>
        <p className="text-lg text-neutral-600 mb-8">Curated travel plans to inspire your journey</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Sample itinerary cards */}
          {[
            {
              title: "Tokyo Adventure",
              duration: "7 Days",
              theme: "Urban Exploration",
              highlights: ["Shibuya Crossing", "Sushi Making Class", "Mount Fuji Day Trip"],
              price: "$2,499"
            },
            {
              title: "Bali Paradise",
              duration: "10 Days",
              theme: "Beach & Culture",
              highlights: ["Ubud Rice Terraces", "Beach Yoga", "Traditional Dance Show"],
              price: "$1,899"
            },
            {
              title: "European Highlights",
              duration: "14 Days",
              theme: "Cultural Tour",
              highlights: ["Paris Museums", "Rome Colosseum", "Swiss Alps"],
              price: "$3,299"
            },
            {
              title: "Costa Rica Adventure",
              duration: "8 Days",
              theme: "Nature & Wildlife",
              highlights: ["Rainforest Hiking", "Volcano Tour", "Beach Relaxation"],
              price: "$2,199"
            },
            {
              title: "Morocco Discovery",
              duration: "9 Days",
              theme: "Desert & Medina",
              highlights: ["Sahara Desert Camp", "Chefchaouen Blue City", "Cooking Class"],
              price: "$1,999"
            },
            {
              title: "New Zealand Epic",
              duration: "12 Days",
              theme: "Adventure Sports",
              highlights: ["Bungee Jumping", "Glacier Hiking", "Wine Tour"],
              price: "$3,799"
            }
          ].map((itinerary, index) => (
            <div key={index} className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500"></div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-neutral-900">{itinerary.title}</h3>
                  <span className="text-sm font-medium text-accent-secondary bg-blue-50 px-2 py-1 rounded">
                    {itinerary.duration}
                  </span>
                </div>
                <p className="text-sm text-neutral-600 mb-3">{itinerary.theme}</p>
                <ul className="text-sm text-neutral-600 mb-4 space-y-1">
                  {itinerary.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-accent-secondary rounded-full mr-2"></span>
                      {highlight}
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-neutral-900">{itinerary.price}</span>
                  <Button className="bg-accent-secondary text-primary-foreground px-4 py-2 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 text-sm">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Customize Your Itinerary</h3>
          <p className="text-neutral-600 mb-4">
            Can&apos;t find exactly what you&apos;re looking for? Let our travel experts create a custom itinerary tailored to your preferences.
          </p>
          <Button className="bg-semantic-success text-primary-foreground px-6 py-3 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-semantic-success focus:ring-offset-2 font-medium">
            Get Custom Itinerary
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Filter by Destination</h3>
            <div className="grid grid-cols-2 gap-3">
              {['Asia', 'Europe', 'Americas', 'Africa', 'Oceania', 'Middle East'].map((region) => (
                <Button key={region} className="text-left p-3 border border-neutral-200 rounded-md hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  {region}
                </Button>
              ))}
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Filter by Activity</h3>
            <div className="grid grid-cols-2 gap-3">
              {['Adventure', 'Culture', 'Beach', 'City', 'Nature', 'Food', 'Wellness', 'Nightlife'].map((activity) => (
                <Button key={activity} className="text-left p-3 border border-neutral-200 rounded-md hover:border-green-300 hover:bg-green-50 transition-colors">
                  {activity}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
