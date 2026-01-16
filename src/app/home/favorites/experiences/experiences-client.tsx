'use client'

import { Button } from "@/components/ui/button"

export function ExperiencesFavoritesClient() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Favorite Experiences</h1>
          <p className="text-neutral-600">Your saved travel experiences and activities</p>
        </div>

        {/* Experience cards (static showcase; replace with live data when available) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[
            { emoji: "", title: "Traditional Tea Ceremony", category: "Cultural", rating: "4.9 (234)" },
            { emoji: "", title: "Bali Cooking Class", category: "Food", rating: "4.7 (156)" },
            { emoji: "‍️", title: "Patagonia Hiking Tour", category: "Adventure", rating: "5.0 (89)" },
            { emoji: "‍️", title: "Meditation Retreat", category: "Wellness", rating: "4.8 (67)" },
            { emoji: "", title: "Street Art Tour", category: "Arts", rating: "4.6 (134)" },
            { emoji: "", title: "Scuba Diving Lesson", category: "Water Sports", rating: "4.9 (203)" },
          ].map((item, idx) => (
            <div key={idx} className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative">
                <div className="aspect-video bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
                  <span className="text-4xl">{item.emoji}</span>
                </div>
                <div className="absolute top-2 right-2">
                  <Button className="w-8 h-8 bg-semantic-error rounded-full flex items-center justify-center text-primary-foreground hover:bg-semantic-error">
                    <span className="text-sm"></span>
                  </Button>
                </div>
                <div className="absolute bottom-2 left-2 bg-background bg-opacity-90 text-neutral-800 px-2 py-1 rounded text-xs">
                  {item.category}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-neutral-900 mb-2">{item.title}</h3>
                <p className="text-neutral-600 text-sm mb-3">Your saved favorite experience</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <span className="text-semantic-warning mr-1"></span>
                    <span className="text-neutral-500">{item.rating}</span>
                  </div>
                  <span className="text-accent-secondary font-medium">Book Now</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Categories / actions */}
        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Experience Categories</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { emoji: "", title: "Cultural", count: "8 favorites" },
              { emoji: "", title: "Food", count: "5 favorites" },
              { emoji: "️", title: "Adventure", count: "9 favorites" },
              { emoji: "‍️", title: "Wellness", count: "4 favorites" },
            ].map((cat, idx) => (
              <Button key={idx} className="p-4 border border-neutral-200 rounded-lg hover:border-blue-300 transition-colors text-left">
                <div className="text-lg mb-2">{cat.emoji}</div>
                <h3 className="font-medium text-neutral-900 mb-1">{cat.title}</h3>
                <p className="text-sm text-neutral-600">{cat.count}</p>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
