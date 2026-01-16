
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const metadata: Metadata = {
  title: 'Video Tutorials | ATLVS + GVTEWAY Support',
  description: 'Watch step-by-step video tutorials to learn how to use ATLVS + GVTEWAY platform effectively.',
}

export default function TutorialsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Video Tutorials</h1>
          <p className="text-lg text-neutral-600">Watch step-by-step video guides to master our platform</p>
        </div>

        <div className="mb-8">
          <Input
            type="text"
            placeholder="Search tutorials..."
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-semantic-error"/>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <span className="text-semantic-error text-xl mr-3"></span>
            <div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">Featured Tutorial</h3>
              <p className="text-red-800">Watch our most popular tutorial on creating your first itinerary.</p>
              <div className="mt-4">
                <div className="aspect-video bg-neutral-200 rounded-lg mb-3">
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl">▶️</span>
                  </div>
                </div>
                <h4 className="font-medium text-neutral-900">Creating Your First Itinerary</h4>
                <p className="text-sm text-neutral-600">Learn how to use our AI-powered trip planner • 8:32</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-500 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-primary-foreground text-3xl">▶️</span>
              </div>
              <div className="absolute top-2 left-2 bg-accent-secondary text-primary-foreground px-2 py-1 rounded text-xs">
                Getting Started
              </div>
              <div className="absolute bottom-2 right-2 bg-neutral-900 bg-opacity-75 text-primary-foreground px-2 py-1 rounded text-xs">
                4:15
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-neutral-900 mb-1">Account Setup & Profile</h3>
              <p className="text-sm text-neutral-600 mb-2">Complete guide to setting up your account</p>
              <p className="text-xs text-neutral-500">2.1K views • 2 weeks ago</p>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="aspect-video bg-gradient-to-br from-green-400 to-teal-500 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-primary-foreground text-3xl">▶️</span>
              </div>
              <div className="absolute top-2 left-2 bg-semantic-success text-primary-foreground px-2 py-1 rounded text-xs">
                Search
              </div>
              <div className="absolute bottom-2 right-2 bg-neutral-900 bg-opacity-75 text-primary-foreground px-2 py-1 rounded text-xs">
                6:42
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-neutral-900 mb-1">Advanced Search Techniques</h3>
              <p className="text-sm text-neutral-600 mb-2">Find the perfect experiences with filters</p>
              <p className="text-xs text-neutral-500">1.8K views • 1 week ago</p>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="aspect-video bg-gradient-to-br from-purple-400 to-pink-500 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-primary-foreground text-3xl">▶️</span>
              </div>
              <div className="absolute top-2 left-2 bg-accent-primary text-primary-foreground px-2 py-1 rounded text-xs">
                Booking
              </div>
              <div className="absolute bottom-2 right-2 bg-neutral-900 bg-opacity-75 text-primary-foreground px-2 py-1 rounded text-xs">
                5:28
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-neutral-900 mb-1">Complete Booking Process</h3>
              <p className="text-sm text-neutral-600 mb-2">From selection to confirmation</p>
              <p className="text-xs text-neutral-500">3.2K views • 5 days ago</p>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="aspect-video bg-gradient-to-br from-orange-400 to-red-500 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-primary-foreground text-3xl">▶️</span>
              </div>
              <div className="absolute top-2 left-2 bg-semantic-warning text-primary-foreground px-2 py-1 rounded text-xs">
                Planning
              </div>
              <div className="absolute bottom-2 right-2 bg-neutral-900 bg-opacity-75 text-primary-foreground px-2 py-1 rounded text-xs">
                7:19
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-neutral-900 mb-1">Trip Planning with AI</h3>
              <p className="text-sm text-neutral-600 mb-2">Using our intelligent planner</p>
              <p className="text-xs text-neutral-500">2.7K views • 3 days ago</p>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="aspect-video bg-gradient-to-br from-teal-400 to-cyan-500 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-primary-foreground text-3xl">▶️</span>
              </div>
              <div className="absolute top-2 left-2 bg-teal-600 text-primary-foreground px-2 py-1 rounded text-xs">
                Membership
              </div>
              <div className="absolute bottom-2 right-2 bg-neutral-900 bg-opacity-75 text-primary-foreground px-2 py-1 rounded text-xs">
                4:51
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-neutral-900 mb-1">Membership Benefits Guide</h3>
              <p className="text-sm text-neutral-600 mb-2">Maximize your membership perks</p>
              <p className="text-xs text-neutral-500">1.9K views • 1 week ago</p>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="aspect-video bg-gradient-to-br from-indigo-400 to-blue-500 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-primary-foreground text-3xl">▶️</span>
              </div>
              <div className="absolute top-2 left-2 bg-indigo-600 text-primary-foreground px-2 py-1 rounded text-xs">
                Mobile
              </div>
              <div className="absolute bottom-2 right-2 bg-neutral-900 bg-opacity-75 text-primary-foreground px-2 py-1 rounded text-xs">
                3:34
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-neutral-900 mb-1">Mobile App Overview</h3>
              <p className="text-sm text-neutral-600 mb-2">Essential features and navigation</p>
              <p className="text-xs text-neutral-500">2.4K views • 4 days ago</p>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Tutorial Series</h2>
          <div className="space-y-6">
            <div className="border border-neutral-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-1">Beginner&apos;s Guide to ATLVS + GVTEWAY</h3>
                  <p className="text-neutral-600 mb-2">Complete series for new users • 5 videos</p>
                </div>
                <span className="bg-accent-primary/10 text-blue-800 text-sm px-3 py-1 rounded">Beginner</span>
              </div>
              <div className="grid md:grid-cols-5 gap-2">
                <div className="text-center">
                  <div className="aspect-video bg-neutral-200 rounded mb-2"></div>
                  <p className="text-xs text-neutral-600">1. Getting Started</p>
                </div>
                <div className="text-center">
                  <div className="aspect-video bg-neutral-200 rounded mb-2"></div>
                  <p className="text-xs text-neutral-600">2. Account Setup</p>
                </div>
                <div className="text-center">
                  <div className="aspect-video bg-neutral-200 rounded mb-2"></div>
                  <p className="text-xs text-neutral-600">3. First Booking</p>
                </div>
                <div className="text-center">
                  <div className="aspect-video bg-neutral-200 rounded mb-2"></div>
                  <p className="text-xs text-neutral-600">4. Trip Planning</p>
                </div>
                <div className="text-center">
                  <div className="aspect-video bg-neutral-200 rounded mb-2"></div>
                  <p className="text-xs text-neutral-600">5. Advanced Features</p>
                </div>
              </div>
            </div>

            <div className="border border-neutral-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-1">Advanced Booking Techniques</h3>
                  <p className="text-neutral-600 mb-2">Master the booking system • 3 videos</p>
                </div>
                <span className="bg-semantic-success/10 text-green-800 text-sm px-3 py-1 rounded">Advanced</span>
              </div>
              <div className="grid md:grid-cols-3 gap-2">
                <div className="text-center">
                  <div className="aspect-video bg-neutral-200 rounded mb-2"></div>
                  <p className="text-xs text-neutral-600">1. Multi-City Trips</p>
                </div>
                <div className="text-center">
                  <div className="aspect-video bg-neutral-200 rounded mb-2"></div>
                  <p className="text-xs text-neutral-600">2. Group Bookings</p>
                </div>
                <div className="text-center">
                  <div className="aspect-video bg-neutral-200 rounded mb-2"></div>
                  <p className="text-xs text-neutral-600">3. Last-Minute Deals</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Tutorial Categories</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-4 border border-neutral-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer">
              <span className="text-3xl mb-2 block"></span>
              <h3 className="font-medium text-neutral-900 mb-1">Account & Profile</h3>
              <p className="text-sm text-neutral-600">6 tutorials</p>
            </div>
            <div className="text-center p-4 border border-neutral-200 rounded-lg hover:border-green-300 transition-colors cursor-pointer">
              <span className="text-3xl mb-2 block"></span>
              <h3 className="font-medium text-neutral-900 mb-1">Search & Discovery</h3>
              <p className="text-sm text-neutral-600">8 tutorials</p>
            </div>
            <div className="text-center p-4 border border-neutral-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer">
              <span className="text-3xl mb-2 block"></span>
              <h3 className="font-medium text-neutral-900 mb-1">Booking & Planning</h3>
              <p className="text-sm text-neutral-600">12 tutorials</p>
            </div>
            <div className="text-center p-4 border border-neutral-200 rounded-lg hover:border-orange-300 transition-colors cursor-pointer">
              <span className="text-3xl mb-2 block"></span>
              <h3 className="font-medium text-neutral-900 mb-1">Membership</h3>
              <p className="text-sm text-neutral-600">5 tutorials</p>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Most Viewed Tutorials</h2>
          <div className="space-y-4">
            {[
              { title: "How to Book Your First Experience", views: "15.2K", duration: "5:23", category: "Booking" },
              { title: "Understanding Membership Tiers", views: "12.8K", duration: "6:15", category: "Membership" },
              { title: "Advanced Search Filters", views: "9.7K", duration: "4:41", category: "Search" },
              { title: "Trip Planning with AI Assistant", views: "8.9K", duration: "7:52", category: "Planning" },
              { title: "Mobile App Quick Start", views: "7.3K", duration: "3:28", category: "Mobile" }
            ].map((tutorial, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:border-red-300 transition-colors cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-12 bg-neutral-200 rounded flex items-center justify-center">
                    <span className="text-semantic-error text-lg">▶️</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900">{tutorial.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-neutral-600">
                      <span>{tutorial.category}</span>
                      <span>•</span>
                      <span>{tutorial.duration}</span>
                      <span>•</span>
                      <span>{tutorial.views} views</span>
                    </div>
                  </div>
                </div>
                <span className="text-semantic-error">▶️</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-900 mb-4">Request a Tutorial</h2>
          <p className="text-red-800 mb-4">
            Don&apos;t see a tutorial for what you need? Let us know what topic you&apos;d like us to cover.
          </p>
          <div className="flex gap-4">
            <Input
              type="text"
              placeholder="What tutorial would you like?"
              className="flex-1 px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-semantic-error"/>
            <Button className="bg-semantic-error text-primary-foreground px-6 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-semantic-error focus:ring-offset-2">
              Request
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
