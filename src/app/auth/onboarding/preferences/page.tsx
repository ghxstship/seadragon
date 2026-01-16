
'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function OnboardingPreferencesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">️</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Set Your Preferences</h1>
          <p className="text-neutral-600">Customize your experience</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-6">
          <form className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-neutral-900 mb-4">Communication Preferences</h3>

              <div className="space-y-4">
                <div>
                  <label className="flex items-center justify-between">
                    <span className="text-sm font-medium text-neutral-700">Email Notifications</span>
                    <a href="/auth/onboarding/preferences/notifications" className="text-accent-secondary hover:text-blue-800 text-sm">
                      Customize
                    </a>
                  </label>
                  <p className="text-sm text-neutral-600">Booking confirmations, updates, and travel alerts</p>
                  <div className="mt-2 flex items-center">
                    <Input type="checkbox" id="email-booking" className="mr-3" defaultChecked />
                    <label htmlFor="email-booking" className="text-sm">Booking updates</label>
                  </div>
                  <div className="mt-2 flex items-center">
                    <Input type="checkbox" id="email-marketing" className="mr-3" />
                    <label htmlFor="email-marketing" className="text-sm">Marketing and promotions</label>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-neutral-900 mb-4">Privacy Settings</h3>

              <div className="space-y-4">
                <div>
                  <label className="flex items-center justify-between">
                    <span className="text-sm font-medium text-neutral-700">Profile Visibility</span>
                    <a href="/auth/onboarding/preferences/privacy" className="text-accent-secondary hover:text-blue-800 text-sm">
                      Manage
                    </a>
                  </label>
                  <Select defaultValue="public">
                    <SelectTrigger className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <SelectValue placeholder="Choose visibility"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public - Anyone can see my profile</SelectItem>
                      <SelectItem value="friends">Friends Only - Connections only</SelectItem>
                      <SelectItem value="private">Private - Profile hidden</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="flex items-center">
                    <Input type="checkbox" id="data-sharing" className="mr-3" />
                    <label htmlFor="data-sharing" className="text-sm">
                      Allow anonymous usage data sharing to improve the platform
                    </label>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-neutral-900 mb-4">Display Preferences</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Theme
                  </label>
                  <Select defaultValue="system">
                    <SelectTrigger className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <SelectValue placeholder="Choose theme"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">System Default</SelectItem>
                      <SelectItem value="light">Light Mode</SelectItem>
                      <SelectItem value="dark">Dark Mode</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Language
                  </label>
                  <Select defaultValue="en-us">
                    <SelectTrigger className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <SelectValue placeholder="Choose language"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en-us">English (US)</SelectItem>
                      <SelectItem value="en-uk">English (UK)</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Currency
                  </label>
                  <Select defaultValue="usd">
                    <SelectTrigger className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <SelectValue placeholder="Choose currency"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                      <SelectItem value="gbp">GBP (£)</SelectItem>
                      <SelectItem value="jpy">JPY (¥)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-indigo-600 text-primary-foreground py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Save Preferences & Continue
            </Button>
          </form>
        </div>

        <div className="text-center">
          <p className="text-sm text-neutral-600">
            You can change these settings anytime in your account preferences
          </p>
        </div>
      </div>
    </div>
  )
}
