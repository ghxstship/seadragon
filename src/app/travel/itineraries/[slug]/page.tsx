
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"

interface ItineraryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ItineraryPageProps): Promise<Metadata> {
  const { slug } = await params
  return {
    title: `${slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Itinerary | ATLVS + GVTEWAY`,
    description: `Detailed itinerary for ${slug.replace(/-/g, ' ')} including day-by-day plans and highlights.`,
  }
}

export default async function ItineraryDetailPage({ params }: ItineraryPageProps) {
  const { slug } = await params
  const itineraryName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">{itineraryName}</h1>
          <div className="flex items-center space-x-4 text-neutral-600 mb-4">
            <span>️ Beach Paradise</span>
            <span>•</span>
            <span>7 Days</span>
            <span>•</span>
            <span>$2,499 per person</span>
          </div>
          <p className="text-lg text-neutral-700">
            Experience the best of tropical island living with this carefully curated 7-day itinerary.
            From pristine beaches to cultural experiences, this trip offers the perfect balance of relaxation and adventure.
          </p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Trip Overview</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-neutral-900 mb-2">What&apos;s Included</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Round-trip flights from major hubs</li>
                <li>• 6 nights luxury beachfront accommodation</li>
                <li>• Daily breakfast and selected meals</li>
                <li>• Airport transfers and local transportation</li>
                <li>• Guided tours and experiences</li>
                <li>• 24/7 support from our local team</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-2">Highlights</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Private beach sunset dinner</li>
                <li>• Snorkeling in coral reefs</li>
                <li>• Traditional cooking class</li>
                <li>• Spa day with local treatments</li>
                <li>• Cultural village visit</li>
                <li>• Optional adventure activities</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900">Day-by-Day Itinerary</h2>

          {[
            {
              day: 1,
              title: "Arrival & Beach Relaxation",
              description: "Welcome to paradise! After your flight, you'll be transferred to your beachfront resort. Spend the afternoon relaxing by the pool or exploring the property.",
              activities: ["Airport transfer", "Welcome dinner", "Beach walk"]
            },
            {
              day: 2,
              title: "Island Exploration",
              description: "Discover the local culture and natural beauty with a guided tour of the island's highlights.",
              activities: ["Cultural village visit", "Traditional lunch", "Photo stops at scenic viewpoints"]
            },
            {
              day: 3,
              title: "Adventure Day",
              description: "Get your adrenaline pumping with water sports and outdoor activities.",
              activities: ["Snorkeling trip", "Kayaking", "Beach volleyball"]
            },
            {
              day: 4,
              title: "Wellness & Spa",
              description: "Take a day to rejuvenate with spa treatments and wellness activities.",
              activities: ["Full spa day", "Yoga session", "Healthy cuisine workshop"]
            },
            {
              day: 5,
              title: "Free Day",
              description: "Enjoy a flexible day to pursue your own interests or relax completely.",
              activities: ["Optional activities available", "Beach time", "Shopping in local markets"]
            },
            {
              day: 6,
              title: "Culinary Experience",
              description: "Dive into the local cuisine with hands-on cooking classes and food tours.",
              activities: ["Cooking class", "Food market tour", "Sunset dinner cruise"]
            },
            {
              day: 7,
              title: "Departure",
              description: "Final morning to relax before your transfer to the airport for your flight home.",
              activities: ["Morning relaxation", "Airport transfer", "Safe travels home"]
            }
          ].map((day) => (
            <div key={day.day} className="bg-background rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-accent-secondary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg mr-4">
                  {day.day}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900">Day {day.day}: {day.title}</h3>
                </div>
              </div>
              <p className="text-neutral-700 mb-4">{day.description}</p>
              <div>
                <h4 className="font-medium text-neutral-900 mb-2">Activities:</h4>
                <ul className="text-sm text-neutral-600 space-y-1">
                  {day.activities.map((activity, i) => (
                    <li key={i} className="flex items-center">
                      <span className="w-2 h-2 bg-accent-secondary rounded-full mr-3"></span>
                      {activity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-green-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-green-900 mb-4">Ready to Book?</h2>
          <p className="text-green-800 mb-4">
            This itinerary can be customized to fit your dates, group size, and preferences.
            Contact our travel experts to make this trip your own.
          </p>
          <div className="flex gap-4">
            <Button className="bg-semantic-success text-primary-foreground px-6 py-3 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-semantic-success focus:ring-offset-2 font-medium">
              Book This Itinerary
            </Button>
            <Button className="bg-background text-semantic-success border border-green-600 px-6 py-3 rounded-md hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 font-medium">
              Customize Itinerary
            </Button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Travel Tips</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <ul className="text-sm text-neutral-600 space-y-1">
              <li>• Pack light clothing and swimwear</li>
              <li>• Don&apos;t forget reef-safe sunscreen</li>
              <li>• Comfortable walking shoes recommended</li>
              <li>• Cash for small purchases (USD widely accepted)</li>
            </ul>
            <ul className="text-sm text-neutral-600 space-y-1">
              <li>• Respect local customs and traditions</li>
              <li>• Stay hydrated and use sun protection</li>
              <li>• Try local foods and support local businesses</li>
              <li>• Download offline maps for navigation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
