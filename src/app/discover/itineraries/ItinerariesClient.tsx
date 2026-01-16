'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ItinerariesClient() {
  const [duration, setDuration] = useState('all-durations')
  const [budget, setBudget] = useState('all-budgets')
  const [style, setStyle] = useState('all-styles')

  const itineraries = [
    {
      title: "Tokyo: Modern Meets Traditional",
      destination: "Tokyo, Japan",
      duration: "7 days",
      budget: "Moderate",
      style: "Cultural Immersion",
      description: "Experience the perfect blend of ancient temples and cutting-edge technology",
      highlights: ["Senso-ji Temple", "Shibuya Crossing", "Tsukiji Fish Market", "Mt. Fuji day trip"],
      image: "",
      featured: true,
      rating: 4.9,
      reviews: 127
    },
    {
      title: "Bali Paradise Escape",
      destination: "Bali, Indonesia",
      duration: "10 days",
      budget: "Moderate",
      style: "Relaxation & Wellness",
      description: "Rejuvenate in tropical paradise with yoga, beaches, and cultural experiences",
      highlights: ["Ubud rice terraces", "Beach yoga sessions", "Traditional Balinese cooking", "Spa treatments"],
      image: "️",
      featured: true,
      rating: 4.8,
      reviews: 89
    },
    {
      title: "Mediterranean Cruise",
      destination: "Greece & Italy",
      duration: "12 days",
      budget: "Luxury",
      style: "Cultural Immersion",
      description: "Sail the Greek islands and Italian coast with premium experiences",
      highlights: ["Santorini sunsets", "Ancient ruins", "Italian cuisine", "Private yacht excursions"],
      image: "",
      featured: false,
      rating: 4.7,
      reviews: 156
    },
    {
      title: "Iceland Adventure",
      destination: "Iceland",
      duration: "8 days",
      budget: "Moderate",
      style: "Adventure & Outdoors",
      description: "Explore glaciers, volcanoes, and the northern lights",
      highlights: ["Golden Circle tour", "Blue Lagoon", "Northern lights chase", "Glacier hiking"],
      image: "",
      featured: false,
      rating: 4.9,
      reviews: 203
    },
    {
      title: "Moroccan Desert Journey",
      destination: "Morocco",
      duration: "9 days",
      budget: "Moderate",
      style: "Cultural Immersion",
      description: "Journey through ancient cities and the Sahara Desert",
      highlights: ["Marrakech souks", "Atlas Mountains", "Desert camping", "Berber villages"],
      image: "️",
      featured: true,
      rating: 4.6,
      reviews: 78
    },
    {
      title: "New York City Explorer",
      destination: "New York City, USA",
      duration: "5 days",
      budget: "Moderate",
      style: "City Exploration",
      description: "Experience the energy and culture of the Big Apple",
      highlights: ["Central Park", "Broadway show", "Museum Mile", "Food tour", "Statue of Liberty"],
      image: "️",
      featured: false,
      rating: 4.5,
      reviews: 312
    },
    {
      title: "Peru: Inca Trail to Machu Picchu",
      destination: "Cusco, Peru",
      duration: "14 days",
      budget: "Moderate",
      style: "Adventure & Outdoors",
      description: "Trek the legendary Inca Trail to the lost city of Machu Picchu",
      highlights: ["Cusco exploration", "Inca Trail trek", "Machu Picchu visit", "Sacred Valley"],
      image: "️",
      featured: true,
      rating: 4.9,
      reviews: 67
    },
    {
      title: "Barcelona & Costa Brava",
      destination: "Spain",
      duration: "7 days",
      budget: "Moderate",
      style: "Food & Wine",
      description: "Discover Gaudí's masterpieces and Mediterranean coastal beauty",
      highlights: ["Sagrada Familia", "Park Güell", "Tapas tours", "Costa Brava beaches"],
      image: "️",
      featured: false,
      rating: 4.7,
      reviews: 134
    },
    {
      title: "Queenstown Extreme",
      destination: "Queenstown, New Zealand",
      duration: "6 days",
      budget: "Luxury",
      style: "Adventure & Outdoors",
      description: "Experience the world's adventure capital in ultimate comfort",
      highlights: ["Bungee jumping", "Helicopter tours", "Wine tasting", "Lake cruises"],
      image: "",
      featured: true,
      rating: 4.8,
      reviews: 95
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Sample Itineraries</h1>
          <p className="text-lg text-neutral-600">Ready-made travel plans and inspiration for your next adventure</p>
        </div>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              type="text"
              placeholder="Search itineraries..."
              className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
            />
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger className="px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary w-[190px]">
                <SelectValue placeholder="All Durations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-durations">All Durations</SelectItem>
                <SelectItem value="weekend-2-3-days">Weekend (2-3 days)</SelectItem>
                <SelectItem value="short-trip-4-7-days">Short Trip (4-7 days)</SelectItem>
                <SelectItem value="week-long-8-10-days">Week-long (8-10 days)</SelectItem>
                <SelectItem value="extended-11-days">Extended (11+ days)</SelectItem>
              </SelectContent>
            </Select>
            <Select value={budget} onValueChange={setBudget}>
              <SelectTrigger className="px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary w-[190px]">
                <SelectValue placeholder="All Budgets" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-budgets">All Budgets</SelectItem>
                <SelectItem value="budget-1-000-2-000">Budget ($1,000-2,000)</SelectItem>
                <SelectItem value="moderate-2-001-4-000">Moderate ($2,001-4,000)</SelectItem>
                <SelectItem value="luxury-4-001-7-000">Luxury ($4,001-7,000)</SelectItem>
                <SelectItem value="ultra-luxury-7-000">Ultra-Luxury ($7,000+)</SelectItem>
              </SelectContent>
            </Select>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger className="px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary w-[190px]">
                <SelectValue placeholder="All Styles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-styles">All Styles</SelectItem>
                <SelectItem value="cultural-immersion">Cultural Immersion</SelectItem>
                <SelectItem value="adventure-outdoors">Adventure & Outdoors</SelectItem>
                <SelectItem value="relaxation-wellness">Relaxation & Wellness</SelectItem>
                <SelectItem value="food-wine">Food & Wine</SelectItem>
                <SelectItem value="city-exploration">City Exploration</SelectItem>
                <SelectItem value="family-friendly">Family Friendly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {itineraries.map((itinerary, index) => (
            <div key={index} className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-4xl">
                  {itinerary.image}
                </div>
                {itinerary.featured && (
                  <div className="absolute top-2 left-2 bg-semantic-warning text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                    Featured
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-background bg-opacity-90 text-neutral-800 px-2 py-1 rounded text-xs">
                  {itinerary.style}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">{itinerary.title}</h3>
                <p className="text-neutral-600 mb-3">{itinerary.description}</p>
                <div className="flex items-center justify-between text-sm text-neutral-500 mb-3">
                  <span> {itinerary.destination}</span>
                  <span>⏱️ {itinerary.duration}</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-400">⭐</span>
                    <span className="text-sm font-medium">{itinerary.rating}</span>
                    <span className="text-sm text-neutral-500">({itinerary.reviews})</span>
                  </div>
                  <span className="text-sm bg-neutral-100 text-neutral-700 px-2 py-1 rounded">
                    {itinerary.budget}
                  </span>
                </div>
                <div className="mb-4">
                  <h4 className="font-medium text-neutral-900 mb-2">Highlights:</h4>
                  <div className="flex flex-wrap gap-1">
                    {itinerary.highlights.slice(0, 2).map((highlight, i) => (
                      <span key={i} className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded text-xs">
                        {highlight}
                      </span>
                    ))}
                    {itinerary.highlights.length > 2 && (
                      <span className="text-neutral-500 text-xs">+{itinerary.highlights.length - 2} more</span>
                    )}
                  </div>
                </div>
                <Button className="w-full bg-accent-secondary text-primary-foreground py-2 px-4 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
                  View Itinerary
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Itinerary Categories</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "️", title: "Beach & Relaxation", desc: "Tropical getaways and wellness retreats", count: "18 itineraries" },
              { icon: "️", title: "Adventure & Nature", desc: "Outdoor exploration and thrilling activities", count: "24 itineraries" },
              { icon: "️", title: "Culture & History", desc: "Historical sites and cultural immersion", count: "16 itineraries" },
              { icon: "️", title: "Food & Wine", desc: "Culinary journeys and gastronomic adventures", count: "12 itineraries" },
              { icon: "️", title: "City Breaks", desc: "Urban exploration and city experiences", count: "21 itineraries" },
              { icon: "‍‍‍", title: "Family Travel", desc: "Kid-friendly adventures and family experiences", count: "9 itineraries" },
            ].map((item) => (
              <div key={item.title} className="text-center p-6 border border-neutral-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer">
                <span className="text-4xl mb-4 block">{item.icon}</span>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">{item.title}</h3>
                <p className="text-neutral-600 mb-4">{item.desc}</p>
                <p className="text-sm text-neutral-500">{item.count}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Itinerary Planning Tips</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="w-8 h-8 bg-accent-primary/10 text-blue-800 rounded-full flex items-center justify-center font-bold text-sm mr-3 mt-0.5"></span>
                <div>
                  <h3 className="font-medium text-neutral-900">Know Your Interests</h3>
                  <p className="text-sm text-neutral-600">Choose itineraries that match your travel style and preferences</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="w-8 h-8 bg-semantic-success/10 text-green-800 rounded-full flex items-center justify-center font-bold text-sm mr-3 mt-0.5"></span>
                <div>
                  <h3 className="font-medium text-neutral-900">Consider Timing</h3>
                  <p className="text-sm text-neutral-600">Check seasonal considerations and peak travel times</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="w-8 h-8 bg-accent-primary/10 text-purple-800 rounded-full flex items-center justify-center font-bold text-sm mr-3 mt-0.5"></span>
                <div>
                  <h3 className="font-medium text-neutral-900">Budget Wisely</h3>
                  <p className="text-sm text-neutral-600">Factor in all costs including flights, accommodations, and activities</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="w-8 h-8 bg-semantic-warning/10 text-orange-800 rounded-full flex items-center justify-center font-bold text-sm mr-3 mt-0.5"></span>
                <div>
                  <h3 className="font-medium text-neutral-900">Build in Flexibility</h3>
                  <p className="text-sm text-neutral-600">Leave room for spontaneous discoveries and rest days</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 border border-neutral-200 rounded-lg">
                <h3 className="font-medium text-neutral-900 mb-2">Customization Options</h3>
                <p className="text-sm text-neutral-600">Adjust duration, swap activities, upgrade accommodations, or modify for group size.</p>
              </div>
              <div className="p-4 border border-neutral-200 rounded-lg">
                <h3 className="font-medium text-neutral-900 mb-2">Travel Docs & Timing</h3>
                <p className="text-sm text-neutral-600">Check visa, passport validity, seasonal weather, and local holidays.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Create Your Perfect Itinerary</h2>
          <p className="text-neutral-600 mb-6">Use our AI-powered planner to customize any itinerary or create your own from scratch</p>
          <div className="flex justify-center gap-4">
            <a href="/travel/planning" className="bg-accent-secondary text-primary-foreground px-6 py-3 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Use AI Planner
            </a>
            <a href="/contact" className="bg-background text-accent-secondary border border-blue-600 px-6 py-3 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
              Request Custom Itinerary
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
