
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: 'Travel Guides | ATLVS + GVTEWAY',
  description: 'Expert travel guides to help you make the most of your destination.',
}

export default function GuidesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-neutral-900 mb-4">Travel Guides</h1>
        <p className="text-lg text-neutral-600 mb-8">Expert insights and local knowledge for unforgettable trips</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Sample guide cards */}
          {[
            {
              title: "Tokyo Nightlife Guide",
              destination: "Tokyo, Japan",
              category: "Nightlife",
              readTime: "8 min read",
              highlights: ["Best izakayas", "Neon districts", "Late-night eats"]
            },
            {
              title: "Bali Wellness Retreats",
              destination: "Bali, Indonesia",
              category: "Wellness",
              readTime: "12 min read",
              highlights: ["Yoga studios", "Spa treatments", "Meditation spots"]
            },
            {
              title: "Paris Food Markets",
              destination: "Paris, France",
              category: "Food",
              readTime: "10 min read",
              highlights: ["Local markets", "Street food", "Wine bars"]
            },
            {
              title: "Costa Rica Wildlife",
              destination: "Costa Rica",
              category: "Nature",
              readTime: "15 min read",
              highlights: ["National parks", "Bird watching", "Wildlife tours"]
            },
            {
              title: "Morocco Desert Adventure",
              destination: "Morocco",
              category: "Adventure",
              readTime: "14 min read",
              highlights: ["Sahara camping", "Camel treks", "Berber culture"]
            },
            {
              title: "New Zealand Hiking",
              destination: "New Zealand",
              category: "Adventure",
              readTime: "11 min read",
              highlights: ["Great walks", "Safety tips", "Gear recommendations"]
            }
          ].map((guide, index) => (
            <div key={index} className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-r from-green-400 to-blue-500"></div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-1">{guide.title}</h3>
                    <p className="text-sm text-neutral-600">{guide.destination}</p>
                  </div>
                  <span className="text-xs font-medium text-semantic-success bg-green-50 px-2 py-1 rounded">
                    {guide.category}
                  </span>
                </div>
                <p className="text-sm text-neutral-500 mb-3">{guide.readTime}</p>
                <ul className="text-sm text-neutral-600 mb-4 space-y-1">
                  {guide.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-semantic-success rounded-full mr-2"></span>
                      {highlight}
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-semantic-success text-primary-foreground py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-semantic-success focus:ring-offset-2 text-sm">
                  Read Guide
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Popular Destinations</h3>
          <div className="grid md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              'Tokyo', 'Paris', 'Bali', 'New York', 'Rome', 'Barcelona',
              'Amsterdam', 'Prague', 'Berlin', 'Vienna', 'Budapest', 'Lisbon'
            ].map((city) => (
              <Button key={city} className="text-center p-3 border border-neutral-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <div className="text-sm font-medium text-neutral-900">{city}</div>
              </Button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Guide Categories</h3>
            <div className="space-y-3">
              {[
                { name: 'Food & Dining', count: 45 },
                { name: 'Nightlife', count: 32 },
                { name: 'Adventure Activities', count: 28 },
                { name: 'Cultural Experiences', count: 36 },
                { name: 'Shopping', count: 22 },
                { name: 'Transportation', count: 18 }
              ].map((category) => (
                <div key={category.name} className="flex justify-between items-center p-3 border border-neutral-200 rounded-md hover:border-purple-300 hover:bg-purple-50 transition-colors cursor-pointer">
                  <span className="text-neutral-900">{category.name}</span>
                  <span className="text-sm text-neutral-500">{category.count} guides</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Travel Tips Series</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-accent-primary pl-4">
                <h4 className="font-medium text-neutral-900 mb-1">Packing Light for Any Trip</h4>
                <p className="text-sm text-neutral-600 mb-2">Essential tips for efficient packing</p>
                <span className="text-xs text-accent-secondary">5 min read</span>
              </div>
              <div className="border-l-4 border-semantic-success pl-4">
                <h4 className="font-medium text-neutral-900 mb-1">Sustainable Travel Practices</h4>
                <p className="text-sm text-neutral-600 mb-2">Reduce your environmental impact</p>
                <span className="text-xs text-semantic-success">7 min read</span>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-medium text-neutral-900 mb-1">Solo Travel Safety</h4>
                <p className="text-sm text-neutral-600 mb-2">Stay safe while traveling alone</p>
                <span className="text-xs text-accent-primary">6 min read</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
