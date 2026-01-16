
'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function DestinationsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Explore Destinations</h1>
          <p className="text-lg text-neutral-600">Discover incredible places that will inspire your next adventure</p>
        </div>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              type="text"
              placeholder="Search destinations..."
              className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
            />
            <Select>
              <SelectTrigger className="px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary">
                <SelectValue placeholder="All Regions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="asia">Asia</SelectItem>
                <SelectItem value="europe">Europe</SelectItem>
                <SelectItem value="africa">Africa</SelectItem>
                <SelectItem value="north-america">North America</SelectItem>
                <SelectItem value="south-america">South America</SelectItem>
                <SelectItem value="oceania">Oceania</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary">
                <SelectValue placeholder="All Activities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activities</SelectItem>
                <SelectItem value="beach">Beach & Relaxation</SelectItem>
                <SelectItem value="adventure">Adventure & Hiking</SelectItem>
                <SelectItem value="culture">Culture & History</SelectItem>
                <SelectItem value="food">Food & Wine</SelectItem>
                <SelectItem value="city">City Exploration</SelectItem>
                <SelectItem value="nature">Nature & Wildlife</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[
            {
              name: "Bali, Indonesia",
              region: "Asia",
              description: "Tropical paradise with stunning beaches, ancient temples, and vibrant culture",
              highlights: ["Rice terraces", "Surfing beaches", "Traditional ceremonies", "Yoga retreats"],
              bestTime: "April-October (dry season)",
              image: "️",
              popular: true
            },
            {
              name: "Santorini, Greece",
              region: "Europe",
              description: "Iconic white-washed buildings and breathtaking sunsets over the Aegean Sea",
              highlights: ["Cliffside villages", "Volcanic beaches", "Wine tasting", "Sunset views"],
              bestTime: "April-June, September-October",
              image: "️",
              popular: true
            },
            {
              name: "Machu Picchu, Peru",
              region: "South America",
              description: "Ancient Incan citadel nestled in the Andes mountains",
              highlights: ["Hiking trails", "Archaeological site", "Mountain views", "Cultural history"],
              bestTime: "May-September (dry season)",
              image: "️",
              popular: false
            },
            {
              name: "Kyoto, Japan",
              region: "Asia",
              description: "Ancient capital city blending traditional temples with modern culture",
              highlights: ["Cherry blossoms", "Zen gardens", "Traditional tea houses", "Geisha districts"],
              bestTime: "March-May (cherry blossoms), September-November (fall foliage)",
              image: "",
              popular: true
            },
            {
              name: "Iceland",
              region: "Europe",
              description: "Land of fire and ice with dramatic landscapes and natural wonders",
              highlights: ["Northern lights", "Geysers", "Glaciers", "Waterfalls", "Black sand beaches"],
              bestTime: "June-August (midnight sun), September-April (northern lights)",
              image: "",
              popular: false
            },
            {
              name: "Marrakech, Morocco",
              region: "Africa",
              description: "Vibrant city with bustling souks, stunning palaces, and desert adventures",
              highlights: ["Medina markets", "Historic palaces", "Desert excursions", "Hammam spas"],
              bestTime: "March-May, October-November",
              image: "",
              popular: false
            },
            {
              name: "New York City, USA",
              region: "North America",
              description: "The city that never sleeps, offering world-class culture and entertainment",
              highlights: ["Broadway shows", "Museum mile", "Central Park", "Food scene", "Skyline views"],
              bestTime: "April-June, September-November",
              image: "️",
              popular: true
            },
            {
              name: "Queenstown, New Zealand",
              region: "Oceania",
              description: "Adventure capital of the world surrounded by stunning natural beauty",
              highlights: ["Bungee jumping", "Skydiving", "Lake cruises", "Mountain biking", "Wine regions"],
              bestTime: "December-March (summer)",
              image: "️",
              popular: false
            },
            {
              name: "Barcelona, Spain",
              region: "Europe",
              description: "Mediterranean city known for Gaudí's architecture and vibrant culture",
              highlights: ["Sagrada Familia", "Park Güell", "La Rambla", "Beaches", "Tapas scene"],
              bestTime: "May-June, September-October",
              image: "️",
              popular: true
            }
          ].map((destination, index) => (
            <div key={index} className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-4xl">
                  {destination.image}
                </div>
                {destination.popular && (
                  <div className="absolute top-2 left-2 bg-semantic-warning text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                    Popular
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-background bg-opacity-90 text-neutral-800 px-2 py-1 rounded text-xs">
                  {destination.region}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">{destination.name}</h3>
                <p className="text-neutral-600 mb-3">{destination.description}</p>
                <div className="mb-3">
                  <h4 className="font-medium text-neutral-900 mb-1">Highlights:</h4>
                  <div className="flex flex-wrap gap-1">
                    {destination.highlights.slice(0, 3).map((highlight, i) => (
                      <span key={i} className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded text-xs">
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-sm text-neutral-500 mb-4">
                  <strong>Best Time:</strong> {destination.bestTime}
                </div>
                <Button className="w-full bg-accent-secondary text-primary-foreground py-2 px-4 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
                  Explore Destination
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Destination Categories</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-4 border border-neutral-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer">
              <span className="text-3xl mb-2 block">️</span>
              <h3 className="font-medium text-neutral-900 mb-1">Beach Destinations</h3>
              <p className="text-sm text-neutral-600">Tropical paradises and coastal retreats</p>
            </div>
            <div className="text-center p-4 border border-neutral-200 rounded-lg hover:border-green-300 transition-colors cursor-pointer">
              <span className="text-3xl mb-2 block">️</span>
              <h3 className="font-medium text-neutral-900 mb-1">Mountain Adventures</h3>
              <p className="text-sm text-neutral-600">Hiking, skiing, and alpine experiences</p>
            </div>
            <div className="text-center p-4 border border-neutral-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer">
              <span className="text-3xl mb-2 block">️</span>
              <h3 className="font-medium text-neutral-900 mb-1">Cultural Capitals</h3>
              <p className="text-sm text-neutral-600">Historic cities and cultural hubs</p>
            </div>
            <div className="text-center p-4 border border-neutral-200 rounded-lg hover:border-orange-300 transition-colors cursor-pointer">
              <span className="text-3xl mb-2 block"></span>
              <h3 className="font-medium text-neutral-900 mb-1">Nature & Wildlife</h3>
              <p className="text-sm text-neutral-600">National parks and wildlife encounters</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Travel Tips by Destination Type</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-neutral-900 mb-3"> International Travel</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Check visa requirements early</li>
                <li>• Research local customs and etiquette</li>
                <li>• Learn basic phrases in local language</li>
                <li>• Get travel insurance with medical coverage</li>
                <li>• Keep copies of important documents</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-3"> Adventure Travel</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Assess your fitness level realistically</li>
                <li>• Start with guided tours if new to activities</li>
                <li>• Check weather conditions and seasonal considerations</li>
                <li>• Bring appropriate gear and clothing</li>
                <li>• Know emergency procedures and contact information</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Ready to Plan Your Trip?</h2>
          <p className="text-neutral-600 mb-6">Get personalized recommendations based on your interests and preferences</p>
          <div className="flex justify-center gap-4">
            <a href="/travel/planning" className="bg-accent-secondary text-primary-foreground px-6 py-3 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Start Planning
            </a>
            <a href="/memberships" className="bg-background text-accent-secondary border border-blue-600 px-6 py-3 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
              Join Membership
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
