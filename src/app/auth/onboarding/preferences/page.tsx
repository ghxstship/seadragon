
'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function OnboardingPreferencesPage() {
  return (
    <div className="min-h-screen bg-transparent text-[--text-primary]">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-[--color-accent-primary]/15 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl text-[--color-accent-primary]">✨</span>
            </div>
            <h1 className="text-3xl heading-anton">Set Your Preferences</h1>
            <p className="text-[--text-secondary] body-share-tech">Customize your experience</p>
          </div>

          <Card className="border border-[--border-default] bg-[--surface-default]/90 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur">
            <CardHeader>
              <CardTitle className="heading-anton">Preferences</CardTitle>
              <CardDescription className="text-[--text-secondary] body-share-tech">Choose how we communicate and display your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[--text-primary]">Communication Preferences</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-[--text-secondary] body-share-tech">Email Notifications</span>
                        <a href="/auth/onboarding/preferences/notifications" className="text-[--color-accent-primary] hover:underline text-sm">
                          Customize
                        </a>
                      </label>
                      <p className="text-sm text-[--text-secondary] body-share-tech">Booking confirmations, updates, and travel alerts</p>
                      <div className="mt-2 flex items-center space-x-2">
                        <Input type="checkbox" id="email-booking" className="h-4 w-4" defaultChecked />
                        <label htmlFor="email-booking" className="text-sm text-[--text-primary]">Booking updates</label>
                      </div>
                      <div className="mt-2 flex items-center space-x-2">
                        <Input type="checkbox" id="email-marketing" className="h-4 w-4" />
                        <label htmlFor="email-marketing" className="text-sm text-[--text-primary]">Marketing and promotions</label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[--text-primary]">Privacy Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-[--text-secondary] body-share-tech">Profile Visibility</span>
                        <a href="/auth/onboarding/preferences/privacy" className="text-[--color-accent-primary] hover:underline text-sm">
                          Manage
                        </a>
                      </label>
                      <Select defaultValue="public">
                        <SelectTrigger className="w-full h-11 rounded-full border-[--border-default] bg-[--surface-default]">
                          <SelectValue placeholder="Choose visibility"/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public - Anyone can see my profile</SelectItem>
                          <SelectItem value="friends">Friends Only - Connections only</SelectItem>
                          <SelectItem value="private">Private - Profile hidden</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Input type="checkbox" id="data-sharing" className="h-4 w-4" />
                      <label htmlFor="data-sharing" className="text-sm text-[--text-primary]">
                        Allow anonymous usage data sharing to improve the platform
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[--text-primary]">Display Preferences</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-[--text-secondary] body-share-tech mb-2">
                        Theme
                      </label>
                      <Select defaultValue="system">
                        <SelectTrigger className="w-full h-11 rounded-full border-[--border-default] bg-[--surface-default]">
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
                      <label className="block text-sm text-[--text-secondary] body-share-tech mb-2">
                        Language
                      </label>
                      <Select defaultValue="en-us">
                        <SelectTrigger className="w-full h-11 rounded-full border-[--border-default] bg-[--surface-default]">
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
                      <label className="block text-sm text-[--text-secondary] body-share-tech mb-2">
                        Currency
                      </label>
                      <Select defaultValue="usd">
                        <SelectTrigger className="w-full h-11 rounded-full border-[--border-default] bg-[--surface-default]">
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
                  className="w-full h-11 rounded-full bg-[--color-accent-primary] text-white shadow-[0_10px_24px_rgba(0,0,0,0.16)] hover:-translate-y-0.5 transition"
                >
                  Save Preferences & Continue
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="text-center">
            <p className="text-sm text-[--text-secondary] body-share-tech">
              You can change these settings anytime in your account preferences
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
