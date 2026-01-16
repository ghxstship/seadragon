'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function NotificationsClient() {
  const [emailDigestFrequency, setEmailDigestFrequency] = useState('real-time-immediate')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Notification Settings</h1>
          <p className="text-neutral-600">Choose what notifications you want to receive and how</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Email Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-neutral-700">Booking Confirmations</label>
                  <p className="text-sm text-neutral-600">When bookings are confirmed</p>
                </div>
                <Input type="checkbox" defaultChecked className="ml-3" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-neutral-700">Booking Updates</label>
                  <p className="text-sm text-neutral-600">Changes to your reservations</p>
                </div>
                <Input type="checkbox" defaultChecked className="ml-3" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-neutral-700">Travel Reminders</label>
                  <p className="text-sm text-neutral-600">Upcoming trips and check-in alerts</p>
                </div>
                <Input type="checkbox" defaultChecked className="ml-3" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-neutral-700">Price Alerts</label>
                  <p className="text-sm text-neutral-600">When prices drop on saved items</p>
                </div>
                <Input type="checkbox" defaultChecked className="ml-3" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-neutral-700">Account Security</label>
                  <p className="text-sm text-neutral-600">Login attempts and security alerts</p>
                </div>
                <Input type="checkbox" defaultChecked className="ml-3" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-neutral-700">Marketing Updates</label>
                  <p className="text-sm text-neutral-600">New features and travel deals</p>
                </div>
                <Input type="checkbox" className="ml-3" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-neutral-700">Newsletter</label>
                  <p className="text-sm text-neutral-600">Weekly travel inspiration</p>
                </div>
                <Input type="checkbox" className="ml-3" />
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Push Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-neutral-700">Mobile App Alerts</label>
                  <p className="text-sm text-neutral-600">Booking updates and reminders</p>
                </div>
                <Input type="checkbox" defaultChecked className="ml-3" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-neutral-700">Flight Status</label>
                  <p className="text-sm text-neutral-600">Delays and gate changes</p>
                </div>
                <Input type="checkbox" defaultChecked className="ml-3" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-neutral-700">Check-in Reminders</label>
                  <p className="text-sm text-neutral-600">24 hours before departure</p>
                </div>
                <Input type="checkbox" defaultChecked className="ml-3" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-neutral-700">Experience Updates</label>
                  <p className="text-sm text-neutral-600">Changes to your booked activities</p>
                </div>
                <Input type="checkbox" defaultChecked className="ml-3" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-neutral-700">Messages</label>
                  <p className="text-sm text-neutral-600">New messages from connections</p>
                </div>
                <Input type="checkbox" defaultChecked className="ml-3" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-neutral-700">Community Activity</label>
                  <p className="text-sm text-neutral-600">Likes, comments, and mentions</p>
                </div>
                <Input type="checkbox" className="ml-3" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-neutral-700">System Updates</label>
                  <p className="text-sm text-neutral-600">Platform maintenance and updates</p>
                </div>
                <Input type="checkbox" defaultChecked className="ml-3" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">SMS Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-neutral-700">Booking Confirmations</label>
                  <p className="text-sm text-neutral-600">SMS confirmations for bookings</p>
                </div>
                <Input type="checkbox" defaultChecked className="ml-3" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-neutral-700">Flight Updates</label>
                  <p className="text-sm text-neutral-600">Critical flight information</p>
                </div>
                <Input type="checkbox" defaultChecked className="ml-3" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-neutral-700">Security Alerts</label>
                  <p className="text-sm text-neutral-600">Account security notifications</p>
                </div>
                <Input type="checkbox" defaultChecked className="ml-3" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-neutral-700">Emergency Updates</label>
                  <p className="text-sm text-neutral-600">Urgent travel information</p>
                </div>
                <Input type="checkbox" defaultChecked className="ml-3" />
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Notification Schedule</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Quiet Hours
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="time"
                    defaultValue="22:00"
                    className="px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  />
                  <Input
                    type="time"
                    defaultValue="08:00"
                    className="px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  />
                </div>
                <p className="text-xs text-neutral-500 mt-1">No notifications between these hours</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Email Digest Frequency
                </label>
                <Select
                  value={emailDigestFrequency}
                  onValueChange={setEmailDigestFrequency}
                >
                  <SelectTrigger className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary">
                    <SelectValue placeholder="Choose frequency"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="real-time-immediate">Real-time (immediate)</SelectItem>
                    <SelectItem value="daily-summary">Daily summary</SelectItem>
                    <SelectItem value="weekly-digest">Weekly digest</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center">
                <Input type="checkbox" id="weekend-pause" className="mr-3" />
                <label htmlFor="weekend-pause" className="text-sm">
                  Pause notifications on weekends
                </label>
              </div>

              <div className="flex items-center">
                <Input type="checkbox" id="travel-mode" className="mr-3" />
                <label htmlFor="travel-mode" className="text-sm">
                  Enable travel mode (reduced notifications when abroad)
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Notification History</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-neutral-200 rounded">
              <div>
                <p className="text-sm font-medium text-neutral-900">Flight JL 789 delayed by 2 hours</p>
                <p className="text-xs text-neutral-600">Email • March 10, 2024</p>
              </div>
              <span className="text-semantic-success text-xs">Delivered</span>
            </div>

            <div className="flex items-center justify-between p-3 border border-neutral-200 rounded">
              <div>
                <p className="text-sm font-medium text-neutral-900">Booking confirmation: Santorini Photography</p>
                <p className="text-xs text-neutral-600">Push • March 8, 2024</p>
              </div>
              <span className="text-semantic-success text-xs">Delivered</span>
            </div>

            <div className="flex items-center justify-between p-3 border border-neutral-200 rounded">
              <div>
                <p className="text-sm font-medium text-neutral-900">New experience available near you</p>
                <p className="text-xs text-neutral-600">Email • March 5, 2024</p>
              </div>
              <span className="text-semantic-warning text-xs">Opened</span>
            </div>

            <div className="flex items-center justify-between p-3 border border-neutral-200 rounded">
              <div>
                <p className="text-sm font-medium text-neutral-900">Weekly travel newsletter</p>
                <p className="text-xs text-neutral-600">Email • March 1, 2024</p>
              </div>
              <span className="text-neutral-600 text-xs">Sent</span>
            </div>
          </div>

          <div className="mt-4 text-center">
            <Button className="text-accent-secondary hover:text-blue-800">
              View Complete History →
            </Button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Notification Tips</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-neutral-900 mb-2">Stay Informed</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Enable critical travel notifications</li>
                <li>• Set up quiet hours for uninterrupted sleep</li>
                <li>• Use push notifications for urgent updates</li>
                <li>• Customize based on your travel preferences</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-2">Avoid Overload</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Unsubscribe from marketing emails if preferred</li>
                <li>• Use digest mode for less frequent updates</li>
                <li>• Pause notifications during travel</li>
                <li>• Review and adjust settings regularly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
