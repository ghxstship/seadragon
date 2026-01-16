
'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function HomeCommunityMessagesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Messages</h1>
          <p className="text-neutral-600">Stay connected with your travel community</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-background rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Conversations</h2>
              <div className="space-y-2">
                <div className="flex items-center p-3 bg-blue-50 rounded-lg cursor-pointer">
                  <div className="relative mr-3">
                    <div className="w-10 h-10 bg-accent-primary/10 rounded-full flex items-center justify-center text-accent-secondary font-semibold">
                      SC
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-semantic-success rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-neutral-900">Sarah Chen</p>
                    <p className="text-sm text-neutral-600 truncate">Hey! Are you planning any trips soon?</p>
                  </div>
                  <span className="text-xs text-neutral-500">2m</span>
                </div>

                <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div className="relative mr-3">
                    <div className="w-10 h-10 bg-semantic-success/10 rounded-full flex items-center justify-center text-semantic-success font-semibold">
                      MR
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-neutral-400 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-neutral-900">Marcus Rodriguez</p>
                    <p className="text-sm text-neutral-600 truncate">Thanks for the Kyoto recommendations!</p>
                  </div>
                  <span className="text-xs text-neutral-500">1h</span>
                </div>

                <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div className="relative mr-3">
                    <div className="w-10 h-10 bg-accent-primary/10 rounded-full flex items-center justify-center text-accent-primary font-semibold">
                      ET
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-neutral-400 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-neutral-900">Emma Thompson</p>
                    <p className="text-sm text-neutral-600 truncate">The photos from Santorini are amazing!</p>
                  </div>
                  <span className="text-xs text-neutral-500">2h</span>
                </div>

                <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div className="relative mr-3">
                    <div className="w-10 h-10 bg-semantic-warning/10 rounded-full flex items-center justify-center text-semantic-warning font-semibold">
                      DK
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-semantic-success rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-neutral-900">David Kim</p>
                    <p className="text-sm text-neutral-600 truncate">Want to connect about Seoul food scene?</p>
                  </div>
                  <span className="text-xs text-neutral-500">1d</span>
                </div>

                <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div className="relative mr-3">
                    <div className="w-10 h-10 bg-semantic-error/10 rounded-full flex items-center justify-center text-semantic-error font-semibold">
                      LW
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-neutral-400 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-neutral-900">Lisa Wang</p>
                    <p className="text-sm text-neutral-600 truncate">Check out this Shanghai street food tour</p>
                  </div>
                  <span className="text-xs text-neutral-500">2d</span>
                </div>
              </div>

              <div className="mt-4">
                <Button className="w-full bg-accent-secondary text-primary-foreground py-2 px-4 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
                  New Message
                </Button>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-background rounded-lg shadow-md h-96 flex flex-col">
              <div className="p-4 border-b border-neutral-200">
                <div className="flex items-center">
                  <div className="relative mr-3">
                    <div className="w-10 h-10 bg-accent-primary/10 rounded-full flex items-center justify-center text-accent-secondary font-semibold">
                      SC
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-semantic-success rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900">Sarah Chen</h3>
                    <p className="text-sm text-neutral-600">Active 2 minutes ago</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex justify-start">
                    <div className="bg-neutral-100 rounded-lg p-3 max-w-xs">
                      <p className="text-sm text-neutral-900">Hey! Saw your post about Kyoto. Are you planning any trips soon?</p>
                      <p className="text-xs text-neutral-500 mt-1">2:30 PM</p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="bg-accent-secondary rounded-lg p-3 max-w-xs">
                      <p className="text-sm text-primary-foreground">Hi Sarah! Yes, I'm heading to Tokyo in March. Have you been to Kyoto before?</p>
                      <p className="text-xs text-blue-100 mt-1">2:32 PM</p>
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <div className="bg-neutral-100 rounded-lg p-3 max-w-xs">
                      <p className="text-sm text-neutral-900">I have! It's absolutely beautiful. The temples and gardens are incredible.</p>
                      <p className="text-xs text-neutral-500 mt-1">2:33 PM</p>
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <div className="bg-neutral-100 rounded-lg p-3 max-w-xs">
                      <p className="text-sm text-neutral-900">You should definitely try the tea ceremony experience. It's a must-do!</p>
                      <p className="text-xs text-neutral-500 mt-1">2:34 PM</p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="bg-accent-secondary rounded-lg p-3 max-w-xs">
                      <p className="text-sm text-primary-foreground">That sounds amazing! I'll look into it. Any specific recommendations?</p>
                      <p className="text-xs text-blue-100 mt-1">2:35 PM</p>
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <div className="bg-neutral-100 rounded-lg p-3 max-w-xs">
                      <p className="text-sm text-neutral-900">En is a great place for traditional tea ceremonies. They have English explanations too.</p>
                      <p className="text-xs text-neutral-500 mt-1">2:36 PM</p>
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <div className="bg-neutral-100 rounded-lg p-3 max-w-xs">
                      <p className="text-sm text-neutral-900">Also, check out Kinkaku-ji (Golden Pavilion) - it's stunning!</p>
                      <p className="text-xs text-neutral-500 mt-1">2:37 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-neutral-200">
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  />
                  <Button className="bg-accent-secondary text-primary-foreground px-4 py-2 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
                    Send
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-background rounded-lg shadow-md p-6 mt-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Message Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-neutral-700">Read Receipts</label>
                    <p className="text-sm text-neutral-600">Show when you've read messages</p>
                  </div>
                  <Input type="checkbox" defaultChecked className="ml-3" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-neutral-700">Typing Indicators</label>
                    <p className="text-sm text-neutral-600">Show when someone is typing</p>
                  </div>
                  <Input type="checkbox" defaultChecked className="ml-3" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-neutral-700">Message Notifications</label>
                    <p className="text-sm text-neutral-600">Get notified of new messages</p>
                  </div>
                  <Input type="checkbox" defaultChecked className="ml-3" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-neutral-700">Auto-delete Messages</label>
                    <p className="text-sm text-neutral-600">Delete old messages automatically</p>
                  </div>
                  <Select className="px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary">
                    <SelectItem value="never">Never</SelectItem>
                    <SelectItem value="30-days">30 days</SelectItem>
                    <SelectItem value="90-days">90 days</SelectItem>
                    <SelectItem value="1-year">1 year</SelectItem>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
