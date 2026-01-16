
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const metadata: Metadata = {
  title: 'User Guides | ATLVS + GVTEWAY Support',
  description: 'Step-by-step guides to help you make the most of ATLVS + GVTEWAY platform and services.',
}

export default function GuidesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">User Guides</h1>
          <p className="text-lg text-neutral-600">Step-by-step instructions to help you get the most out of our platform</p>
        </div>

        <div className="mb-8">
          <Input
            type="text"
            placeholder="Search guides..."
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"/>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-background rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-center mb-4">
              <span className="text-4xl mb-2 block"></span>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Getting Started</h3>
              <p className="text-neutral-600">Create your account and explore the platform</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-neutral-600">
                <span className="w-2 h-2 bg-accent-primary rounded-full mr-2"></span>
                Creating your account
              </div>
              <div className="flex items-center text-neutral-600">
                <span className="w-2 h-2 bg-accent-primary rounded-full mr-2"></span>
                Setting up your profile
              </div>
              <div className="flex items-center text-neutral-600">
                <span className="w-2 h-2 bg-accent-primary rounded-full mr-2"></span>
                Navigating the dashboard
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-center mb-4">
              <span className="text-4xl mb-2 block"></span>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Finding Experiences</h3>
              <p className="text-neutral-600">Search and discover amazing travel experiences</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-neutral-600">
                <span className="w-2 h-2 bg-semantic-success rounded-full mr-2"></span>
                Using search filters
              </div>
              <div className="flex items-center text-neutral-600">
                <span className="w-2 h-2 bg-semantic-success rounded-full mr-2"></span>
                Browsing destinations
              </div>
              <div className="flex items-center text-neutral-600">
                <span className="w-2 h-2 bg-semantic-success rounded-full mr-2"></span>
                Reading reviews
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-center mb-4">
              <span className="text-4xl mb-2 block"></span>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Making Bookings</h3>
              <p className="text-neutral-600">Complete your reservations with confidence</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-neutral-600">
                <span className="w-2 h-2 bg-accent-primary rounded-full mr-2"></span>
                Booking process
              </div>
              <div className="flex items-center text-neutral-600">
                <span className="w-2 h-2 bg-accent-primary rounded-full mr-2"></span>
                Payment options
              </div>
              <div className="flex items-center text-neutral-600">
                <span className="w-2 h-2 bg-accent-primary rounded-full mr-2"></span>
                Confirmation details
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-center mb-4">
              <span className="text-4xl mb-2 block">️</span>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Trip Planning</h3>
              <p className="text-neutral-600">Use our tools to plan the perfect trip</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-neutral-600">
                <span className="w-2 h-2 bg-semantic-warning rounded-full mr-2"></span>
                Creating itineraries
              </div>
              <div className="flex items-center text-neutral-600">
                <span className="w-2 h-2 bg-semantic-warning rounded-full mr-2"></span>
                Managing reservations
              </div>
              <div className="flex items-center text-neutral-600">
                <span className="w-2 h-2 bg-semantic-warning rounded-full mr-2"></span>
                Travel documents
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-center mb-4">
              <span className="text-4xl mb-2 block"></span>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Membership</h3>
              <p className="text-neutral-600">Maximize your membership benefits</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-neutral-600">
                <span className="w-2 h-2 bg-semantic-error rounded-full mr-2"></span>
                Joining membership
              </div>
              <div className="flex items-center text-neutral-600">
                <span className="w-2 h-2 bg-semantic-error rounded-full mr-2"></span>
                Using travel credits
              </div>
              <div className="flex items-center text-neutral-600">
                <span className="w-2 h-2 bg-semantic-error rounded-full mr-2"></span>
                Accessing perks
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-center mb-4">
              <span className="text-4xl mb-2 block"></span>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Mobile App</h3>
              <p className="text-neutral-600">Get help with our mobile application</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-neutral-600">
                <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                App installation
              </div>
              <div className="flex items-center text-neutral-600">
                <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                Key features
              </div>
              <div className="flex items-center text-neutral-600">
                <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                Troubleshooting
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Popular Guides</h2>
          <div className="space-y-4">
            {[
              {
                title: "How to Create Your First Itinerary",
                category: "Trip Planning",
                readTime: "5 min read",
                featured: true
              },
              {
                title: "Understanding Booking Policies",
                category: "Bookings",
                readTime: "3 min read",
                featured: false
              },
              {
                title: "Maximizing Your Membership Benefits",
                category: "Membership",
                readTime: "7 min read",
                featured: false
              },
              {
                title: "Using the Mobile App for Travel",
                category: "Mobile",
                readTime: "4 min read",
                featured: true
              },
              {
                title: "Finding the Best Deals",
                category: "Search",
                readTime: "6 min read",
                featured: false
              },
              {
                title: "Managing Your Account Settings",
                category: "Account",
                readTime: "3 min read",
                featured: false
              }
            ].map((guide, index) => (
              <div key={index} className={`flex justify-between items-center p-4 border border-neutral-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer ${guide.featured ? 'bg-blue-50' : ''}`}>
                <div className="flex-1">
                  <h3 className="font-medium text-neutral-900 mb-1">{guide.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-neutral-600">
                    <span>{guide.category}</span>
                    <span>•</span>
                    <span>{guide.readTime}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {guide.featured && (
                    <span className="bg-accent-primary/10 text-blue-800 text-xs px-2 py-1 rounded">Featured</span>
                  )}
                  <span className="text-accent-secondary">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Guide Categories</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-4 border border-neutral-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer">
              <span className="text-3xl mb-2 block"></span>
              <h3 className="font-medium text-neutral-900 mb-1">Getting Started</h3>
              <p className="text-sm text-neutral-600">8 guides</p>
            </div>
            <div className="text-center p-4 border border-neutral-200 rounded-lg hover:border-green-300 transition-colors cursor-pointer">
              <span className="text-3xl mb-2 block"></span>
              <h3 className="font-medium text-neutral-900 mb-1">Bookings</h3>
              <p className="text-sm text-neutral-600">12 guides</p>
            </div>
            <div className="text-center p-4 border border-neutral-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer">
              <span className="text-3xl mb-2 block">️</span>
              <h3 className="font-medium text-neutral-900 mb-1">Travel Planning</h3>
              <p className="text-sm text-neutral-600">15 guides</p>
            </div>
            <div className="text-center p-4 border border-neutral-200 rounded-lg hover:border-orange-300 transition-colors cursor-pointer">
              <span className="text-3xl mb-2 block"></span>
              <h3 className="font-medium text-neutral-900 mb-1">Membership</h3>
              <p className="text-sm text-neutral-600">6 guides</p>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Quick Start Guides</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-neutral-200 rounded-lg p-4">
              <h3 className="font-medium text-neutral-900 mb-3">New User Quick Start</h3>
              <ol className="list-decimal list-inside text-sm text-neutral-600 space-y-1">
                <li>Create your free account</li>
                <li>Set up your travel preferences</li>
                <li>Browse destinations and experiences</li>
                <li>Make your first booking</li>
                <li>Join our membership program</li>
              </ol>
              <Button className="mt-4 w-full bg-accent-secondary text-primary-foreground py-2 px-4 rounded-md hover:bg-accent-tertiary text-sm">
                Start Here
              </Button>
            </div>
            <div className="border border-neutral-200 rounded-lg p-4">
              <h3 className="font-medium text-neutral-900 mb-3">Planning Your First Trip</h3>
              <ol className="list-decimal list-inside text-sm text-neutral-600 space-y-1">
                <li>Use our trip planner tool</li>
                <li>Select your destination and dates</li>
                <li>Choose activities and experiences</li>
                <li>Book accommodations and transport</li>
                <li>Create your personalized itinerary</li>
              </ol>
              <Button className="mt-4 w-full bg-semantic-success text-primary-foreground py-2 px-4 rounded-md hover:bg-green-700 text-sm">
                Plan a Trip
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Need More Help?</h2>
          <p className="text-blue-800 mb-4">
            Can&apos;t find what you&apos;re looking for? Our support team can provide personalized guidance.
          </p>
          <div className="flex gap-4">
            <a href="/support/contact" className="bg-accent-secondary text-primary-foreground px-6 py-3 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Contact Support
            </a>
            <a href="/support/tutorials" className="bg-background text-accent-secondary border border-blue-600 px-6 py-3 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
              Watch Tutorials
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
