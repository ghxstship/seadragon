'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function GuidesClient() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Travel Guides</h1>
          <p className="text-lg text-neutral-600">Expert insights and local knowledge from our travel specialists</p>
        </div>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              type="text"
              placeholder="Search guides..."
              className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
            />
            <Select defaultValue="all-regions">
              <SelectTrigger className="px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-regions">All Regions</SelectItem>
                <SelectItem value="asia">Asia</SelectItem>
                <SelectItem value="europe">Europe</SelectItem>
                <SelectItem value="africa">Africa</SelectItem>
                <SelectItem value="americas">Americas</SelectItem>
                <SelectItem value="oceania">Oceania</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-topics">
              <SelectTrigger className="px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-topics">All Topics</SelectItem>
                <SelectItem value="getting-around">Getting Around</SelectItem>
                <SelectItem value="where-to-eat">Where to Eat</SelectItem>
                <SelectItem value="what-to-see">What to See</SelectItem>
                <SelectItem value="where-to-stay">Where to Stay</SelectItem>
                <SelectItem value="local-culture">Local Culture</SelectItem>
                <SelectItem value="practical-tips">Practical Tips</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[
            {
              title: "Bali: Beyond the Tourist Trail",
              destination: "Bali, Indonesia",
              author: "Sarah Chen",
              readTime: "8 min read",
              category: "Culture & Hidden Gems",
              description: "Discover authentic Balinese culture and hidden beaches away from the crowds",
              image: "️",
              featured: true
            },
            {
              title: "Tokyo Neighborhood Guide",
              destination: "Tokyo, Japan",
              author: "Hiroshi Tanaka",
              readTime: "12 min read",
              category: "Urban Exploration",
              description: "Navigate Tokyo's diverse neighborhoods like a local",
              image: "️",
              featured: false
            },
            {
              title: "Santorini Photography Guide",
              destination: "Santorini, Greece",
              author: "Marcus Rodriguez",
              readTime: "6 min read",
              category: "Photography",
              description: "Best spots and techniques for capturing the perfect Santorini sunset",
              image: "",
              featured: true
            },
            {
              title: "Machu Picchu Hiking Routes",
              destination: "Cusco, Peru",
              author: "Ana Silva",
              readTime: "10 min read",
              category: "Adventure",
              description: "Complete guide to hiking the Inca Trail and alternative routes",
              image: "️",
              featured: false
            },
            {
              title: "Barcelona Tapas Tour",
              destination: "Barcelona, Spain",
              author: "Carlos Mendoza",
              readTime: "7 min read",
              category: "Food & Drink",
              description: "Navigate Barcelona's best tapas bars and local specialties",
              image: "️",
              featured: false
            },
            {
              title: "Morocco Desert Survival Guide",
              destination: "Marrakech, Morocco",
              author: "Fatima Al-Zahra",
              readTime: "9 min read",
              category: "Adventure",
              description: "Everything you need to know for a safe and memorable desert experience",
              image: "️",
              featured: true
            },
            {
              title: "Iceland Road Trip Planning",
              destination: "Reykjavik, Iceland",
              author: "Bjorn Larsen",
              readTime: "11 min read",
              category: "Road Trips",
              description: "Plan the perfect Ring Road adventure with our comprehensive guide",
              image: "",
              featured: false
            },
            {
              title: "New York City Budget Travel",
              destination: "New York City, USA",
              author: "Jennifer Walsh",
              readTime: "5 min read",
              category: "Budget Travel",
              description: "Experience NYC without breaking the bank",
              image: "",
              featured: false
            },
            {
              title: "Queenstown Adventure Activities",
              destination: "Queenstown, New Zealand",
              author: "Rachel Green",
              readTime: "8 min read",
              category: "Extreme Sports",
              description: "Complete guide to bungee jumping, skydiving, and more",
              image: "",
              featured: true
            }
          ].map((guide, index) => (
            <div key={index} className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-4xl">
                  {guide.image}
                </div>
                {guide.featured && (
                  <div className="absolute top-2 left-2 bg-semantic-warning text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                    Featured
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-background bg-opacity-90 text-neutral-800 px-2 py-1 rounded text-xs">
                  {guide.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">{guide.title}</h3>
                <p className="text-neutral-600 mb-3">{guide.description}</p>
                <div className="flex items-center justify-between text-sm text-neutral-500 mb-3">
                  <span> {guide.destination}</span>
                  <span> {guide.readTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">By {guide.author}</span>
                  <Button className="text-accent-secondary text-sm hover:text-blue-800 font-medium">
                    Read Guide →
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Guide Categories</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-4 border border-neutral-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer">
              <span className="text-3xl mb-2 block">️</span>
              <h3 className="font-medium text-neutral-900 mb-1">Culture & History</h3>
              <p className="text-sm text-neutral-600">Local traditions and historical insights</p>
            </div>
            <div className="text-center p-4 border border-neutral-200 rounded-lg hover:border-green-300 transition-colors cursor-pointer">
              <span className="text-3xl mb-2 block">️</span>
              <h3 className="font-medium text-neutral-900 mb-1">Food & Drink</h3>
              <p className="text-sm text-neutral-600">Culinary experiences and dining guides</p>
            </div>
            <div className="text-center p-4 border border-neutral-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer">
              <span className="text-3xl mb-2 block">️</span>
              <h3 className="font-medium text-neutral-900 mb-1">Adventure</h3>
              <p className="text-sm text-neutral-600">Outdoor activities and adventure guides</p>
            </div>
            <div className="text-center p-4 border border-neutral-200 rounded-lg hover:border-orange-300 transition-colors cursor-pointer">
              <span className="text-3xl mb-2 block"></span>
              <h3 className="font-medium text-neutral-900 mb-1">Budget Travel</h3>
              <p className="text-sm text-neutral-600">Money-saving tips and affordable options</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Why Trust Our Guides?</h3>
            <p className="text-neutral-600 mb-4">
              Each guide is curated by local experts and verified travelers to ensure accuracy, cultural respect, and up-to-date information.
            </p>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>• Local experts and vetted contributors</li>
              <li>• Frequent updates and seasonal tips</li>
              <li>• Balanced for accessibility, safety, and cost</li>
            </ul>
          </div>
          <div className="bg-background rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Get Personalized Help</h3>
            <p className="text-neutral-600 mb-4">
              Need a tailored itinerary or have accessibility considerations? Connect with our travel specialists.
            </p>
            <Button className="bg-accent-secondary text-primary-foreground px-4 py-2 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Talk to a Specialist
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
