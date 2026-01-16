'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function BookExperiencesClient() {
  const experiences = [
    {
      title: "Traditional Tea Ceremony",
      location: "Kyoto, Japan",
      duration: "2 hours",
      price: "$75",
      rating: 4.9,
      reviews: 156,
      category: "Cultural",
      description: "Learn the ancient art of Japanese tea ceremony with a master",
      image: "",
      featured: true
    },
    {
      title: "Great Barrier Reef Snorkeling",
      location: "Cairns, Australia",
      duration: "6 hours",
      price: "$165",
      rating: 4.8,
      reviews: 203,
      category: "Nature",
      description: "Explore the underwater world of the Great Barrier Reef",
      image: "",
      featured: false
    },
    {
      title: "Maasai Village Experience",
      location: "Ngorongoro, Tanzania",
      duration: "4 hours",
      price: "$95",
      rating: 4.7,
      reviews: 89,
      category: "Cultural",
      description: "Immerse yourself in Maasai culture and traditions",
      image: "️",
      featured: true
    },
    {
      title: "Hot Air Balloon Safari",
      location: "Cappadocia, Turkey",
      duration: "3 hours",
      price: "$195",
      rating: 4.9,
      reviews: 127,
      category: "Adventure",
      description: "Soar over fairy chimneys at sunrise",
      image: "",
      featured: false
    },
    {
      title: "Private Cooking Class",
      location: "Rome, Italy",
      duration: "4 hours",
      price: "$120",
      rating: 4.8,
      reviews: 94,
      category: "Culinary",
      description: "Learn to make authentic Italian pasta and pizza",
      image: "",
      featured: false
    },
    {
      title: "Yoga Retreat in Bali",
      location: "Ubud, Bali",
      duration: "2 days",
      price: "$350",
      rating: 4.9,
      reviews: 76,
      category: "Wellness",
      description: "Find inner peace with daily yoga and meditation",
      image: "",
      featured: true
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Book Experiences</h1>
          <p className="text-lg text-neutral-600">Reserve unique activities and unforgettable adventures</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-6">Find Experiences</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Destination</label>
              <Input
                type="text"
                placeholder="City or region"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-semantic-success"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Date</label>
              <Input
                type="date"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-semantic-success"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Category</label>
              <Select defaultValue="all-categories">
                <SelectTrigger className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-semantic-success">
                  <SelectValue placeholder="Select category" />
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
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Participants</label>
              <Select defaultValue="1-person">
                <SelectTrigger className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-semantic-success">
                  <SelectValue placeholder="Select participants" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-person">1 Person</SelectItem>
                  <SelectItem value="2-people">2 People</SelectItem>
                  <SelectItem value="small-group-3-5">Small Group (3-5)</SelectItem>
                  <SelectItem value="large-group-6">Large Group (6+)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-4 text-sm">
              <label className="flex items-center">
                <Input type="checkbox" className="mr-2" />
                Free cancellation
              </label>
              <label className="flex items-center">
                <Input type="checkbox" className="mr-2" />
                Instant confirmation
              </label>
              <label className="flex items-center">
                <Input type="checkbox" className="mr-2" />
                Highly rated
              </label>
            </div>
            <Button className="bg-semantic-success text-primary-foreground py-2 px-6 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-semantic-success focus:ring-offset-2">
              Search Experiences
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {experiences.map((experience, index) => (
            <div key={index} className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-4xl">
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
                <Button className="w-full bg-semantic-success text-primary-foreground py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-semantic-success focus:ring-offset-2">
                  Book Experience
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Experience Categories</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 border border-neutral-200 rounded-lg hover:border-green-300 transition-colors cursor-pointer">
              <span className="text-4xl mb-4 block"></span>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Cultural Experiences</h3>
              <p className="text-neutral-600 mb-4">Immerse yourself in local traditions and heritage</p>
            </div>
            <div className="text-center p-6 border border-neutral-200 rounded-lg hover:border-green-300 transition-colors cursor-pointer">
              <span className="text-4xl mb-4 block"></span>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Nature & Wildlife</h3>
              <p className="text-neutral-600 mb-4">Explore natural wonders and wildlife encounters</p>
            </div>
            <div className="text-center p-6 border border-neutral-200 rounded-lg hover:border-green-300 transition-colors cursor-pointer">
              <span className="text-4xl mb-4 block">️</span>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Culinary Journeys</h3>
              <p className="text-neutral-600 mb-4">Taste your way through local cuisines</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
