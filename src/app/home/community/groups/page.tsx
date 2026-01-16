
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const metadata: Metadata = {
  title: 'Community Groups | ATLVS + GVTEWAY',
  description: 'Discover and join travel groups, connect with like-minded travelers, and participate in group activities.',
}

export default function HomeCommunityGroupsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Community Groups</h1>
          <p className="text-neutral-600">Connect with travelers who share your interests</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="relative">
              <div className="aspect-video bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
                <span className="text-4xl">️</span>
              </div>
              <div className="absolute top-2 left-2 bg-semantic-success text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                Adventure
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-neutral-900 mb-2">Outdoor Enthusiasts</h3>
              <p className="text-neutral-600 text-sm mb-3">Hiking, climbing, and outdoor adventures worldwide</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">2,847 members</span>
                <span className="text-accent-secondary font-medium">Joined</span>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="relative">
              <div className="aspect-video bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
                <span className="text-4xl"></span>
              </div>
              <div className="absolute top-2 left-2 bg-semantic-warning text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                Food
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-neutral-900 mb-2">Foodie Travelers</h3>
              <p className="text-neutral-600 text-sm mb-3">Culinary adventures and restaurant discoveries</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">1,923 members</span>
                <Button className="text-accent-secondary font-medium">Join</Button>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="relative">
              <div className="aspect-video bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
                <span className="text-4xl"></span>
              </div>
              <div className="absolute top-2 left-2 bg-accent-secondary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                Photography
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-neutral-900 mb-2">Travel Photographers</h3>
              <p className="text-neutral-600 text-sm mb-3">Share tips, techniques, and stunning travel photos</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">3,156 members</span>
                <span className="text-accent-secondary font-medium">Joined</span>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="relative">
              <div className="aspect-video bg-gradient-to-r from-red-400 to-pink-500 flex items-center justify-center">
                <span className="text-4xl"></span>
              </div>
              <div className="absolute top-2 left-2 bg-indigo-600 text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                Culture
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-neutral-900 mb-2">Cultural Explorers</h3>
              <p className="text-neutral-600 text-sm mb-3">Deep dives into local cultures and traditions</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">1,734 members</span>
                <Button className="text-accent-secondary font-medium">Join</Button>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="relative">
              <div className="aspect-video bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                <span className="text-4xl">️</span>
              </div>
              <div className="absolute top-2 left-2 bg-teal-600 text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                Relaxation
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-neutral-900 mb-2">Wellness Retreats</h3>
              <p className="text-neutral-600 text-sm mb-3">Yoga, meditation, and wellness travel experiences</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">987 members</span>
                <Button className="text-accent-secondary font-medium">Join</Button>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="relative">
              <div className="aspect-video bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center">
                <span className="text-4xl">️</span>
              </div>
              <div className="absolute top-2 left-2 bg-pink-600 text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                Solo Travel
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-neutral-900 mb-2">Solo Travelers</h3>
              <p className="text-neutral-600 text-sm mb-3">Tips and support for traveling alone safely</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">2,341 members</span>
                <span className="text-accent-secondary font-medium">Joined</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">My Groups</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Active Groups (3)</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-accent-primary/10 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-lg">️</span>
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">Outdoor Enthusiasts</p>
                      <p className="text-sm text-neutral-600">2,847 members</p>
                    </div>
                  </div>
                  <Button className="text-semantic-error hover:text-red-800 text-sm">Leave</Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-accent-primary/10 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-lg"></span>
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">Travel Photographers</p>
                      <p className="text-sm text-neutral-600">3,156 members</p>
                    </div>
                  </div>
                  <Button className="text-semantic-error hover:text-red-800 text-sm">Leave</Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-lg">️</span>
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">Solo Travelers</p>
                      <p className="text-sm text-neutral-600">2,341 members</p>
                    </div>
                  </div>
                  <Button className="text-semantic-error hover:text-red-800 text-sm">Leave</Button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Group Activity</h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded">
                  <p className="text-sm text-blue-900 mb-1">New post in Outdoor Enthusiasts</p>
                  <p className="text-xs text-accent-tertiary">Sarah shared a hiking trail in Patagonia</p>
                  <p className="text-xs text-accent-secondary mt-1">2 hours ago</p>
                </div>

                <div className="p-3 bg-green-50 rounded">
                  <p className="text-sm text-green-900 mb-1">Event reminder</p>
                  <p className="text-xs text-semantic-success">Photography workshop starts tomorrow</p>
                  <p className="text-xs text-semantic-success mt-1">5 hours ago</p>
                </div>

                <div className="p-3 bg-purple-50 rounded">
                  <p className="text-sm text-purple-900 mb-1">New member joined</p>
                  <p className="text-xs text-purple-700">Mike joined Solo Travelers</p>
                  <p className="text-xs text-accent-primary mt-1">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Create Your Own Group</h2>
          <p className="text-neutral-600 mb-4">
            Start a group for your specific travel interests and connect with like-minded adventurers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              type="text"
              placeholder="Group name..."
              className="flex-1 px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
            />
            <Select className="px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary">
              <SelectItem value="select-category">Select category</SelectItem>
              <SelectItem value="adventure">Adventure</SelectItem>
              <SelectItem value="food">Food</SelectItem>
              <SelectItem value="photography">Photography</SelectItem>
              <SelectItem value="culture">Culture</SelectItem>
              <SelectItem value="wellness">Wellness</SelectItem>
              <SelectItem value="solo-travel">Solo Travel</SelectItem>
            </Select>
            <Button className="bg-accent-secondary text-primary-foreground px-6 py-2 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Create Group
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
