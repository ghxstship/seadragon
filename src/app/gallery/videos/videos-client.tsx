'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function VideosClient() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">Video Gallery</h1>
          <p className="text-lg text-neutral-600">Experience destinations through cinematic travel videos</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search videos..."
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-semantic-error"
            />
          </div>
          <div className="flex gap-2">
            <Select defaultValue="all-categories">
              <SelectTrigger className="px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-semantic-error">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-categories">All Categories</SelectItem>
                <SelectItem value="destinations">Destinations</SelectItem>
                <SelectItem value="experiences">Experiences</SelectItem>
                <SelectItem value="culture">Culture</SelectItem>
                <SelectItem value="adventure">Adventure</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-durations">
              <SelectTrigger className="px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-semantic-error">
                <SelectValue placeholder="All Durations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-durations">All Durations</SelectItem>
                <SelectItem value="under-5-min">Under 5 min</SelectItem>
                <SelectItem value="5-15-min">5-15 min</SelectItem>
                <SelectItem value="15-min">15+ min</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[
            {
              title: "Bali Island Paradise",
              duration: "8:32",
              views: "12.5K",
              description: "Explore the stunning beaches and rice terraces of Bali",
              featured: true
            },
            {
              title: "Tokyo Night Life",
              duration: "12:15",
              views: "8.9K",
              description: "Experience the vibrant energy of Tokyo after dark",
              featured: false
            },
            {
              title: "Swiss Alps Hiking",
              duration: "15:47",
              views: "15.2K",
              description: "Epic mountain trails and breathtaking views",
              featured: true
            },
            {
              title: "Santorini Sunsets",
              duration: "6:28",
              views: "22.1K",
              description: "Magical sunsets over the Aegean Sea",
              featured: false
            },
            {
              title: "Machu Picchu Journey",
              duration: "18:33",
              views: "18.7K",
              description: "Ancient ruins and Andean adventures",
              featured: false
            },
            {
              title: "Dubai Modern Wonders",
              duration: "11:52",
              views: "9.4K",
              description: "From desert to skyscrapers",
              featured: false
            }
          ].map((video, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="relative mb-4">
                <div className="aspect-video bg-gradient-to-br from-red-400 to-pink-500 rounded-lg overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-primary-foreground text-4xl">▶️</span>
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-neutral-900 bg-opacity-75 text-primary-foreground px-2 py-1 rounded text-sm">
                  {video.duration}
                </div>
                {video.featured && (
                  <div className="absolute top-2 left-2 bg-semantic-error text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                    Featured
                  </div>
                )}
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-1 group-hover:text-semantic-error transition-colors">
                {video.title}
              </h3>
              <p className="text-sm text-neutral-600 mb-2">{video.description}</p>
              <p className="text-xs text-neutral-500">{video.views} views</p>
            </div>
          ))}
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Video Series</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-neutral-900 mb-3">Destination Deep Dives</h3>
              <p className="text-neutral-600 mb-4">
                In-depth explorations of popular travel destinations, featuring local culture,
                hidden gems, and authentic experiences.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tokyo: Beyond the Neon</span>
                  <span className="text-neutral-500">Episode 12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Bali: Island of the Gods</span>
                  <span className="text-neutral-500">Episode 8</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Morocco: Desert Dreams</span>
                  <span className="text-neutral-500">Episode 15</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-neutral-900 mb-3">Experience Chronicles</h3>
              <p className="text-neutral-600 mb-4">
                Follow travelers on unique adventures, from cooking classes to extreme sports,
                capturing the thrill of discovery.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Sushi Master Class</span>
                  <span className="text-neutral-500">Episode 6</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Rock Climbing in Yosemite</span>
                  <span className="text-neutral-500">Episode 3</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tango in Buenos Aires</span>
                  <span className="text-neutral-500">Episode 9</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Popular Categories</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-4 border border-neutral-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors cursor-pointer">
              <span className="text-3xl mb-2 block">️</span>
              <h3 className="font-medium text-neutral-900 mb-1">Beach Destinations</h3>
              <p className="text-sm text-neutral-600">32 videos</p>
            </div>
            <div className="text-center p-4 border border-neutral-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors cursor-pointer">
              <span className="text-3xl mb-2 block">️</span>
              <h3 className="font-medium text-neutral-900 mb-1">Mountain Adventures</h3>
              <p className="text-sm text-neutral-600">28 videos</p>
            </div>
            <div className="text-center p-4 border border-neutral-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer">
              <span className="text-3xl mb-2 block">️</span>
              <h3 className="font-medium text-neutral-900 mb-1">City Explorations</h3>
              <p className="text-sm text-neutral-600">45 videos</p>
            </div>
            <div className="text-center p-4 border border-neutral-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors cursor-pointer">
              <span className="text-3xl mb-2 block"></span>
              <h3 className="font-medium text-neutral-900 mb-1">Cultural Experiences</h3>
              <p className="text-sm text-neutral-600">39 videos</p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-900 mb-4">Submit Your Travel Videos</h2>
          <p className="text-red-800 mb-4">
            Share your travel videos with our community. Get featured on our channel and inspire fellow travelers.
          </p>
          <div className="flex gap-4">
            <Button className="bg-semantic-error text-primary-foreground px-6 py-3 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-semantic-error focus:ring-offset-2">
              Upload Video
            </Button>
            <Button className="bg-background text-semantic-error border border-red-600 px-6 py-3 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2">
              Creator Guidelines
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
