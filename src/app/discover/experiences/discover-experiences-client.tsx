'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function DiscoverExperiencesClient() {
  const experiences = [
    {
      title: "Traditional Balinese Cooking Class",
      category: "Culinary",
      location: "Ubud, Bali",
      duration: "4 hours",
      price: "$85",
      rating: 4.9,
      reviews: 127,
      description: "Learn to cook authentic Balinese dishes with fresh, local ingredients",
      highlights: ["Traditional recipes", "Market visit", "Local chef", "Take-home recipes"],
      image: "",
      featured: true
    },
    {
      title: "Sunrise Hot Air Balloon Ride",
      category: "Adventure",
      location: "Cappadocia, Turkey",
      duration: "2 hours",
      price: "$195",
      rating: 4.8,
      reviews: 89,
      description: "Soar over fairy chimneys and rock formations at sunrise",
      highlights: ["Professional pilot", "Champagne breakfast", "Stunning views", "Photo session"],
      image: "",
      featured: false
    },
    {
      title: "Maasai Village Cultural Immersion",
      category: "Cultural",
      location: "Ngorongoro, Tanzania",
      duration: "6 hours",
      price: "$120",
      rating: 4.7,
      reviews: 156,
      description: "Experience traditional Maasai life and customs firsthand",
      highlights: ["Village tour", "Traditional dance", "Storytelling session", "Craft demonstration"],
      image: "️",
      featured: true
    },
    {
      title: "Kyoto Tea Ceremony Experience",
      category: "Cultural",
      location: "Kyoto, Japan",
      duration: "2 hours",
      price: "$75",
      rating: 4.9,
      reviews: 203,
      description: "Participate in a traditional Japanese tea ceremony with a master",
      highlights: ["Tea master instruction", "Traditional sweets", "Ceremony explanation", "Photography allowed"],
      image: "",
      featured: false
    },
    {
      title: "Great Barrier Reef Snorkeling",
      category: "Nature",
      location: "Cairns, Australia",
      duration: "6 hours",
      price: "$165",
      rating: 4.6,
      reviews: 312,
      description: "Explore the underwater world of the Great Barrier Reef",
      highlights: ["Guided snorkeling", "Marine life viewing", "Lunch included", "Equipment provided"],
      image: "",
      featured: false
    },
    {
      title: "Santorini Sunset Photography Tour",
      category: "Arts & Crafts",
      location: "Santorini, Greece",
      duration: "3 hours",
      price: "$95",
      rating: 4.8,
      reviews: 78,
      description: "Capture stunning sunset photos with a professional photographer",
      highlights: ["Professional guide", "Photo editing tips", "Multiple locations", "Digital files included"],
      image: "",
      featured: true
    },
    {
      title: "Iceland Northern Lights Tour",
      category: "Nature",
      location: "Reykjavik, Iceland",
      duration: "4 hours",
      price: "$110",
      rating: 4.5,
      reviews: 245,
      description: "Chase the aurora borealis with expert guides",
      highlights: ["Northern lights expert", "Warm clothing provided", "Hot chocolate included", "Photography tips"],
      image: "",
      featured: false
    },
    {
      title: "Peruvian Amazon Jungle Trek",
      category: "Adventure",
      location: "Amazon Rainforest, Peru",
      duration: "3 days",
      price: "$450",
      rating: 4.9,
      reviews: 67,
      description: "Immerse yourself in the Amazon with indigenous guides",
      highlights: ["Indigenous guides", "Traditional lodge", "Wildlife spotting", "Sustainable tourism"],
      image: "",
      featured: true
    },
    {
      title: "Marrakech Hammam Experience",
      category: "Wellness",
      location: "Marrakech, Morocco",
      duration: "2 hours",
      price: "$60",
      rating: 4.7,
      reviews: 134,
      description: "Traditional Moroccan spa experience with local rituals",
      highlights: ["Traditional hammam", "Local therapist", "Essential oils", "Relaxation area"],
      image: "",
      featured: false
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Unique Experiences</h1>
          <p className="text-lg text-neutral-600">Discover authentic activities and unforgettable adventures</p>
        </div>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <Input type="text" placeholder="Search experiences..." className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary" />
            <Select defaultValue="all-categories">
              <SelectTrigger className="px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-categories">All Categories</SelectItem>
                <SelectItem value="cultural">Cultural</SelectItem>
                <SelectItem value="adventure">Adventure</SelectItem>
                <SelectItem value="culinary">Culinary</SelectItem>
                <SelectItem value="wellness">Wellness</SelectItem>
                <SelectItem value="nature">Nature</SelectItem>
                <SelectItem value="arts-crafts">Arts & Crafts</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-durations">
              <SelectTrigger className="px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary">
                <SelectValue placeholder="Duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-durations">All Durations</SelectItem>
                <SelectItem value="half-day">Half Day</SelectItem>
                <SelectItem value="full-day">Full Day</SelectItem>
                <SelectItem value="multi-day">Multi-Day</SelectItem>
                <SelectItem value="overnight">Overnight</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-price-ranges">
              <SelectTrigger className="px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary">
                <SelectValue placeholder="Price range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-price-ranges">All Price Ranges</SelectItem>
                <SelectItem value="0-50">$0-50</SelectItem>
                <SelectItem value="51-150">$51-150</SelectItem>
                <SelectItem value="151-300">$151-300</SelectItem>
                <SelectItem value="300">$300+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {experiences.map((experience, index) => (
            <div key={index} className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-4xl">
                  {experience.image}
                </div>
                {experience.featured && (
                  <div className="absolute top-2 left-2 bg-semantic-warning text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                    Featured
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-background bg-opacity-90 text-neutral-800 px-2 py-1 rounded text-xs">
                  {experience.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">{experience.title}</h3>
                <p className="text-neutral-600 mb-3">{experience.description}</p>
                <div className="flex items-center justify-between text-sm text-neutral-500 mb-3">
                  <span> {experience.location}</span>
                  <span>⏱️ {experience.duration}</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-400">⭐</span>
                    <span className="text-sm font-medium">{experience.rating}</span>
                    <span className="text-sm text-neutral-500">({experience.reviews})</span>
                  </div>
                  <span className="font-bold text-semantic-success">{experience.price}</span>
                </div>
                <Button className="w-full bg-accent-secondary text-primary-foreground py-2 px-4 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
                  Book Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
