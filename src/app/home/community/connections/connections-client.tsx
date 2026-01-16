'use client'

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function CommunityConnectionsClient() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">My Connections</h1>
          <p className="text-neutral-600">Your network of fellow travelers and connections</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Network Stats</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Connections</span>
                <span className="text-lg font-bold text-accent-secondary">247</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Following</span>
                <span className="text-lg font-bold text-semantic-success">189</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Followers</span>
                <span className="text-lg font-bold text-accent-primary">156</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Mutual Connections</span>
                <span className="text-lg font-bold text-semantic-warning">98</span>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-accent-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-accent-secondary text-sm"></span>
                </div>
                <div>
                  <p className="text-sm text-neutral-900">3 new connection requests</p>
                  <p className="text-xs text-neutral-600">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-semantic-success/10 rounded-full flex items-center justify-center">
                  <span className="text-semantic-success text-sm">️</span>
                </div>
                <div>
                  <p className="text-sm text-neutral-900">Sarah liked your post</p>
                  <p className="text-xs text-neutral-600">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-accent-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-accent-primary text-sm"></span>
                </div>
                <div>
                  <p className="text-sm text-neutral-900">Mike commented on your review</p>
                  <p className="text-xs text-neutral-600">6 hours ago</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button className="w-full text-left px-3 py-2 text-neutral-700 hover:bg-neutral-100 rounded">
                <div className="font-medium">Find Connections</div>
                <div className="text-sm text-neutral-600">Discover people to connect with</div>
              </Button>
              <Button className="w-full text-left px-3 py-2 text-neutral-700 hover:bg-neutral-100 rounded">
                <div className="font-medium">Import Contacts</div>
                <div className="text-sm text-neutral-600">Add connections from your contacts</div>
              </Button>
              <Button className="w-full text-left px-3 py-2 text-neutral-700 hover:bg-neutral-100 rounded">
                <div className="font-medium">Connection Requests</div>
                <div className="text-sm text-neutral-600">3 pending requests</div>
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">My Connections</h2>
            <div className="flex space-x-2">
              <Select defaultValue="all-connections">
                <SelectTrigger className="px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-connections">All Connections</SelectItem>
                  <SelectItem value="recently-active">Recently Active</SelectItem>
                  <SelectItem value="travel-buddies">Travel Buddies</SelectItem>
                  <SelectItem value="local-connections">Local Connections</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Sarah Chen', location: 'New York, NY', mutual: 12, avatar: 'SC', status: 'online' },
              { name: 'Marcus Rodriguez', location: 'Los Angeles, CA', mutual: 8, avatar: 'MR', status: 'away' },
              { name: 'Emma Thompson', location: 'London, UK', mutual: 15, avatar: 'ET', status: 'offline' },
              { name: 'David Kim', location: 'Seoul, South Korea', mutual: 6, avatar: 'DK', status: 'online' },
              { name: 'Lisa Wang', location: 'Shanghai, China', mutual: 9, avatar: 'LW', status: 'away' },
              { name: 'Alex Johnson', location: 'Sydney, Australia', mutual: 11, avatar: 'AJ', status: 'online' }
            ].map((connection, index) => (
              <div key={index} className="border border-neutral-200 rounded-lg p-4 hover:border-neutral-300 transition-colors">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center text-accent-secondary font-semibold">
                      {connection.avatar}
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        connection.status === 'online'
                          ? 'bg-semantic-success'
                          : connection.status === 'away'
                            ? 'bg-semantic-warning'
                            : 'bg-neutral-400'
                      }`}
                    ></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-neutral-900">{connection.name}</h3>
                    <p className="text-sm text-neutral-600">{connection.location}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">{connection.mutual} mutual connections</span>
                  <div className="flex space-x-2">
                    <Button className="text-accent-secondary hover:text-blue-800 text-sm">Message</Button>
                    <Button className="text-neutral-600 hover:text-neutral-800 text-sm">View Profile</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Suggested Connections</h2>
          <p className="text-neutral-600 mb-4">
            People you might know based on your travel history and connections.
          </p>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { name: 'Jessica Liu', reason: 'Travels to Japan', avatar: 'JL' },
              { name: 'Tom Anderson', reason: 'Connected to Sarah', avatar: 'TA' },
              { name: 'Maria Garcia', reason: 'Similar interests', avatar: 'MG' },
              { name: 'Kevin Brown', reason: 'Visited same places', avatar: 'KB' }
            ].map((suggestion, index) => (
              <div key={index} className="bg-background rounded-lg p-4 text-center">
                <div className="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center mx-auto mb-3 text-neutral-600 font-semibold">
                  {suggestion.avatar}
                </div>
                <h3 className="font-medium text-neutral-900 mb-1">{suggestion.name}</h3>
                <p className="text-sm text-neutral-600 mb-3">{suggestion.reason}</p>
                <Button className="w-full bg-accent-secondary text-primary-foreground py-1 px-3 rounded text-sm hover:bg-accent-tertiary">
                  Connect
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
