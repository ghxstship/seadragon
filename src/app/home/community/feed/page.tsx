
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export const metadata: Metadata = {
  title: 'Community Feed | ATLVS + GVTEWAY',
  description: 'Connect with fellow travelers and share your experiences in the ATLVS + GVTEWAY community.',
}

export default function HomeCommunityFeedPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Community Feed</h1>
          <p className="text-neutral-600">Share your travel stories and connect with fellow adventurers</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start space-x-4 mb-4">
            <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center">
              <span className="text-accent-secondary font-semibold">JD</span>
            </div>
            <div className="flex-1">
              <Textarea
                rows={3}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                placeholder="What's your latest travel adventure? Share a story, tip, or photo..."/>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <Button className="flex items-center space-x-2 text-neutral-600 hover:text-accent-secondary">
                <span></span>
                <span className="text-sm">Photo</span>
              </Button>
              <Button className="flex items-center space-x-2 text-neutral-600 hover:text-accent-secondary">
                <span></span>
                <span className="text-sm">Location</span>
              </Button>
              <Button className="flex items-center space-x-2 text-neutral-600 hover:text-accent-secondary">
                <span>️</span>
                <span className="text-sm">Tag</span>
              </Button>
            </div>
            <Button className="bg-accent-secondary text-primary-foreground px-6 py-2 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Share
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-semantic-success/10 rounded-full flex items-center justify-center">
                <span className="text-semantic-success font-semibold">SC</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold text-neutral-900">Sarah Chen</h3>
                  <span className="text-neutral-500 text-sm">2 hours ago</span>
                  <span className="bg-semantic-success/10 text-green-800 text-xs px-2 py-1 rounded">Travel Tip</span>
                </div>
                <p className="text-neutral-700 mb-4">
                  Pro tip for Tokyo travelers: Download a data-only SIM card at the airport for ¥3,000 (~$20).
                  It's much cheaper than roaming and you get unlimited data! 🇯🇵
                </p>
                <div className="flex items-center space-x-4 text-sm text-neutral-600">
                  <Button className="flex items-center space-x-1 hover:text-accent-secondary">
                    <span></span>
                    <span>15 Likes</span>
                  </Button>
                  <Button className="flex items-center space-x-1 hover:text-accent-secondary">
                    <span></span>
                    <span>3 Comments</span>
                  </Button>
                  <Button className="flex items-center space-x-1 hover:text-accent-secondary">
                    <span>↗️</span>
                    <span>Share</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center">
                <span className="text-accent-primary font-semibold">MR</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold text-neutral-900">Marcus Rodriguez</h3>
                  <span className="text-neutral-500 text-sm">4 hours ago</span>
                  <span className="bg-accent-primary/10 text-purple-800 text-xs px-2 py-1 rounded">Question</span>
                </div>
                <p className="text-neutral-700 mb-4">
                  Anyone have recommendations for family-friendly activities in Kyoto? We're traveling with kids
                  ages 8 and 12 and want to mix cultural experiences with fun activities. ️‍‍‍
                </p>
                <div className="bg-neutral-100 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-2xl">️</span>
                    <div>
                      <h4 className="font-medium text-neutral-900">Kyoto Cultural District</h4>
                      <p className="text-sm text-neutral-600">Traditional temples and gardens</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-neutral-600">
                  <Button className="flex items-center space-x-1 hover:text-accent-secondary">
                    <span></span>
                    <span>8 Likes</span>
                  </Button>
                  <Button className="flex items-center space-x-1 hover:text-accent-secondary">
                    <span></span>
                    <span>5 Comments</span>
                  </Button>
                  <Button className="flex items-center space-x-1 hover:text-accent-secondary">
                    <span></span>
                    <span>Bookmark</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-semantic-warning/10 rounded-full flex items-center justify-center">
                <span className="text-semantic-warning font-semibold">LB</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold text-neutral-900">Luna Bennett</h3>
                  <span className="text-neutral-500 text-sm">6 hours ago</span>
                  <span className="bg-semantic-warning/10 text-orange-800 text-xs px-2 py-1 rounded">Experience</span>
                </div>
                <p className="text-neutral-700 mb-4">
                  Just completed an incredible hot air balloon ride over Cappadocia! The views of the fairy chimneys
                  at sunrise were absolutely magical. If you're planning a trip to Turkey, this is a must-do! 🇹🇷
                </p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="aspect-video bg-gradient-to-r from-orange-400 to-pink-500 rounded flex items-center justify-center">
                    <span className="text-4xl"></span>
                  </div>
                  <div className="aspect-video bg-gradient-to-r from-blue-400 to-purple-500 rounded flex items-center justify-center">
                    <span className="text-4xl"></span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-neutral-600">
                  <Button className="flex items-center space-x-1 hover:text-accent-secondary">
                    <span></span>
                    <span>23 Likes</span>
                  </Button>
                  <Button className="flex items-center space-x-1 hover:text-accent-secondary">
                    <span></span>
                    <span>9 Comments</span>
                  </Button>
                  <Button className="flex items-center space-x-1 hover:text-accent-secondary">
                    <span>️</span>
                    <span>Save</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-semantic-error/10 rounded-full flex items-center justify-center">
                <span className="text-semantic-error font-semibold">DB</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold text-neutral-900">ATLVS + GVTEWAY</h3>
                  <span className="text-neutral-500 text-sm">8 hours ago</span>
                  <span className="bg-semantic-error/10 text-red-800 text-xs px-2 py-1 rounded">Announcement</span>
                </div>
                <p className="text-neutral-700 mb-4">
                   Community Spotlight! We're featuring user-generated travel stories in our monthly newsletter.
                  Share your best travel memory and you might be featured next! #TravelStories
                </p>
                <Button className="bg-semantic-error text-primary-foreground px-4 py-2 rounded hover:bg-red-700 text-sm">
                  Share Your Story
                </Button>
                <div className="flex items-center space-x-4 text-sm text-neutral-600 mt-4">
                  <Button className="flex items-center space-x-1 hover:text-accent-secondary">
                    <span></span>
                    <span>47 Likes</span>
                  </Button>
                  <Button className="flex items-center space-x-1 hover:text-accent-secondary">
                    <span></span>
                    <span>12 Comments</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <Button className="bg-background text-neutral-700 border border-neutral-300 px-6 py-3 rounded-lg hover:bg-gray-50">
            Load More Posts
          </Button>
        </div>
      </div>
    </div>
  )
}
